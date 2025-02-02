const mongoose = require("mongoose");
const Jam = require("../models/jamModel");

exports.getAllJams = async (req, res) => {
  try {
    const jam = await Jam.find();
    res.status(200).json({
      status: "Success",
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

exports.getJam = async (req, res) => {
  try {
    const jam = await Jam.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: {
        jam,
      },
    });
  } catch (err) {
    res.status(404).json({
      stsus: "Failed",
      message: err,
    });
  }
};

exports.createJam = async (req, res) => {
  try {
    const newJam = await Jam.create(req.body);
    res.status(201).json({
      status: "Success",
      data: newJam,
    });
  } catch (err) {
    res.stsus(400).json({
      response: "Failed",
      message: err,
    });
  }
};
