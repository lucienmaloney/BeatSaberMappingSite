const express = require("express");

const app = express();

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.status(200).render("home");
});

app.get("/examples", function (req, res) {
  res.status(200).render("example");
});

app.get("/setup", function (req, res) {
  res.status(200).render("setup");
});

app.get("/about", function (req, res) {
  res.status(200).render("about");
});

app.use("*", function (req, res) {
  res.status(404).render("404");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render("500");
});

app.listen(7001, () => console.log("Running on port 7001"));
