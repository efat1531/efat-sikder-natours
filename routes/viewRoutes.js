/* eslint-disable prettier/prettier */
const express = require("express");

const viewController = require("../controllers/viewController");
const authController = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get("/me", authController.protect, viewController.getAccount);
router.get("/my-tours", authController.protect, viewController.getMyTours);
// router.post("/updateMe", authController.protect, viewController.updateMe);

router.use(authController.isLoggedIn);
router.get(
  "/",
  bookingController.createBookingCheckout,
  viewController.getOverview
);
router.get("/overview", viewController.getOverview);
router.get("/tour/:slug", viewController.getTour);
router.get("/login", viewController.getLoginForm);
router.get("/signup", viewController.getSignupForm);
router.get("/forgot-password", viewController.getForgotPasswordForm);
router.get("/reset-password/:token", viewController.getResetPasswordForm);

// router.get("/logout", viewController.getLogout);

module.exports = router;
