const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const Schema = mongoose.Schema;
//var uniqueValidator = require('mongoose-unique-validator');
//var ObjectId=require('mongoose').Types.ObjectId;
const scrapSchema = new Schema({
data : {type: JSON}
})


module.exports = mongoose.model('scrap', scrapSchema, 'scraps');