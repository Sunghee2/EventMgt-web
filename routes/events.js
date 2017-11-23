const express = require('express');
const Event = require('../models/event');
const Answer = require('../models/answer');
const Participant = require('../models/participant');
const catchErrors = require('../lib/async-error');

const router = express.Router();

function needAuth(req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.flash('danger', 'Please signin first.');
      res.redirect('/');
    }
}

function validateForm(form, options) {
  var title = form.title || "";
  var location = form.location || "";
  var start_date = form.start_date || "";
  var end_date = form.end_date || "";
  var event_description = form.event_description || "";
  var organizer = form.organizer || "";
  var organizer_description = form.organizer_description || "";

  title = title.trim();
  location = location.trim();
  event_description = event_description.trim();
  organizer = organizer.trim();
  organizer_description = organizer_description.trim();

  if (!title) {
    return 'Title is required.';
  }

  if (!location) {
    return 'Location is required.';
  }

  if (!start_date) {
    return 'Start date is required.';
  }

  if (!end_date) {
    return 'End date is required.';
  }

  if (!event_description) {
    return 'Event description is required.';
  }

  if (!organizer) {
    return 'Organizer is required.';
  }

  if (!organizer_description) {
    return 'Organizer description is required.';
  }

  return null;
}

router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const events = await Event.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
    page: page, limit: limit
  });
  res.render('events/index', {events: events, term: term});
}));

router.get('/new', needAuth, catchErrors(async(req, res, next) => {
  res.render('events/new', {events: {}});
}));

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  res.render('events/edit', {event: event});
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('author');
  const participants = await Participant.find({event: event.id}).populate('participant');

  await event.save();
  res.render('events/show', {event: event, participants: participants});
}));

router.put('/:id', catchErrors(async (req, res, next) => { // 수정용.
  const event = await Event.findById(req.params.id);

  if (!event) {
    req.flash('danger', 'Not exist event');
    return res.redirect('back');
  }

  const err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  event.title = req.body.title;
  event.event_description = req.body.event_description;
  event.event_type = req.body.event_type.split(" ").map(e => e.trim());

  await event.save();
  req.flash('success', 'Successfully updated');
  res.redirect('/events');
}));

router.delete('/:id', needAuth, catchErrors(async (req, res, next) => {
  await Event.findOneAndRemove({_id: req.params.id});
  req.flash('success', 'Successfully deleted');
  res.redirect('/events');
}));

router.post('/', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const err = validateForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var event = new Event({
    title: req.body.title,
    author: user._id,
    location: req.body.location,
    start_date: req.body.start_date,
    start_time: req.body.start_time,
    start_am: req.body.start_am,
    start_pm: req.body.start_pm,
    end_date: req.body.end_date,
    end_time: req.body.end_time,
    end_am: req.body.end_am,
    end_pm: req.body.end_pm,
    event_description: req.body.event_description,
    organizer: req.body.organizer,
    organizer_description: req.body.organizer_description,
    ticket_name: req.body.ticket_name,
    ticket_quantity: req.body.ticket_quantity,
    ticket_price: req.body.ticket_price,
    event_type: req.body.event_type,
    event_topic: req.body.event_topic
  });
  await event.save();
  req.flash('success', 'Successfully posted');
  res.redirect('/events');
}));

router.post('/:id/register', needAuth, catchErrors(async (req, res, next) => {
  const user = req.user;
  const event = await Event.findById(req.params.id);

  if (!event) {
    req.flash('danger', 'Not exist event');
    return res.redirect('back');
  }
  if(event.numRegister >= event.ticket_quantity){
    req.flash('danger', '인원 꽉 참');
    return res.redirect('back');
  }

  var participant = new Participant({
    participant: user._id,
    event: event._id,
    works_at: req.body.works_at,
    reason: req.body.reason
  });
  await participant.save();
  event.numRegister++;
  await event.save();

  req.flash('success', 'Successfully registered');
  res.redirect(`/events/${req.params.id}`);
}));

module.exports = router;
