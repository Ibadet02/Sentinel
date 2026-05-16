export class AuthError extends Error {
  constructor(message = "Invalid credentials") {
    super(message);
  }
}
