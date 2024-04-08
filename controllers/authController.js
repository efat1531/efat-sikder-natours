/* eslint-disable prettier/prettier */
const jwt = require("jsonwebtoken");
const util = require("util");
// eslint-disable-next-line import/no-extraneous-dependencies
const moment = require("moment");
const crypto = require("crypto");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

// ()=> Sing Up Function
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: process.env.NODE_ENV === "production",
  });
  res.status(201).json({
    status: "sucess",
    token,
    data: {
      user: newUser,
    },
  });
});

// ()=> Login Function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 401));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password!", 401));
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: process.env.NODE_ENV === "production",
  });
  res.status(200).json({
    status: "success",
    token,
  });
});

// ()=> Protect Function
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError(
        "You are not logged in. Please login to access this area!",
        401
      )
    );
  }

  const decodedData = await util.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decodedData.id);

  if (!user) {
    return next(new AppError("The user no longer exist", 401));
  }
  if (user.changedPasswordAfter(decodedData.iat)) {
    return next(
      new AppError("User recently changed password. Please login again!", 401)
    );
  }

  req.user = user;
  next();
});

// ()=> Restrict Middleware
exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action!", 403)
      );
    }
    next();
  };

// ()=> Forget Password Function
exports.forgetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError("Please provide an email!", 400));
  }
  const user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    return next(new AppError("User with this email does not exist!", 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 15 minutes)",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      resetToken,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

// ()=> Reset Password Function
exports.resetPassword = catchAsync(async (req, res, next) => {
  if (!req.body.password || !req.body.passwordConfirm) {
    return next(
      new AppError("Please provide password and passwordConfirm!", 400)
    );
  }

  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError("Passwords do not match!", 400));
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+password");
  if (!user) {
    return next(new AppError("Token is invalid or has expired!", 400));
  }
  const previousPassword = await user.usedPreviousPassword(
    req.body.password,
    user.password
  );
  if (previousPassword) {
    return next(
      new AppError("The reset password and current password are same!", 400)
    );
  }
  const usedPass = await user.previousUsedPassword(req.body.password);
  if (usedPass) {
    let message;
    const passDate = moment(usedPass);
    const now = moment();
    const difference = now.diff(passDate);

    if (moment.duration(difference).asDays() > 1) {
      const daysAgo = Math.floor(moment.duration(difference).asDays());
      message = `This password was changed ${daysAgo} days ago`;
    } else if (moment.duration(difference).asHours() > 1) {
      const hoursAgo = Math.floor(moment.duration(difference).asHours());
      message = `This password was changed ${hoursAgo} hours ago`;
    } else if (moment.duration(difference).asMinutes() > 1) {
      const minutesAgo = Math.floor(moment.duration(difference).asMinutes());
      message = `This password was changed ${minutesAgo} minutes ago`;
    } else {
      const secondsAgo = Math.floor(moment.duration(difference).asSeconds());
      message = `This password was changed ${secondsAgo} seconds ago`;
    }
    return next(new AppError(`${message}`, 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
  });
});

// ()=> Update Password Function
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(new AppError("User does not exist!", 404));
  }
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong!", 401));
  }
  if (req.body.password === req.body.passwordCurrent) {
    return next(
      new AppError("New password cannot be same as current password!", 400)
    );
  }
  const previousPassword = await user.previousUsedPassword(req.body.password);
  if (previousPassword) {
    return next(
      new AppError(
        "You cannot use this password as new password because you have used it previously!",
        400
      )
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordChangedAt = Date.now();
  await user.save();
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }
  const filteredBody = {
    name: req.body.name,
    photo: req.body.photo,
    email: req.body.email,
  };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});
