const API_BASE_URL = "/api/v1";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface Review {
  _id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  reviewerType: "client" | "freelancer";
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  projectId: string;
  revieweeId: string;
  reviewerType: "client" | "freelancer";
  rating: number;
  comment: string;
}

export interface UserReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  limit: number;
}

// 1. Create Review
export const createReview = async (
  reviewData: CreateReviewRequest,
  accessToken: string
): Promise<ApiResponse<Review>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews`
      || `localhost:5001/api/v1/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(reviewData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to create review",
        data: null,
      };
    }

    return {
      success: true,
      message: "Review created successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while creating the review",
      data: null,
    };
  }
};

// 2. Get Review by ID
export const getReviewById = async (
  reviewId: string,
  accessToken?: string
): Promise<ApiResponse<Review>> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`
      || `localhost:5001/api/v1/reviews/${reviewId}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch review",
        data: null,
      };
    }

    return {
      success: true,
      message: "Review retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching review:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while fetching the review",
      data: null,
    };
  }
};

// 3. Get Reviews by User
export const getReviewsByUser = async (
  userId: string,
  limit: number = 10,
  page: number = 1,
  accessToken?: string
): Promise<ApiResponse<UserReviewsResponse>> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/reviews/user/${userId}?limit=${limit}&page=${page}`
      || `localhost:5001/api/v1/reviews/user/${userId}?limit=${limit}&page=${page}`,
      {
        method: "GET",
        headers,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch user reviews",
        data: null,
      };
    }

    return {
      success: true,
      message: "User reviews retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while fetching user reviews",
      data: null,
    };
  }
};

// 4. Get Reviews by Project
export const getReviewsByProject = async (
  projectId: string,
  accessToken?: string
): Promise<ApiResponse<Review[]>> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}/reviews/project/${projectId}`
      || `localhost:5001/api/v1/reviews/project/${projectId}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch project reviews",
        data: null,
      };
    }

    return {
      success: true,
      message: "Project reviews retrieved successfully",
      data: data.data,
    };
  } catch (error) {
    console.error("Error fetching project reviews:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while fetching project reviews",
      data: null,
    };
  }
};

// 5. Delete Review
export const deleteReview = async (
  reviewId: string,
  accessToken: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/reviews/${reviewId}`
      || `localhost:5001/api/v1/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to delete review",
        data: null,
      };
    }

    return {
      success: true,
      message: "Review deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while deleting the review",
      data: null,
    };
  }
};
