const axios = require('axios')
const express = require('express');
const cheerio = require('cheerio')
const fs = require('fs')
const router = express.Router();

const Article = require('../models/article')
const Scrap = require('../models/scrap')



exports.get_online_models = async function(req, res) {
    let url = 'https://chaturbate.com/affiliates/api/onlinerooms/?format=json&wm=CGTdY'
    let data = {};

    await axios.get(url)
        .then(response => {
            data = response.data;
        })
        .catch(e => {
            console.log('Error while fetching online models error ' + e)
        })
        data.forEach(function(table) {
          console.log("Username: "+table.username);
        //console.log(data);
        //data.forEach(myfunction)
//function myfunction(){
       var article = new Article({
        is_new: table.is_new,
        num_followers:table.num_followers,
        iframe_embed:table.iframe_embed,
        display_name:table.display_name,
        tags:table.tags,
        recorder:table.recorder,
        chat_room_url:table.chat_room_url,
        location:table.location,
        username:table.username,
        spoken_languages:table.spoken_languages,
        image_url_360:table.image_url_360,
        current_show:table.current_show,
        birthday:table.birthday,
        chat_room_url:table.chat_room_url,
        seconds_online:table.seconds_online,
        gender:table.gender,
        age:table.age,
        num_users:table.num_users,
        image_url:table.image_url,
        room_subject:table.room_subject

    });
  
         

        article.save(function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log("data saved");
          }
        })
        })
    }

    