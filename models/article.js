const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
//var uniqueValidator = require('mongoose-unique-validator');
var ObjectId=require('mongoose').Types.ObjectId;
const articleSchema = new Schema({
    is_new: {
        type: Boolean
    },
    num_followers: {
        type: Number
    },
    iframe_embed: {
        type: String
    },
    display_name: {
        type: String
    },
    tags: {
        type: Array
    },
    recorder: {
        type: Boolean
    },
    iframe_embed_revshare: {
        type: String
    },
    chat_room_url: {
        type: String
    },
    location: {
        type: String
    },
    // block_from_states: {
    //     type: String
    // },
    // chat_room_url_revshare: {
    //     type: String
    // },
    username: {
        type: String
    },
    spoken_languages: {
        type: String
    },
    image_url_360: {
        type: String
    },
    current_show: {
        type: String
    },
    birthday: {
        type: String
    },
    // chat_room_url: {
    //     type: Boolean
    // },
    // block_from_countries: {
    //     type: String
    // },
    seconds_online: {
        type: Number
    },
    gender: {
        type: String
    },
    age: {
        type: Number
    },
    num_users: {
        type: Number
    },
    image_url: {
        type: String
    },
    room_subject: {
        type: String
    },
})

module.exports = mongoose.model('article', articleSchema, 'articles');