var express = require('express');
var router = express.Router();


var articleController = require("../controllers/articlecontroller")
//var camController = require("./controllers/camcontroller");
var postController = require("../controllers/postcontroller")
var regionController = require("../controllers/regioncontroller")
var tokenController = require("../controllers/tokencontroller")


router.get('/get_online_models' ,articleController.get_online_models);
//router.get('/get_online_models' ,articleController.get_online_models);
router.get('/createList' ,postController.createList);
router.get('/fetchregion' ,regionController.fetchregion);
router.get('/fetchtoken' ,tokenController.fetchtoken);

module.exports = router;