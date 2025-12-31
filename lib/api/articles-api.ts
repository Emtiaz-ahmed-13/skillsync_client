// API service for articles/blog posts

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface Article {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  tags: string[];
  readTime: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
  isFeatured?: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  imageUrl?: string;
}

export interface CreateArticleRequest {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  readTime: string;
  authorId: string;
  isFeatured?: boolean;
  imageUrl?: string;
}

// API base URL - use environment variable or default to backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Helper function to generate headers with auth token if available
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add authorization header if token exists in localStorage
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// 1. Get all articles
export const getArticles = async (
  page: number = 1,
  limit: number = 10,
  category?: string,
  search?: string
) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    if (category) {
      params.append("category", category);
    }

    if (search) {
      params.append("search", search);
    }

    const response = await fetch(
      `${API_BASE_URL}/articles/getAllArticles?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch articles: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch articles: ${response.status}`,
        data: {
          articles: [],
          total: 0,
          page: 1,
          totalPages: 1,
        },
      };
    }

    const result = await response.json();

    // Transform response to match expected format
    return {
      success: result.success,
      message: result.message || "Articles retrieved successfully",
      data: {
        articles: result.data?.articles || result.data || [],
        total: result.data?.total || 0,
        page: result.data?.page || page,
        totalPages: result.data?.totalPages || 1,
      },
    };
  } catch (error) {
    console.error("Error fetching articles:", error);
    // Return empty data in case of error
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch articles",
      data: {
        articles: [],
        total: 0,
        page: 1,
        totalPages: 1,
      },
    };
  }
};

// 2. Get article by ID
export const getArticleById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return null instead
      console.warn(
        `Failed to fetch article by ID: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch article: ${response.status}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article retrieved successfully",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch article",
      data: null,
    };
  }
};

// 3. Get featured articles
export const getFeaturedArticles = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/featured`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch featured articles: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch featured articles: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Featured articles retrieved successfully",
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching featured articles:", error);
    // Return success: false but with empty data instead of throwing
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch featured articles",
      data: [],
    };
  }
};

// 4. Get articles by category
export const getArticlesByCategory = async (category: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/articles/category/${encodeURIComponent(category)}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch articles by category: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch articles in category ${category}: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message:
        result.message ||
        `Articles in category ${category} retrieved successfully`,
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching articles by category:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : `Failed to fetch articles in category ${category}`,
      data: [],
    };
  }
};

// 5. Get articles by author
export const getArticlesByAuthor = async (authorId: string) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/articles/author/${encodeURIComponent(authorId)}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch articles by author: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch articles by author ${authorId}: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message:
        result.message ||
        `Articles by author ${authorId} retrieved successfully`,
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching articles by author:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : `Failed to fetch articles by author ${authorId}`,
      data: [],
    };
  }
};

// 6. Create new article (for client and freelancer use)
export const createArticle = async (
  articleData: CreateArticleRequest | FormData,
  accessToken?: string
) => {
  try {
    const headers: Record<string, string> = {};
    
    // Add authorization header if token provided
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    
    // Only set Content-Type for JSON, let browser set it for FormData
    const isFormData = articleData instanceof FormData;
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_BASE_URL}/articles/create-article`, {
      method: "POST",
      headers,
      body: isFormData ? articleData : JSON.stringify(articleData),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to create article: ${response.status} ${response.statusText}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article created successfully",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error creating article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create article",
      data: null,
    };
  }
};

// 7. Update article (for admin use)
export const updateArticle = async (
  id: string,
  articleData: Partial<CreateArticleRequest>
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(articleData),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return null instead
      console.warn(
        `Failed to update article: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to update article: ${response.status}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article updated successfully",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error updating article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update article",
      data: null,
    };
  }
};

// 8. Delete article (for admin use)
export const deleteArticle = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return null instead
      console.warn(
        `Failed to delete article: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to delete article: ${response.status}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article deleted successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error deleting article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete article",
      data: null,
    };
  }
};

// 9. Increment article view count
export const incrementArticleView = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/view`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return null instead
      console.warn(
        `Failed to increment article view: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to increment view count: ${response.status}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "View count incremented",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error incrementing article view:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to increment view count",
      data: null,
    };
  }
};

// 10. Like article
export const likeArticle = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/like`, {
      method: "POST",
      headers: getHeaders(),
    });

    if (!response.ok) {
      // Don't throw an error for server issues, return null instead
      console.warn(
        `Failed to like article: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to like article: ${response.status}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article liked",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error liking article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to like article",
      data: null,
    };
  }
};

// 11. Get popular articles (by view count)
export const getPopularArticles = async (limit: number = 5) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/articles/popular?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch popular articles: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch popular articles: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Popular articles retrieved successfully",
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching popular articles:", error);
    // Return success: false but with empty data instead of throwing
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch popular articles",
      data: [],
    };
  }
};

// 12. Get related articles
export const getRelatedArticles = async (
  currentArticleId: string,
  limit: number = 3
) => {
  try {
    const params = new URLSearchParams();
    params.append("limit", limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/articles/${currentArticleId}/related?${params.toString()}`,
      {
        method: "GET",
        headers: getHeaders(),
      }
    );

    if (!response.ok) {
      // Don't throw an error for server issues, return empty data instead
      console.warn(
        `Failed to fetch related articles: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch related articles: ${response.status}`,
        data: [],
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Related articles retrieved successfully",
      data: result.data || [],
    };
  } catch (error) {
    console.error("Error fetching related articles:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch related articles",
      data: [],
    };
  }
};

// 13. Get pending articles (Admin only)
export const getPendingArticles = async (
  accessToken: string,
  page: number = 1,
  limit: number = 10
) => {
  try {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/articles/pending/list?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(
        `Failed to fetch pending articles: ${response.status} ${response.statusText}`
      );
      return {
        success: false,
        message: `Failed to fetch pending articles: ${response.status}`,
        data: {
          articles: [],
          total: 0,
          page: 1,
          totalPages: 1,
        },
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Pending articles retrieved successfully",
      data: result.data || { articles: [], total: 0, page: 1, totalPages: 1 },
    };
  } catch (error) {
    console.error("Error fetching pending articles:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to fetch pending articles",
      data: {
        articles: [],
        total: 0,
        page: 1,
        totalPages: 1,
      },
    };
  }
};

// 14. Approve article (Admin only)
export const approveArticle = async (id: string, accessToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/approve`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ status: "published" }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to approve article: ${response.status} ${response.statusText}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article approved successfully",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error approving article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to approve article",
      data: null,
    };
  }
};

// 15. Reject article (Admin only)
export const rejectArticle = async (
  id: string,
  accessToken: string,
  rejectionReason?: string
) => {
  try {
    const response = await fetch(`${API_BASE_URL}/articles/${id}/reject`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        status: "rejected",
        rejectionReason: rejectionReason || "",
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: `Failed to reject article: ${response.status} ${response.statusText}`,
        data: null,
      };
    }

    const result = await response.json();

    return {
      success: result.success,
      message: result.message || "Article rejected successfully",
      data: result.data || null,
    };
  } catch (error) {
    console.error("Error rejecting article:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to reject article",
      data: null,
    };
  }
};

