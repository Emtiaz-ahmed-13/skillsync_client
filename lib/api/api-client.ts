/**
 * Centralized API Client for SkillSync
 * Handles authentication, error handling, retry logic, and request/response interceptors
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public data?: any
    ) {
        super(message);
        this.name = "ApiError";
    }
}

interface RequestConfig extends RequestInit {
    token?: string;
    retry?: number;
    timeout?: number;
}

class ApiClient {
    private baseURL: string;
    private defaultTimeout: number = 30000; // 30 seconds
    private maxRetries: number = 3;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Main request method with error handling and retry logic
     */
    private async request<T>(
        endpoint: string,
        config: RequestConfig = {}
    ): Promise<T> {
        const {
            token,
            retry = 0,
            timeout = this.defaultTimeout,
            ...fetchConfig
        } = config;

        // Build headers
        const headers: HeadersInit = {
            "Content-Type": "application/json",
            ...fetchConfig.headers,
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                ...fetchConfig,
                headers,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            // Handle non-JSON responses
            const contentType = response.headers.get("content-type");
            const isJson = contentType?.includes("application/json");

            if (!response.ok) {
                const errorData = isJson ? await response.json() : await response.text();

                // Retry on network errors or 5xx errors
                if (
                    (response.status >= 500 || response.status === 429) &&
                    retry < this.maxRetries
                ) {
                    // Exponential backoff: 1s, 2s, 4s
                    const delay = Math.pow(2, retry) * 1000;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    return this.request<T>(endpoint, { ...config, retry: retry + 1 });
                }

                throw new ApiError(
                    response.status,
                    isJson ? errorData.message || "Request failed" : "Request failed",
                    isJson ? errorData : undefined
                );
            }

            // Return parsed JSON or empty object for 204 No Content
            if (response.status === 204) {
                return {} as T;
            }

            const data = isJson ? await response.json() : await response.text();
            return data.data || data;
        } catch (error: any) {
            clearTimeout(timeoutId);

            // Handle timeout
            if (error.name === "AbortError") {
                throw new ApiError(408, "Request timeout");
            }

            // Handle network errors with retry
            if (error instanceof TypeError && retry < this.maxRetries) {
                const delay = Math.pow(2, retry) * 1000;
                await new Promise((resolve) => setTimeout(resolve, delay));
                return this.request<T>(endpoint, { ...config, retry: retry + 1 });
            }

            // Re-throw ApiError
            if (error instanceof ApiError) {
                throw error;
            }

            // Wrap unknown errors
            throw new ApiError(500, error.message || "An unexpected error occurred");
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: "GET" });
    }

    /**
     * POST request
     */
    async post<T>(
        endpoint: string,
        data?: any,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(
        endpoint: string,
        data?: any,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * PATCH request
     */
    async patch<T>(
        endpoint: string,
        data?: any,
        config?: RequestConfig
    ): Promise<T> {
        return this.request<T>(endpoint, {
            ...config,
            method: "PATCH",
            body: data ? JSON.stringify(data) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
        return this.request<T>(endpoint, { ...config, method: "DELETE" });
    }

    /**
     * Upload file with progress tracking
     */
    async uploadFile<T>(
        endpoint: string,
        formData: FormData,
        config?: RequestConfig & { onProgress?: (progress: number) => void }
    ): Promise<T> {
        const { token, onProgress, ...fetchConfig } = config || {};

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Track upload progress
            if (onProgress) {
                xhr.upload.addEventListener("progress", (e) => {
                    if (e.lengthComputable) {
                        const progress = (e.loaded / e.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener("load", () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response.data || response);
                    } catch {
                        resolve(xhr.responseText as any);
                    }
                } else {
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(
                            new ApiError(
                                xhr.status,
                                error.message || "Upload failed",
                                error
                            )
                        );
                    } catch {
                        reject(new ApiError(xhr.status, "Upload failed"));
                    }
                }
            });

            xhr.addEventListener("error", () => {
                reject(new ApiError(500, "Upload failed"));
            });

            xhr.addEventListener("timeout", () => {
                reject(new ApiError(408, "Upload timeout"));
            });

            xhr.open("POST", `${this.baseURL}${endpoint}`);

            if (token) {
                xhr.setRequestHeader("Authorization", `Bearer ${token}`);
            }

            xhr.timeout = fetchConfig.timeout || this.defaultTimeout;
            xhr.send(formData);
        });
    }
}

// Export singleton instance
export const apiClient = new ApiClient(API_URL);

// Export helper to get token from session
export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;

    // Try to get from localStorage (NextAuth stores it there)
    try {
        const session = localStorage.getItem("next-auth.session-token");
        return session;
    } catch {
        return null;
    }
};
