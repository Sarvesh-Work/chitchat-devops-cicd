export const errorMiddleware = (err, req, res, next) => {
  err.message ||= "invalid message";
  err.statusCode ||= 500;

  if (err.code === 11000) {
    const error = Object.keys(err.keyPattern).join(",");
    err.message = `Duplicate key found -${error} `;
    err.statusCode = 400;
  }

  if (err.name === "CastError") {
    const errPath = err.path;
    err.message = `Invalid format of ${errPath}`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
