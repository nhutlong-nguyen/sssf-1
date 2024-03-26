export default class CustomError extends Error {
  status = 400;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

//added: custom error class allows for better error handling
//by attaching status code to error
//which then can be used to send HTTP responses with the correct status code
//when an error occurs
