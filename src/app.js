const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));

const mainRoutes = require("./routes/mainRoutes");
app.use("/api", mainRoutes);

module.exports = app;
