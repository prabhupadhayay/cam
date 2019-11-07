var express = require('express');
var router = express.Router();


var articleController = require("../controllers/ariclecontroller")
//var camController = require("./controllers/camcontroller");

router.get('/get_online_models' ,articleController.get_online_models);
//router.get('/get_online_models' ,articleController.get_online_models);


module.exports = router;