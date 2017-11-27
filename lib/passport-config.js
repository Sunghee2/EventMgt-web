const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) =>  {
    User.findById(id, done);
  });

  passport.use('local-signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, async (req, email, password, done) => {
    try {
      const user = await User.findOne({email: email});
      if (user && await user.validatePassword(password)) {
        return done(null, user, req.flash('success', 'Welcome!'));
      }
      return done(null, false, req.flash('danger', 'Invalid email or password'));
    } catch(err) {
      done(err);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID : '524474811239369',
    clientSecret : '07b51954f8acaac626f446f75b1bfdf9',
    callbackURL : 'http://localhost:3000/auth/facebook/callback',
    profileFields : ['email', 'name', 'picture']
  }, async (token, refreshToken, profile, done) => {
    console.log('Facebook', profile);
    try {
      var email = (profile.emails && profile.emails[0]) ? profile.emails[0].value : '';
      var picture = (profile.photos && profile.photos[0]) ? profile.photos[0].value : '';
      var name = (profile.displayName) ? profile.displayName :
        [profile.name.givenName, profile.name.middleName, profile.name.familyName]
          .filter(e => e).join(' ');
      console.log(email, picture, name, profile.name);
      var user = await User.findOne({'facebook.id': profile.id});
      if (!user) {
        if (email) {
          user = await User.findOne({email: email});
        }
        if (!user) {
          user = new User({name: name});
          user.email =  email ? email : `__unknown-${user._id}@no-email.com`;
        }
        user.facebook.id = profile.id;
        user.facebook.photo = picture;
      }
      user.facebook.token = profile.token;
      await user.save();
      return done(null, user);
    } catch (err) {
      done(err);
    }
  }));

  passport.use('kakao-login', new KakaoStrategy({
    clientID: '99e36183ee1bdc08c7a1a4d1afb5870b',
    clientSecret: 'GJwjsdKYX2L8iCKf4iI9jCI8TW6EybpH',
    callbackURL: 'http://localhost:3000/auth/kakaotalk/callback'
  }, async(token, refreshToken, profile, done) => {
    // console.log('Kakaotalk', proifle);
    try{
      var email = profile._json.kaccount_email;
      var picture = profile._json.properties.profile_image;
      var name = profile.displayName;
      var user = await User.findOne({'kakaotalk.id': profile.id});
      if(!user){
        if(email){
          user = await User.findOne({email: email});
        }
        if(!user){
          user = new User({name:name});
          user.email = email?email: `__unknown-${user._id}@no-email.com`;
        }
        user.kakaotalk.id = profile.id;
        user.kakaotalk.photo = picture;
      }
      user.kakaotalk.token = profile.token;
      await user.save();
      return done(null, user);
    } catch(err){
      don(err);
    }
  }));
};
