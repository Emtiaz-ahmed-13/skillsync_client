// API Client using fetch API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Helper function to get headers
const getHeaders = (includeAuth: boolean = true) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to handle errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("accessToken");
      window.location.href = "/auth/login";
    }

    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

// Generic request function
const apiClient = {
  get: async (endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);

    // Add query parameters
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: getHeaders(),
    });

    return handleResponse(response);
  },

  post: async (
    endpoint: string,
    data: any = {},
    includeAuth: boolean = true
  ) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(includeAuth),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  put: async (endpoint: string, data: any = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  },

  delete: async (endpoint: string) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    return handleResponse(response);
  },
};

export default apiClient;