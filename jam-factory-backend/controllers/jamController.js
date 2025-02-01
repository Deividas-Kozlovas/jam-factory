const mongoose = require("mongoose");
const Jam = require("../models/jamModel");

exports.getAllJams = async (req, res) => {
  try {
    const jam = await Jam.find();
    res.status(200).json({
      results: jam.length,
      data: {
        jam,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed",
      message: err,
    });
  }
};
