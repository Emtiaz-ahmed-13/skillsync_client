import {
  ApplicationError,
  AuthenticationError,
  AuthorizationError,
  FormValidationError,
  NetworkError,
} from "@/types/errors";

/**
 * Creates a standardized error response
 * @param error - The error object
 * @returns A standardized error object
 */
export function createErrorResponse(error: any): ApplicationError {
  if (error instanceof ApplicationError) {
    return error;
  }

  // Handle native JavaScript errors
  if (error instanceof Error) {
    // Check for network errors
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return new NetworkError(error.message);
    }

    // Return as generic application error
    return new ApplicationError(error.message);
  }

  // Handle string errors
  if (typeof error === "string") {
    return new ApplicationError(error);
  }

  // Handle object errors
  if (error && typeof error === "object") {
    if ("message" in error) {
      return new ApplicationError((error as { message: string }).message);
    }
  }

  // Default fallback
  return new ApplicationError("An unexpected error occurred");
}

/**
 * Handles form validation errors
 * @param field - The field name
 * @param message - The error message
 * @returns A validation error object
 */
export function createValidationError(
  field: string,
  message: string
): FormValidationError {
  return new FormValidationError(message, field);
}

/**
 * Handles authentication errors
 * @param message - The error message
 * @returns An authentication error object
 */
export function createAuthenticationError(
  message: string
): AuthenticationError {
  return new AuthenticationError(message);
}

/**
 * Handles authorization errors
 * @param message - The error message
 * @returns An authorization error object
 */
export function createAuthorizationError(message: string): AuthorizationError {
  return new AuthorizationError(message);
}

/**
 * Checks if an error is a validation error
 * @param error - The error to check
 * @returns true if it's a validation error, false otherwise
 */
export function isValidationError(error: any): error is FormValidationError {
  return error instanceof FormValidationError;
}

/**
 * Checks if an error is an authentication error
 * @param error - The error to check
 * @returns true if it's an authentication error, false otherwise
 */
export function isAuthenticationError(
  error: any
): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

/**
 * Checks if an error is an authorization error
 * @param error - The error to check
 * @returns true if it's an authorization error, false otherwise
 */
export function isAuthorizationError(error: any): error is AuthorizationError {
  return error instanceof AuthorizationError;
}

/**
 * Checks if an error is a network error
 * @param error - The error to check
 * @returns true if it's a network error, false otherwise
 */
export function isNetworkError(error: any): error is NetworkError {
  return error instanceof NetworkError;
}
