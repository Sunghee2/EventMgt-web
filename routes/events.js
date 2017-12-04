const express = require('express');
const Event = require('../models/event');
const Answer = require('../models/answer');
const Participant = require('../models/participant');
const Question = require('../models/question');
const Review = require('../models/review');
const Favorite = require('../models/favorite');
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

function validateQuestionForm(form, options){
  var title = form.title || "";
  var contents = form.contents || "";

  title = title.trim();
  contents = contents.trim();

  if (!title) {
    return '제목은 입력해주세요.';
  }

  if(title.length>=20){
    return '제목은 10글자로 제한됩니다.'
  }

  if (!contents) {
    return '내용을 입력해주세요.';
  }
  return null;
}

router.get('/', catchErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  var query = {};
  const term = req.query.term;
  const location = req.query.location;

  if (location) {
    query = {$and: [
      {title: {'$regex': term, '$options': 'i'}},
      {location: {'$regex': location, '$options': 'i'}},
    ]};
  }
  else if (term) {
    query = {$or: [
      {title: {'$regex': term, '$options': 'i'}},
      {location: {'$regex': term, '$options': 'i'}},
      {event_topic: {'$regex': term, '$options': 'i'}}
    ]};
  }
  const events = await Event.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
    page: page, limit: limit
  });
  res.render('events/index', {events: events, term: term, query: req.query});
}));

router.get('/map.json', catchErrors(async(req,res,next)=>{
  var query = {};
  const events = await Event.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
  });
  res.json(events);
}));

router.get('/map', catchErrors(async(req,res,next)=>{
  var query = {};
  const events = await Event.paginate(query, {
    sort: {createdAt: -1},
    populate: 'author',
  });
  res.render('events/map',{events: events});
}));

router.get('/new', needAuth, catchErrors(async(req, res, next) => {
  res.render('events/new', {events: {}});
}));

router.get('/:id/edit', needAuth, catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  res.render('events/edit', {event: event});
}));

router.get('/:id/question', needAuth, catchErrors(async (req, res, next)=>{
  const event = await Event.findById(req.params.id);
  res.render('events/question', {event: event});
}));

router.get('/:id/review', needAuth, catchErrors(async (req, res, next)=>{
  const event = await Event.findById(req.params.id);
  res.render('events/review', {event: event});
}));

router.get('/:id.json', catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id);
  const questions = await Question.find({event: event.id}).populate('author');

  res.json(questions);
}));

router.get('/:id', catchErrors(async (req, res, next) => {
  const event = await Event.findById(req.params.id).populate('author');
  const participants = await Participant.find({event: event.id}).populate('participant');
  const questions = await Question.find({event: event.id}).populate('author');
  const reviews = await Review.find({event: event.id}).populate('author');

  await event.save();
  res.render('events/show', {event: event, participants: participants, questions: questions, reviews: reviews});
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
  event.location = req.body.location;
  event.start_date = req.body.start_date;
  event.start_time = req.body.start_time;
  event.start_am = req.body.start_am;
  event.start_pm = req.body.start_pm;
  event.end_date = req.body.end_date;
  event.end_time = req.body.end_time;
  event.end_am = req.body.end_am;
  event.end_pm = req.body.end_pm;
  event.event_description = req.body.event_description;
  event.organizer = req.body.organizer;
  event.organizer_description = req.body.organizer_description;
  event.ticket_name = req.body.ticket_name;
  event.ticket_price = req.body.ticket_price;
  event.event_type = req.body.event_type;
  event.event_topic = req.body.event_topic;

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

router.post('/:id/question', needAuth, catchErrors(async (req, res, next)=>{
  const user = req.user;
  const event = await Event.findById(req.params.id);
  const err = validateQuestionForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  var question = new Question({
    author: user._id,
    event: event._id,
    title: req.body.title,
    contents: req.body.contents
  });
  await question.save();

  req.flash('success', 'Successfully registered');
  res.redirect(`/events/${req.params.id}`);
}));

router.post('/:id/:id_question/answers', needAuth, catchErrors(async (req, res, next)=>{
  const user = req.user;
  const event = await Event.findById(req.params.id);
  const question = await Question.findById(req.params.id_question);


  question.answer = req.body.answer;

  await question.save();

  req.flash('success', '답변이 등록되었습니다.');
  res.redirect(`/events/${req.params.id}`);
}));

router.post('/:id/review', needAuth, catchErrors(async (req, res, next)=>{
  const user = req.user;
  const event = await Event.findById(req.params.id);
  const err = validateQuestionForm(req.body);
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }

  var review = new Review({
    author: user._id,
    event: event._id,
    title: req.body.title,
    contents: req.body.contents
  });
  await review.save();

  req.flash('success', 'Successfully registered');
  res.redirect(`/events/${req.params.id}`);
}));

router.post('/:id/:id_review/answers', needAuth, catchErrors(async (req, res, next)=>{
  const user = req.user;
  const event = await Event.findById(req.params.id);
  const review = await review.findById(req.params.id_review);


  review.answer = req.body.answer;

  await review.save();

  req.flash('success', '답변이 등록되었습니다.');
  res.redirect(`/events/${req.params.id}`);
}));

// router.post('/:id/favorite', catchErrors(async (req, res, next) => {
//   console.log('지나감1');
//   const event = await Event.findById(req.params.id);
//   if (!event) {
//     return next({status: 404, msg: 'Not exist event'});
//   }
//   console.log('지나감2');
//   console.log(req.user._id);
//   console.log(event._id);
//   var favorite = await Favorite.findOne({author: req.user._id, event: req.params.id});
//   console.log('지나감3');
//   if (!favorite) {
//     Favorite.create({author: req.user._id, event: event._id})
//   }
//   console.log('지나감4');
//   return res.json(event);
// }));

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: err.status,
    msg: err.msg || err
  });
});

module.exports = router;
