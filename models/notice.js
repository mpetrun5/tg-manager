let mongoose = require('mongoose');

// Article Schema
let noticeSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  body:{
    type:String,
    required:true
  },
  timeStamp:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  }
});

let Notice = module.exports = mongoose.model('Notice', noticeSchema);
