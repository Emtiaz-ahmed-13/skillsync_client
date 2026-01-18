import { apiClient } from "./api-client";

export interface Payment {
    id: string;
    projectId: string;
    milestoneId?: string;
    clientId: string;
    freelancerId: string;
    amount: number;
    currency: string;
    status: "pending" | "processing" | "completed" | "failed" | "refunded";
    method: "stripe" | "paypal" | "bank_transfer";
    stripePaymentIntentId?: string;
    stripeCustomerId?: string;
    transactionId?: string;
    description?: string;
    paidAt?: string;
    refundedAt?: string;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface CreatePaymentIntentData {
    amount: number;
    currency?: string;
    milestoneId?: string;
    projectId: string;
    freelancerId: string;
}

export interface PaymentIntentResponse {
    payment: Payment;
    clientSecret: string;
}

export interface PaymentListResponse {
    payments: Payment[];
    totalAmount: number;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalPayments: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface ProjectPaymentsResponse {
    payments: Payment[];
    totalAmount: number;
    totalPayments: number;
}

export const paymentApi = {
    /**
     * Create payment intent (Stripe)
     */
    createIntent: (data: CreatePaymentIntentData, token: string) =>
        apiClient.post<PaymentIntentResponse>("/payments/create-intent", data, { token }),

    /**
     * Get payment by ID
     */
    getById: (id: string, token: string) =>
        apiClient.get<Payment>(`/payments/${id}`, { token }),

    /**
     * Get user payments with pagination
     */
    getUserPayments: (token: string, page: number = 1, limit: number = 10) =>
        apiClient.get<PaymentListResponse>(`/payments?page=${page}&limit=${limit}`, { token }),

    /**
     * Get project payments
     */
    getProjectPayments: (projectId: string, token: string) =>
        apiClient.get<ProjectPaymentsResponse>(`/payments/project/${projectId}`, { token }),

    /**
     * Update payment (admin only)
     */
    update: (id: string, updates: Partial<Payment>, token: string) =>
        apiClient.put<Payment>(`/payments/${id}`, updates, { token }),
};
