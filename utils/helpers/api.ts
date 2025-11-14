/**
 * Handles API errors and returns a user-friendly message
 * @param error - The error object
 * @returns A user-friendly error message
 */
export function handleApiError(error: any): string {
  if (error instanceof Error) {
    // Handle network errors
    if (error.message.includes("fetch")) {
      return "Network error. Please check your connection and try again.";
    }

    // Handle timeout errors
    if (error.message.includes("timeout")) {
      return "Request timeout. Please try again.";
    }

    // Return the error message if it's a known error
    return error.message;
  }

  // Handle HTTP errors
  if (error && typeof error === "object") {
    if ("message" in error) {
      return (error as { message: string }).message;
    }

    if ("status" in error) {
      const status = (error as { status: number }).status;
      switch (status) {
        case 400:
          return "Bad request. Please check your input and try again.";
        case 401:
          return "Unauthorized. Please log in and try again.";
        case 403:
          return "Forbidden. You don't have permission to perform this action.";
        case 404:
          return "Resource not found.";
        case 500:
          return "Internal server error. Please try again later.";
        default:
          return `An error occurred (status: ${status}). Please try again.`;
      }
    }
  }

  // Default error message
  return "An unexpected error occurred. Please try again.";
}

/**
 * Checks if the response is successful
 * @param response - The fetch response
 * @returns true if successful, false otherwise
 */
export function isResponseOk(response: Response): boolean {
  return response.ok;
}

/**
 * Parses JSON response
 * @param response - The fetch response
 * @returns Parsed JSON data
 */
export async function parseJsonResponse(response: Response): Promise<any> {
  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Invalid response format");
  }
}
