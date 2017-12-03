const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  title: {type: String, required: true},
  contents: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  answer: {type: String}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Review = mongoose.model('Review', schema);

module.exports = Review;
