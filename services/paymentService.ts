import apiClient from "../utils/apiClient";

// Create Payment Intent
export const createPaymentIntent = async (paymentData: {
  amount: number;
  currency: string;
  projectId: string;
  milestoneId?: string;
}) => {
  try {
    const response = await apiClient.post(
      "/payments/create-payment-intent",
      paymentData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to create payment intent");
  }
};

// Process Payment
export const processPayment = async (paymentData: any) => {
  try {
    const response = await apiClient.post("/payments/process", paymentData);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to process payment");
  }
};

// Get Payment History
export const getPaymentHistory = async (params: Record<string, any> = {}) => {
  try {
    const response = await apiClient.get("/payments/history", params);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch payment history");
  }
};

// Get Payment By ID
export const getPaymentById = async (paymentId: string) => {
  try {
    const response = await apiClient.get(`/payments/${paymentId}`);
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to fetch payment");
  }
};

// Refund Payment
export const refundPayment = async (paymentId: string, refundData: any) => {
  try {
    const response = await apiClient.post(
      `/payments/${paymentId}/refund`,
      refundData
    );
    return response;
  } catch (error: any) {
    throw new Error(error.message || "Failed to refund payment");
  }
};
