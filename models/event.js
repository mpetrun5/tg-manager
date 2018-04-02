let mongoose = require('mongoose');

// Article Schema
let eventSchema = mongoose.Schema({
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
  date:{
    type:String,
    required:true
  },
  time:{
    type:String,
    required:true
  },
  author:{
    type:String,
    required:true
  }
});

let Event = module.exports = mongoose.model('Event', eventSchema);
