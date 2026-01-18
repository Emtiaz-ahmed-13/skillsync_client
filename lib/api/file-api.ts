import { apiClient } from "./api-client";

export interface FileUpload {
    id: string;
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    url: string;
    projectId?: string;
    milestoneId?: string;
    uploadedBy: string;
    folder?: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileListResponse {
    files: FileUpload[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalFiles: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export const fileApi = {
    /**
     * Upload single file with progress tracking
     */
    upload: async (
        file: File,
        projectId: string,
        token: string,
        milestoneId?: string,
        onProgress?: (progress: number) => void
    ): Promise<FileUpload> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectId);
        if (milestoneId) {
            formData.append("milestoneId", milestoneId);
        }

        return apiClient.uploadFile<FileUpload>("/files/upload", formData, {
            token,
            onProgress,
        });
    },

    /**
     * Upload multiple files
     */
    uploadMultiple: async (
        files: File[],
        projectId: string,
        token: string,
        milestoneId?: string,
        onProgress?: (fileIndex: number, progress: number) => void
    ): Promise<FileUpload[]> => {
        const uploadPromises = files.map((file, index) =>
            fileApi.upload(
                file,
                projectId,
                token,
                milestoneId,
                onProgress ? (progress) => onProgress(index, progress) : undefined
            )
        );

        return Promise.all(uploadPromises);
    },

    /**
     * Get file by ID
     */
    getById: (id: string, token: string) =>
        apiClient.get<FileUpload>(`/files/${id}`, { token }),

    /**
     * Get project files with pagination
     */
    getProjectFiles: (
        projectId: string,
        token: string,
        page: number = 1,
        limit: number = 20
    ) =>
        apiClient.get<FileListResponse>(
            `/files/project/${projectId}?page=${page}&limit=${limit}`,
            { token }
        ),

    /**
     * Delete file
     */
    delete: (id: string, token: string) =>
        apiClient.delete<void>(`/files/${id}`, { token }),

    /**
     * Download file (opens in new tab)
     */
    download: (url: string, filename: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
};
