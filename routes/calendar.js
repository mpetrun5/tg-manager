const express = require('express');
const router = express.Router();


//Calendar Router
router.get('/', ensureAuthenticated, function(req, res){
  res.render('calendar', {
    title:'Calendar'
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
