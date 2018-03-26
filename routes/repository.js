const express = require('express');
const router = express.Router();
const upload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

let User = require('../models/user');

//target folder
var uploadFolder = __dirname.replace("routes", "public/uploads/");

router.use(upload());

//Repository Router
router.get('/', ensureAuthenticated, function(req, res){
  res.render('repository',{
    title:"Repository"
  });
});

//Repository Router
router.get('/:id', ensureAuthenticated, function(req, res){
  fs.readdir(uploadFolder + "/" + req.params.id, function(err, files){
    if(err){
      req.flash('danger', 'Unable to scan directory');
    }
    res.render('repository_folder', {
      title:"Repository",
      folder: req.params.id,
      files:files
    });
  });
});


//Upload Post
router.post('/upload/:id',function(req,res){
  if(req.files){
    var file = req.files.file,
      name = file.name,
      type = file.mimetype;
    var uploadpath = uploadFolder + req.params.id + "/" + name;
    console.log(uploadpath);
  file.mv(uploadpath,function(err){
      if(err){
        req.flash("danger", "File upload error!");
        res.redirect('/repository');
      }
      else {
        req.flash("success", "File uploaded!");
        res.redirect("/repository");
      }
    });
  }
  else {
    req.flash("danger", "No file selected");
    res.redirect("/repository");
  };
})

//Download
router.get('/download/other/:id', function(req, res){
  res.download(uploadFolder+"other/" + req.params.id);
});
//Download
router.get('/download/songs/:id', function(req, res){
  res.download(uploadFolder+"songs/" + req.params.id);
});
//Download
router.get('/download/images/:id', function(req, res){
  res.download(uploadFolder+"images/" + req.params.id);
});
//Download
router.get('/download/lyrics/:id', function(req, res){
  res.download(uploadFolder+"lyrics/" + req.params.id);
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
