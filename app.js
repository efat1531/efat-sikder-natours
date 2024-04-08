/* eslint-disable no-unused-vars */
const express = require("express");
const morgan = require("morgan");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const generalRateLimiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  legacyheaders: true,
  skipSuccessfulRequests: true,
});

const authRateLimiter = ratelimit({
  max: 10,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  legacyheaders: true,
  skipSuccessfulRequests: true,
});

const app = express();
app.use(helmet());

app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/public`));
app.use(expressMongoSanitize());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/tours", generalRateLimiter, tourRouter);
app.use("/api/v1/users", authRateLimiter, userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
