const mongoose = require("mongoose");
const Jam = require("../models/jamModel");

exports.validateJam = (req, res, next) => {
  const {
    name,
    fruitType,
    batchSize,
    sugarAmount,
    productionDate,
    expirationDate,
  } = req.body;

  if (
    !name ||
    !fruitType ||
    !batchSize ||
    !sugarAmount ||
    !productionDate ||
    !expirationDate
  ) {
    return res.status(400).json({
      status: "Failed",
      message: "Please fill all required fields",
    });
  }

  next();
};

exports.checkJamID = async (req, res, next, val) => {
  if (!mongoose.Types.ObjectId.isValid(val)) {
    return res.status(400).json({
      status: "Failed",
      message: "Jam ID format invalid",
    });
  }

  const jam = await Jam.findById(val);
  if (!jam) {
    return res.status(404).json({
      status: "Failed",
      message: "Jam not found",
    });
  }
  next();
};
