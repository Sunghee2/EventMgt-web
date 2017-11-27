const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');


var schema = new Schema({
  author: {type: Schema.Types.ObjectId, ref: 'User'},
  title: {type: String, trim: true, required: true},
  location: {type: String, trim: true, required: true},
  start_date: {type: Date, default: Date.now, required: true},
  start_time: {type: String},
  start_am: {type: Boolean},
  start_pm: {type: Boolean},
  end_date: {type: Date, default: Date.now, required: true},
  end_time: {type: String},
  end_am: {type: Boolean},
  end_pm: {type: Boolean},
  // 이미지 파일. 태그 만들기
  event_description: {type: String, trim: true, required: true},
  organizer: {type: String, trim: true, required: true},
  organizer_description: {type: String, trim: true, required: true},
  ticket_name: {type: String},
  ticket_quantity: {type: Number},
  ticket_price: {type: Number, default: 0},
  event_type: {type: String},
  event_topic: {type: String},
  numRegister: {type: Number, default: 0}
},{
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

schema.plugin(mongoosePaginate);
var Event = mongoose.model('Event', schema);

module.exports = Event;
