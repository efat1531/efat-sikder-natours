const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/forgetPassword").post(authController.forgetPassword);
router.route("/resetPassword/:token").patch(authController.resetPassword);

router.use(authController.protect);
router
  .route("/allUsers")
  .get(authController.restrictTo("admin"), userController.getAllUsers);
router.route("/updateMyPassword").patch(authController.updatePassword);

router
  .route("/myData")
  .get(userController.currentUser)
  .patch(userController.updateMe);

router.route("/deleteMe").delete(userController.deleteMe);

module.exports = router;
