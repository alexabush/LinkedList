class ApiError extends Error {
  constructor(
    status = 500,
    title = 'Internal Server Error',
    message = 'An Unknown Server Error Occurred'
  ) {
    super(message);
    this.status = status;
    this.title = title;
    this.message = message;
  }
  toJSON() {
    const { status, title, message } = this;
    return {
      error: {
        status,
        title,
        message
      }
    };
  }
}

module.exports = ApiError;
