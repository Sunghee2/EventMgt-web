const express = require('express');
const Event = require('../../models/event');
const Answer = require('../../models/answer');
const Favorite = require('../../models/favorite');
const catchErrors = require('../../lib/async-error');

const router = express.Router();

router.use(catchErrors(async (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    next({status: 401, msg: 'Unauthorized'});
  }
}));

router.use('/events', require('../events'));

router.post('/events/:id/favorite', catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  if (!event) {
    return next({status: 404, msg: 'Not exist events'});
  }
  var favorite = await Favorite.findOne({author: req.user._id, event: event._id});
  if (!favorite) {
    await Promise.all([
      Favorite.create({author: req.user._id, event: event._id})
    ]);
  }
  return res.json(event);
}));

module.exports = router;
