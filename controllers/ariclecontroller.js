const axios = require('axios')
const express = require('express');
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router();

const Article = require('../models/article')



exports.get_online_models = async function(req, res) {
    let url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=CGTdY'
    let data = {};

     axios.get(url)
        .then(response => {
            data = response.data;
        })
        .catch(e => {
            console.log('Error while fetching online models error ' + e)
        })
        var entry = new Article(data);

        entry.save(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          }
        })
    }

//module.exports = router;