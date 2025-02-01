const express = require("express");
const jamController = require("../controllers/jamController");

const router = express.Router();

router.route("/").get(jamController.getAllJams);

module.exports = router;
