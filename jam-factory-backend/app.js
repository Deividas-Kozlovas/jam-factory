const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const jamRouter = require("./routes/jamRoutes");

app.use(express.json());

app.use("/api/v1/jams", jamRouter);

module.exports = app;
