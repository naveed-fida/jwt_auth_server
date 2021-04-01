const passport = require('passport');
const User = require('../models/user');
const config = require("../config");
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const LocalStrategy = require('passport-local');

const localOptions = {
  usernameField: 'email'
}
const localLogin = new LocalStrategy(localOptions, async (email, password, done) => {
  try {
    const user = await User.findOne({email});
    if (!user) return done(null, false);

    const isMatch = await user.comparePassword(password);
    return done(null, isMatch ? user : false);
  } catch (e) {
    return done (err);
  }
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  try {
    const user = User.findById(payload.sub);
    done(null, user || false);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(jwtLogin);
passport.use(localLogin);