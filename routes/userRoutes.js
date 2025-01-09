const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
var User = require("../models/user");
var passport = require("passport");
const {getRegister,postRegister,getLogin,postLogin,getLogout} = require('../controllers/userControllers.js')

router.route('/register')
  .get(getRegister)
  .post(postRegister);
router.route('/login')
  .get(getLogin)
  .post(postLogin)


router.get("/logout",getLogout);

module.exports = router;
