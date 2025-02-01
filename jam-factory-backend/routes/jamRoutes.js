const express = require("express");
const jamController = require("../controllers/jamController");

const router = express.Router();

router.route("/").get(jamController.getAllJams);

router.route("/:id").get(jamController.getJam);

module.exports = router;
