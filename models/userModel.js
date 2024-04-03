/* eslint-disable prettier/prettier */
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A user must have a name!"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "A user must have an email!"],
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Please provide a valid email!"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "A user must have a password!"],
      minlength: 8,
      select: false,
      validate: [
        {
          validator: function (val) {
            return !this.previousPasswords.includes(val);
          },
          message: "Password must be different from previous passwords!",
        },
        {
          validator: function (val) {
            return val.match(/\d+/g) && val.match(/[a-zA-Z]/g);
          },
          message: "Password must contain at least one number and one letter!",
        },
      ],
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password!"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Passwords do not match!",
      },
    },
    role: {
      type: String,
      enum: ["user", "guide", "lead-guide", "admin"],
      default: "user",
    },
    passwordChangedAt: {
      type: Date,
      default: Date.now(),
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    previousPasswords: [String],
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.role;
        delete ret.__v;
        delete ret.previousPasswords;
        delete ret.active;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hashSync(this.password, 16);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
