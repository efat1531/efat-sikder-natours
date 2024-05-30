const AppError = require("../utils/appError");

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorClient = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    return res.status(500).json({
      status: "Failed",
      message: "An unknown error occured. Please wait and refresh!",
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  res.status(500).render("error", {
    title: "Something went wrong!",
    msg: "Please try again later!",
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = Object.values(err.keyValue);
  const key = Object.keys(err.keyValue);
  const message = `Duplicate ${key} value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError("Invalid token. Please login again!", 401);

module.exports = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, req, res);
  } else {
    let err = { ...error };
    err.message = error.message;
    if (error.name === "CastError") err = handleCastErrorDB(err);
    if (error.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }
    if (error.name === "ValidationError") {
      err = handleValidationErrorDB(err);
    }
    if (error.name === "JsonWebTokenError") {
      err = handleJsonWebTokenError();
    }
    if (error.name === "TokenExpiredError") {
      err = new AppError("Your token has expired. Please login again!", 401);
    }
    sendErrorClient(err, req, res);
  }
};
