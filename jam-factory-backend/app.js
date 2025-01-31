const express = require("express");
const morgan = require("morgan");
const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const jamRouter = require("./routes/jamRoutes");

app.use(express.json());

app.use("/api/v1/jam", jamRouter);

module.exports = app;
