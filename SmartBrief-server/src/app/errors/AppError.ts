class AppError extends Error {
  public statusCode: number;
  public errorMessage;

  constructor(
    statusCode: number,
    errorMessage: string,
    message: string,
    stack = '',
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorMessage = errorMessage;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
