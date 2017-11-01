var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var bcrypt = require("bcrypt-nodejs");//....
var SALT_FACTOR = 10;  //해시 알고리즘 적용 횟수. 높을수록 보안 높고 속도 느려짐.

var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  // required꼭입력. unique중복안됨. trim 공백제거(문자열에만)
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
//삽입
schema.methods.getname = function(){
  return this.displayName || this.username;
};
var noop = function(){};
//저장되기 전에 실행되는 함수
schema.pre("save", function(done){
  var user = this;
  if(!user.isModified("password")){
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, function(err, salt){
    if(err){
      return done(err);
    }
    bcrypt.hash(user.password,salt, noop, function(err, hashedPassword){
      if(err){
        return done(err);
      }
      user.password=hashedPassword;
      done();
    });
  });
});
//비밀번호검사함수
schema.methods.checkPassword = function(guess, done){
  bcrypt.compare(guess, this.password, function(err, isMatch){
    done(err,isMatch);
  });
};



var User = mongoose.model('User', schema);

module.exports = User;
