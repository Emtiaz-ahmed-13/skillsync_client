// Custom error types for the application

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

export class ApplicationError extends Error {
  constructor(message: string, public code?: string, public status?: number) {
    super(message);
    this.name = "ApplicationError";
  }
}

export class NetworkError extends ApplicationError {
  constructor(message: string) {
    super(message, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

export class FormValidationError extends ApplicationError {
  constructor(message: string, public field?: string) {
    super(message, "VALIDATION_ERROR");
    this.name = "FormValidationError";
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string) {
    super(message, "AUTHENTICATION_ERROR", 401);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string) {
    super(message, "AUTHORIZATION_ERROR", 403);
    this.name = "AuthorizationError";
  }
}
