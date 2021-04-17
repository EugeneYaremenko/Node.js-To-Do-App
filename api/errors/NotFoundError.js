class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.status = 404;
    this.stack = "";
  }
}

module.exports = NotFoundError;
