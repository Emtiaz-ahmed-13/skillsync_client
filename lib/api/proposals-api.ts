// API service for handling project proposals
const API_BASE_URL =
  "/api/v1";

interface Proposal {
  _id: string;
  projectId: string;
  freelancerId: string;
  coverLetter: string;
  resumeUrl?: string;
  amount: number;
  timeline: number;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
  updatedAt: string;
  freelancer: {
    name: string;
    email: string;
    avatar?: string;
  };
}

interface ProposalResponse {
  success: boolean;
  message: string;
  data?: Proposal | Proposal[] | null;
}

const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Get proposals for a specific project (client view)
export const getProposalsByProject = async (
  projectId: string
): Promise<ProposalResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/bids?projectId=${projectId}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching proposals by project:", error);
    return {
      success: false,
      message: "Failed to fetch proposals",
      data: null,
    };
  }
};

// Get proposals for a freelancer (freelancer view)
export const getProposalsByFreelancer = async (): Promise<ProposalResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/freelancer`, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching freelancer proposals:", error);
    return {
      success: false,
      message: "Failed to fetch proposals",
      data: null,
    };
  }
};

// Submit a new proposal
export const submitProposal = async (
  projectId: string,
  coverLetter: string,
  amount: number,
  timeline: number,
  resumeUrl?: string
): Promise<ProposalResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        coverLetter,
        amount,
        timeline,
        resumeUrl,
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error submitting proposal:", error);
    return {
      success: false,
      message: "Failed to submit proposal",
      data: null,
    };
  }
};

// Accept a proposal (client action)
export const acceptProposal = async (
  proposalId: string
): Promise<ProposalResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/${proposalId}/accept`, {
      method: "PUT",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error accepting proposal:", error);
    return {
      success: false,
      message: "Failed to accept proposal",
      data: null,
    };
  }
};

// Reject a proposal (client action)
export const rejectProposal = async (
  proposalId: string
): Promise<ProposalResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/${proposalId}/reject`, {
      method: "PUT",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error rejecting proposal:", error);
    return {
      success: false,
      message: "Failed to reject proposal",
      data: null,
    };
  }
};

// Get a specific proposal by ID
export const getProposalById = async (
  proposalId: string
): Promise<ProposalResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bids/${proposalId}`, {
      method: "GET",
      headers: getHeaders(),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching proposal:", error);
    return {
      success: false,
      message: "Failed to fetch proposal",
      data: null,
    };
  }
};
