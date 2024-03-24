const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .get(userController.getAllUser)
  .post(userController.postNewUser);
router
  .route("/:id")
  .get(userController.getSingleUserByID)
  .patch(userController.patchTUserByID)
  .delete(userController.deleteUserByID);

module.exports = router;
