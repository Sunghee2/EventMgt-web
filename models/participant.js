const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schema = new Schema({
  participant: { type: Schema.Types.ObjectId, ref: 'User' },
  event: { type: Schema.Types.ObjectId, ref: 'Event' },
  works_at: {type: String},
  reason: {type: String},
  participatedAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});


var Participant = mongoose.model('Participant', schema);

module.exports = Participant;
