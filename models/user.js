const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
});

// on save hook encrypt password
userSchema.pre('save', async function(next) {
  const user = this;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;
    console.log(hash);
    next();
  } catch (e) {
    return next(e);
  }
});

Object.assign(userSchema.methods, {
  comparePassword: async function(candidatePass, cb) {
    if (!cb || typeof cb !== 'Function') {
      return new Promise(async (resolve, reject) => {
        try {
          const isMatch = await bcrypt.compare(candidatePass, this.password);
          resolve(isMatch);
        } catch (e) {
          reject(e);
        }
      });
    }

    try {
      const isMatch = await bcrypt.compare(candidatePass, this.password);
      cb(null, isMatch);
    } catch (e) {
      return cb(e)
    }
  }
});

const model = mongoose.model('user', userSchema);
module.exports = model;