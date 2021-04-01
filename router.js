const router = require('express').Router();
const Authentication = require("./controllers/authentication")
const passportService = require("./services/passport");
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignIn = passport.authenticate('local', {session: false});

router.post("/signup", Authentication.signup);
router.post("/signin", requireSignIn, Authentication.signin);
router.get("/", requireAuth, (req, res) => {
  res.send({hi: 'there'});
});
module.exports = router;
