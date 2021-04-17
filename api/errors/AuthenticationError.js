class AuthenticationError extends Error {
  constructor() {
    super();
    this.message = "The username or password is incorrect";
    this.status = 400;
    this.stack = "";
  }
}

module.exports = AuthenticationError;
