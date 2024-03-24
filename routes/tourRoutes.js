const express = require("express");
const tourController = require("../controllers/tourController");

const router = express.Router();

// router.param("id", tourController.checkTourPresence);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route("/tour-stats").get(tourController.getAllToursStats);

router.route("/tour-plan/:year").get(tourController.getMonthlyPlan);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(tourController.postNewTour);
router
  .route("/:id")
  .get(tourController.getSingleTourByID)
  .patch(tourController.patchTourByID)
  .delete(tourController.deleteTourByID);

module.exports = router;
