var express = require('express');
const Event = require('../models/event');
const User = require('../models/user');
const catchErrors = require('../lib/async-error');
var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var async = require('async');
var crypto = require('crypto');

var router = express.Router();

router.get('/', catchErrors(async (req, res, next) => {
  var query = {};
  const term = req.query.term;
  const location = req.query.location;
  if (term && location) {
    query = {$and: [
      {title: {'$regex': term, '$options': 'i'}},
      {location: {'$regex': location, '$options': 'i'}}
    ]};
  }
  const events = await Event.find(query).limit(6);
  res.render('index', {events: events});
}));

router.get('/reset/:token', function(req, res){
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/');
    }
    res.render('users/reset', {
      user: req.user
    });
  });
});

router.post('/reset/:token', function(req, res){
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, async function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
      }

      if(!req.body.new_password) {
        req.flash('danger', 'Password is requried.');
        return res.redirect('back');
      }
      if(req.body.new_password !== req.body.new_password_confirmation){
        req.flash('danger', 'Password do not match.');
        return res.redirect('back');
      }
      if(req.body.new_password.legnth < 6){
        req.flash('danger', 'Password must be at least 6 characters.');
        return res.redirect('back');
      }

      user.password = await user.generateHash(req.body.new_password);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save(function(err){
        if(err) {next(err)}
        else {
          req.flash('success', 'Updated successfully.');
          res.redirect('/');
        }
      })
    });
    },
    ], function(err) {
      res.redirect('/');
    });
  }
);

router.post('/resetPassword', function(req, res, next){
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
   function(token, done) {
     User.findOne({ email: req.body.email }, function(err, user) {
       if (!user) {
         req.flash('error', 'No account with that email address exists.');
         return res.redirect('/');
       }

       user.resetPasswordToken = token;
       user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

       user.save(function(err) {
         done(err, token, user);
       });
     });
   },
   function(token, user, done) {
     var auth = {
       auth: {
         api_key: 'key-239b83cceabc4d34e44eee9c9cf61168',
         domain: 'sandbox205921ec52164a688e49e9d6a93f4336.mailgun.org'
      }
     }
     var nodemailerMailgun = nodemailer.createTransport(mg(auth));
     var mailOptions = {
       to: user.email,
       from: 'passwordreset@demo.com',
       subject: 'Password Reset',
       text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
         'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
         'http://' + req.headers.host + '/reset/' + token + '\n\n' +
         'If you did not request this, please ignore this email and your password will remain unchanged.\n'
     };
     nodemailerMailgun.sendMail(mailOptions, function(err) {
       req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
       done(err, 'done');
     });
   }
  ], function(err) {
   if (err) return next(err);
   res.redirect('/');
  });
});

module.exports = router;
