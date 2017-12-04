var express = require('express');
const Event = require('../models/event');
const catchErrors = require('../lib/async-error');

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
  const events = await Event.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
  });
  res.render('index', {events: events});
}));

router.get('/test', function(req, res, next) {
  res.render('test');
});

module.exports = router;
