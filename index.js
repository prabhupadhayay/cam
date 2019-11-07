const express = require("express");
const bodyparser = require("body-parser");
var urlencodedParser = bodyparser.urlencoded({
  extended: false
});
port=process.env.PORT || 8080
var app = express();
app.use(bodyparser.json());
const { mongoose } = require("./db.js");

var camController = require("./controllers/camcontroller");
//var articleController = require("./controllers/ariclecontroller")

var mainRouter = require('./routes/main');

app.timeout = 0;
app.listen(port, () => console.log("Server Started at", +port));

app.use("/", camController);
//app.use("/", articleController);
app.use("/", mainRouter);