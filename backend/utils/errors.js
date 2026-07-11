class AppError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.details = details;
  }
}

function notFound(message, details) {
  return new AppError(404, message, details);
}

function badRequest(message, details) {
  return new AppError(400, message, details);
}

module.exports = {
  AppError,
  notFound,
  badRequest
};
