const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  // required꼭입력. unique중복안됨. trim 공백제거(문자열에만)
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10); // return Promise
};

//비밀번호검사함수
schema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password); // return Promise
};



var User = mongoose.model('User', schema);

module.exports = User;
