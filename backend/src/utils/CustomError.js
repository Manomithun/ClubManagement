class CustomError extends Error {
  constructor(message, statusCode, extra) {
    super(message);
    this.statusCode = statusCode;
    this.extra = extra;
  }
}
export default CustomError;