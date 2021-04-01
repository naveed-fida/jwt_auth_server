const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
};

exports.signin = (req, res, next) =>{
  res.send({token: tokenForUser(req.user)});
}

exports.signup = async function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!(email && password)) {
    return res.status(422).send({error: 'must provide email and password'});
  }

  try {
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) {
      return res.status(422).send({error: 'email is in use'});
    }

    const user = new User({
      email,
      password
    });

    await user.save();
    res.json({token: tokenForUser(user)});
  } catch (e) {
    next(e);
  }
}
