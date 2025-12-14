import apiClient from "../utils/apiClient";

// Create Review
export const createReview = async (reviewData: {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment: string;
}) => {
  try {
    const response = await apiClient.post("/reviews", reviewData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create review");
  }
};

// Get Reviews For User
export const getReviewsForUser = async (
  userId: string,
  params: Record<string, any> = {}
) => {
  try {
    const response = await apiClient.get(`/reviews/user/${userId}`, params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch reviews");
  }
};

// Get Reviews For Project
export const getReviewsForProject = async (
  projectId: string,
  params: Record<string, any> = {}
) => {
  try {
    const response = await apiClient.get(
      `/reviews/project/${projectId}`,
      params
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch project reviews");
  }
};

// Update Review
export const updateReview = async (reviewId: string, reviewData: any) => {
  try {
    const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to update review");
  }
};

// Delete Review
export const deleteReview = async (reviewId: string) => {
  try {
    const response = await apiClient.delete(`/reviews/${reviewId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to delete review");
  }
};
