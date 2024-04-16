/* eslint-disable prettier/prettier */
const express = require("express");
const tourController = require("../controllers/tourController");
const authController = require("../controllers/authController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router.param("id", tourController.checkTourPresence);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo("lead-guide", "admin"),
    tourController.postNewTour
  );

router.route("/:id").get(tourController.getSingleTourByID);

router.use(authController.protect);

router
  .route("/tour-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/:id")
  .patch(
    authController.restrictTo("admin", "lead-guide", "guide"),
    tourController.patchTourByID
  )
  .delete(
    authController.restrictTo("admin", "lead-guide"),
    tourController.deleteTourByID
  );

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route("/tour-stats")
  .get(authController.restrictTo("admin"), tourController.getAllToursStats);

router
  .route("/tour-plan/:year")
  .get(
    authController.restrictTo("lead-guide", "admin"),
    tourController.getMonthlyPlan
  );

router.use("/:tourId/reviews", reviewRouter);

module.exports = router;
