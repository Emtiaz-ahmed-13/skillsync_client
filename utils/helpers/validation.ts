// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation regex (at least 6 characters)
const PASSWORD_REGEX = /^.{6,}$/;

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/**
 * Validates a password
 * @param password - The password to validate
 * @returns true if valid, false otherwise
 */
export function validatePassword(password: string): boolean {
  return PASSWORD_REGEX.test(password);
}

/**
 * Validates that two passwords match
 * @param password - The password
 * @param confirmPassword - The confirmation password
 * @returns true if they match, false otherwise
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string
): boolean {
  return password === confirmPassword;
}

/**
 * Validates a name (at least 2 characters)
 * @param name - The name to validate
 * @returns true if valid, false otherwise
 */
export function validateName(name: string): boolean {
  return name.length >= 2;
}

/**
 * Validates form data and returns any validation errors
 * @param data - The form data to validate
 * @returns An array of validation errors
 */
export function validateFormData(
  data: any
): { field: string; message: string }[] {
  const errors: { field: string; message: string }[] = [];

  if (data.name && !validateName(data.name)) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long",
    });
  }

  if (data.email && !validateEmail(data.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  if (data.password && !validatePassword(data.password)) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters long",
    });
  }

  if (
    data.password &&
    data.confirmPassword &&
    !validatePasswordMatch(data.password, data.confirmPassword)
  ) {
    errors.push({
      field: "confirmPassword",
      message: "Passwords do not match",
    });
  }

  return errors;
}
