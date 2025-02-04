const express = require("express");
const jamController = require("../controllers/jamController");
const jamMiddleware = require("../middlewares/jamMiddleware");
const authConteller = require("../middlewares/authMiddleware");

const router = express.Router();

router.param("id", jamMiddleware.checkJamID);

router
  .route("/")
  .get(authConteller.authUser, jamController.getAllJams)
  .post(jamMiddleware.validateJam, jamController.createJam);

router.route("/efficiency").get(jamController.getJamEfficiency);

router
  .route("/:id")
  .get(jamController.getJam)
  .patch(jamController.updateJam)
  .delete(jamController.deleteJam);

module.exports = router;
