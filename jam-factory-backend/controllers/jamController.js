const Jam = require("../models/jamModel");

exports.getAllJams = async (req, res) => {
  try {
    const jams = await Jam.find();
    res.status(200).json({
      status: "Success",
      results: jams.length,
      data: { jams },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

exports.getJam = async (req, res) => {
  try {
    const jam = await Jam.findById(req.params.id);
    res.status(200).json({
      status: "Success",
      data: { jam },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
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
    res.status(400).json({
      status: "Failed",
      message: err.message,
    });
  }
};

exports.updateJam = async (req, res) => {
  try {
    const jam = await Jam.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!jam) {
      return res.status(404).json({
        status: "Failed",
        message: "Jam not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { jam },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

exports.deleteJam = async (req, res) => {
  try {
    const jam = await Jam.findByIdAndDelete(req.params.id);

    if (!jam) {
      return res.status(404).json({
        status: "Failed",
        message: "Jam not found",
      });
    }

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: "Internal Server Error",
    });
  }
};

exports.getJamEfficiency = async (req, res) => {
  try {
    const efficiencyData = await Jam.aggregate([
      {
        $group: {
          _id: null,
          totalBatchSize: { $sum: "$batchSize" },
          totalSugarAmount: { $sum: "$sugarAmount" },
        },
      },
      {
        $project: {
          efficiency: {
            $cond: {
              if: { $eq: ["$totalSugarAmount", 0] },
              then: 0,
              else: { $divide: ["$totalBatchSize", "$totalSugarAmount"] },
            },
          },
        },
      },
    ]);

    if (!efficiencyData.length) {
      return res.status(404).json({
        status: "Failed",
        message: "No jam data available",
      });
    }

    res.status(200).json({
      status: "Success",
      efficiency:
        efficiencyData[0].efficiency > 5 ? "efficient" : "inefficient",
      efficiencyValue: efficiencyData[0].efficiency,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
};
