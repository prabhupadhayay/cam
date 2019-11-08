var express = require('express');
var router = express.Router();


var articleController = require("../controllers/articlecontroller")
//var camController = require("./controllers/camcontroller");
var postController = require("../controllers/postcontroller")

router.get('/get_online_models' ,articleController.get_online_models);
//router.get('/get_online_models' ,articleController.get_online_models);
router.get('/createList' ,postController.createList);

module.exports = router;