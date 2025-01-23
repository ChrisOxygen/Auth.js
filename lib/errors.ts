export class CustomFormError extends Error {
  field?: string;
  statusCode?: number;

  constructor(message: string, field?: string, statusCode?: number) {
    super(message);
    this.field = field;
    this.statusCode = statusCode;
    this.name = "CustomFormError";

    // Maintaining proper stack trace (only works in V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomFormError);
    }
  }
}

// Example usage:
// try {
//   throw new CustomFormError("Invalid input", "email", 400);
// } catch (error) {
//   if (error instanceof CustomFormError) {
//     console.error(
//       `Error: ${error.message}, Field: ${error.field}, Status Code: ${error.statusCode}`
//     );
//   }
// }
