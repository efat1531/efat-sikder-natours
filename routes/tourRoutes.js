/* eslint-disable prettier/prettier */
const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");

const router = express.Router();

// router.param("id", tourController.checkTourPresence);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getAllToursStats);

router.route("/tour-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("lead-guide", "admin"),
    tourController.postNewTour
  );
router
  .route("/:id")
  .get(authController.protect, tourController.getSingleTourByID)
  .patch(
    authController.protect,
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.patchTourByID
  )
  .delete(
    authController.protect,
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTourByID
  );

module.exports = router;
