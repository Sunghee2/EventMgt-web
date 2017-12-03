const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
var Favorite = mongoose.model('Favorite', schema);

module.exports = Favorite;
