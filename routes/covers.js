const express = require('express');
const router = express.Router();


// Article Model
let Article = require('../models/article');
// User Model
let User = require('../models/user');

// Add Route
router.get('/add', ensureAuthenticated, function(req, res){
  res.render('add_cover', {
    title:'Add Cover'
  });
});

//Covers Router
router.get('/', ensureAuthenticated, function(req, res){
  Article.find({}, function(err, articles){
    if(err){
      console.log(err);
    } else {
      res.render('covers', {
        title:'Covers',
        articles: articles
      });
    }
  });
});



// Add Submit POST Route
router.post('/add', function(req, res){
  req.checkBody('title','Title is required').notEmpty();
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('body','Body is required').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('add_cover', {
      title:'Add Cover',
      errors:errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.body = req.body.body;

    article.save(function(err){
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

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_cover', {
      title:'Edit Cover',
      article:article
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'Cover Updated');
      res.redirect('/covers');
    }
  });
});

// Delete Article
router.delete('/:id', function(req, res){

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });

  });
});

// Get Single Article
router.get('/:id', ensureAuthenticated, function(req, res){
  Article.findById(req.params.id, function(err, article){

      res.render('cover', {
        article:article,
        title:"Cover"
    });
  });
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
