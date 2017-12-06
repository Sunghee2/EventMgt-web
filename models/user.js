const mongoose = require('mongoose'),
    Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  isAdmin: {type: Boolean, default: false},
  facebook: {id: String, token: String, photo: String},
  kakaotalk: {id: String, token: String, photo: String},
  createdAt: {type: Date, default: Date.now},
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  toJSON: {virtuals: true},
  toObject: {virtuals: true}
});

schema.methods.generateHash = function(password) {
  return bcrypt.hash(password, 10);
};

schema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

schema.pre('save', function(next){
    var user = this;

    if(!user.isModified('password')){
      return next()
    }

    user.password = bcrypt.hash(user.password,10);
    next()
})

var User = mongoose.model('User', schema);

module.exports = User;
