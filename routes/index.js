const express = require('express');
const router = express.Router();
const moment = require('moment');

//Notice model
let Notice = require('../models/notice');
// User Model
let User = require('../models/user');
//Event model
let Event = require('../models/event');

// Home Route
router.get('/', ensureAuthenticated, function(req, res){
  Notice.find({}, function(err, notices){
    Event.find({}, function(err, events){
    if(err){
      console.log(err);
    } else {
      for(var i=0; i<notices.length; i++){
        notices[i].timeStamp = moment(notices[i].timeStamp).fromNow().toString();
      }
      for(var i=0; i<events.length; i++){
        events[i].timeStamp = moment(events[i].timeStamp).fromNow().toString();
      }
      res.render('index', {
        title:'Home',
        notices: notices,
        events: events,
        user:req.user,
      });
    }
    }).sort({_id:-1}).limit(5);
  }).sort({_id:-1}).limit(5);
});

// Add Route Notices
router.get('/notice/add', ensureAuthenticated, function(req, res){
  res.render('add_notice', {
    title:'Add Notice'
  });
});


// Load Notice Edit Form
router.get('/notice/edit/:id', ensureAuthenticated, function(req, res){
  Notice.findById(req.params.id, function(err, notice){
    res.render('edit_notice', {
      title:'Edit Notice',
      notice:notice
    });
  });
});

// Update Submit POST Route
router.post('/notice/edit/:id', function(req, res){
  let notice = {};
  notice.title = req.body.title;
  notice.body = req.body.body;
  notice.timeStamp = moment().toString();
  notice.author = req.user.name + " edit ";

  let query = {_id:req.params.id}

  Notice.update(query, notice, function(err){
    if(err){
      return;
    } else {
      req.flash('success', 'Notice Updated');
      res.redirect('/');
    }
  });
});


// Delete Article
router.delete('/notice/:id', function(req, res){
  let query = {_id:req.params.id}

  Notice.findById(req.params.id, function(err, notice){
      Notice.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });

  });
});

// Add Submit POST Route
router.post('/notice/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_notice', {
      title:'Add Notice',
      errors:errors
    });
  } else {
    let notice = new Notice();
    notice.title = req.body.title;
    notice.body = req.body.body;
    notice.author = req.user.name;
    notice.timeStamp = moment().toString();
    notice.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Notice Added');
        res.redirect('/');
      }
    });
  }
});

//Events
router.get('/event/add', ensureAuthenticated, function(req, res){
  res.render('add_event', {
    title:'Add Event'
  });
});

// Delete Event
router.delete('/event/:id', function(req, res){
  let query = {_id:req.params.id}

  Event.findById(req.params.id, function(err, event){
      Event.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });

  });
});

// Add Submit POST Route
router.post('/event/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_event', {
      title:'Add Event',
      errors:errors
    });
  } else {
    let event = new Event();
    event.title = req.body.title;
    event.body = req.body.body;
    event.timeStamp = moment().toString();
    event.date = moment(req.body.date).format('ddd D MMM YYYY').toString();
    event.author = req.user.name;
    event.time = req.body.time;
    event.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Event Added');
        res.redirect('/');
      }
    });
  }
});



//Access control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Please login');
    res.redirect('/users/login');
  }
}

module.exports = router;
