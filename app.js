const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
require("dotenv").config();

const port = 3001;
const app = express();

// app.use(express.static("../blog/build"));

app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  app.listen(port, () => {
    console.log("Server has been start on port " + port);
  });
});
