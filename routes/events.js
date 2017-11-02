var express = require('express'),
    Event = require('../models/event')
var router = express.Router();

function needAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      req.flash('danger', 'Please signin first.');
      res.redirect('/signin');
    }
}

// function validateForm(form, options) {
//   var title = form.title || "";
//   var ema = form.email || "";
//   name = name.trim();
//   email = email.trim();
//
//   if (!name) {
//     return 'Name is required.';
//   }
//
//   if (!email) {
//     return 'Email is required.';
//   }
//
//   if (!form.password && options.needPassword) {
//     return 'Password is required.';
//   }
//
//   if (form.password !== form.password_confirmation) {
//     return 'Passsword do not match.';
//   }
//
//   if (form.password.length < 6) {
//     return 'Password must be at least 6 characters.';
//   }
//
//   return null;
// }


router.get('/', needAuth, (req, res, next) => {
  User.find({}, function(err, users) {
    if (err) {
      return next(err);
    }
    res.render('evnets/index', {users: users});
  }); // TODO: pagination?
});

router.get('/new', (req, res, next) => {
  res.render('events/new', {messages: req.flash()});
});

module.exports = router;
