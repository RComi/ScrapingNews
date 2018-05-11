//dependencies
var exphbs = require("express-handlebars");
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//port set up
var PORT = 3000;

// Initialize Express
var app = express();
var router = express.Router();

// Set Handlebars as the default templating engine.
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

var routes = require("./controllers/controller.js");
app.use("/", routes);

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scrapingnews");

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});
