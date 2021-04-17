class UnauthorizedError extends Error {
  constructor(messege) {
    super(messege);
    this.status = 401;
    this.stack = "";
  }
}

module.exports = UnauthorizedError;
