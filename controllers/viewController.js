/* eslint-disable prettier/prettier */
const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");
// const User = require("../models/userModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();
  res.status(200).render("overview", {
    title: "All Tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user",
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template

  // 3) Render template using data from 1)
  res.status(200).render("tourDetails", {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render("login", {
    title: "Log into your account",
  });
});

exports.getLogout = (req, res) => {
  res.status(200).render("overview", {
    title: "Log out from your account",
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account",
  });
};

// exports.updateMe = catchAsync(async (req, res, next) => {
//   const { name, email } = req.body;
//   const user = await User.findByIdAndUpdate(
//     req.user.id,
//     { name, email },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );
//   res.status(200).render("account", {
//     title: "Your account",
//     user: user,
//   });
// });

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map((el) => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours,
  });
});

exports.getSignupForm = catchAsync(async (req, res, next) => {
  res.status(200).render("signup", {
    title: "Create an account",
  });
});

exports.getForgotPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("forgotPassword", {
    title: "Forgot your password?",
  });
});

exports.getResetPasswordForm = catchAsync(async (req, res, next) => {
  res.status(200).render("resetPassword", {
    title: "Reset your password",
  });
});
