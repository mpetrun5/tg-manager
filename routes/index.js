const express = require('express');
const router = express.Router();

//Notice model
let Notice = require('../models/notice');
// User Model
let User = require('../models/user');

// Home Route
router.get('/', ensureAuthenticated, function(req, res){
  Notice.find({}, function(err, notices){
    if(err){
      console.log(err);
    } else {
      res.render('index', {
        title:'Home',
        notices: notices
      });
    }
  });
});

// Add Route
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
  notice.timeStamp = "edited: " + new Date().toString();
  notice.author = req.user.name;

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
    notice.timeStamp = new Date()
    console.log(notice);
    notice.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Cover Added');
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
