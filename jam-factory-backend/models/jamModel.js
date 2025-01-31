const mongoose = require("mongoose");

const jamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Jam must have a name"],
    },
    fruitType: {
      type: String,
      required: [true, "Must specify the fruit ingredient"],
    },
    batchSize: {
      type: Number,
      required: [true, "Must specify batch size in kg"],
    },
    sugarAmount: {
      type: Number,
      required: [true, "Must specify sugar amount in kg"],
    },
    productionDate: {
      type: Date,
      required: [true, "Production date must be set"],
    },
    expirationDate: {
      type: Date,
      required: [true, "Expiration date must be set"],
    },
  },
  { timestamps: true }
);

const Jam = mongoose.model("Jam", jamSchema);

module.exports = Jam;
