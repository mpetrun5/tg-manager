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
  fs.readdir(uploadFolder, function(err, files){
    if(err){
      req.flash('danger', 'Unable to scan directory');
    }
    res.render('repository', {
      title:"Repository",
      files:files
    });
  });
});

//Upload Post
router.post('/upload',function(req,res){
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
    var uploadpath = uploadFolder + name;
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
router.get('/download/:id', function(req, res){
  res.download(uploadFolder+ req.params.id);
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
