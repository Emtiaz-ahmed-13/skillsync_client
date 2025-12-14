import apiClient from "../utils/apiClient";

// Submit a bid for a project
export const submitBid = async (projectId: string, bidData: any) => {
  try {
    const response = await apiClient.post(
      `/projects/${projectId}/bids`,
      bidData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to submit bid");
  }
};

// Get all bids for a project
export const getProjectBids = async (projectId: string) => {
  try {
    const response = await apiClient.get(`/projects/${projectId}/bids`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch project bids");
  }
};

// Get all bids submitted by a freelancer
export const getFreelancerBids = async (freelancerId: string) => {
  try {
    const response = await apiClient.get(`/bids/freelancer/${freelancerId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch freelancer bids");
  }
};

// Accept a bid (by client)
export const acceptBid = async (bidId: string) => {
  try {
    const response = await apiClient.put(`/bids/${bidId}/accept`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to accept bid");
  }
};

// Reject a bid (by client)
export const rejectBid = async (bidId: string) => {
  try {
    const response = await apiClient.put(`/bids/${bidId}/reject`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to reject bid");
  }
};
