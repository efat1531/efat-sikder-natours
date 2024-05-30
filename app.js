/* eslint-disable no-unused-vars */
const express = require("express");
const morgan = require("morgan");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const expressMongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const path = require("path");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const { env } = require("process");

const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const reviewRouter = require("./routes/reviewRoutes");
const viewRouter = require("./routes/viewRoutes");
const bookingRouter = require("./routes/bookingRoutes");

const scriptSrcUrls = [
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://unpkg.com/axios/dist/axios.min.js",
];
const styleSrcUrls = [
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://unpkg.com/axios/dist/axios.min.js",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
  "https://unpkg.com/axios/dist/axios.min.js",
];

const fontSrcUrls = ["fonts.googleapis.com", "fonts.gstatic.com"];

const generalRateLimiter = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  legacyheaders: false,
  skipSuccessfulRequests: true,
});

const authRateLimiter = ratelimit({
  max: 10,
  windowMs: 15 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
  legacyheaders: false,
  skipSuccessfulRequests: true,
});

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "pug");
app.set("views", `${__dirname}/views`);

app.use(express.json({ limit: "10kb" }));
app.use(express.static(`${__dirname}/public`));
app.use(expressMongoSanitize());
app.use(xss());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use("/", viewRouter);
app.use("/api/v1/tours", generalRateLimiter, tourRouter);
app.use("/api/v1/users", authRateLimiter, userRouter);
app.use("/api/v1/reviews", generalRateLimiter, reviewRouter);
app.use("/api/v1/bookings", generalRateLimiter, bookingRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
