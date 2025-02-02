const express = require("express");
const jamController = require("../controllers/jamController");
const jamMiddleware = require("../middlewares/jamMiddleware");

const router = express.Router();

router.param("id", jamMiddleware.checkJamID);

router
  .route("/")
  .get(jamController.getAllJams)
  .post(jamMiddleware.validateJam, jamController.createJam);

router.route("/:id").get(jamController.getJam);

module.exports = router;
