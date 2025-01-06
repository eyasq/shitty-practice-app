const express = require("express");
const app = express();
const router = express.Router({ mergeParams: true });
var User = require("../models/user");
var passport = require("passport");
router.get("/register", (req, res) => {
  res.render("user/register");
});
router.post("/register", async (req, res,next) => {
  try {
    var { username, email, password } = req.body;
    var user = new User({ username, email });
    var registeredUser = await User.register(user, password);
    req.login(registeredUser,err=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Welcome!");
        if(req.session.returnTo){
            return res.redirect(`${returnTo}`)
        }
        return res.redirect('/home')
    })
  } catch (e) {
    req.flash("error", e.message);
    console.log("error:", e);
    res.redirect("/register");
  }
});
router.get("/login", (req, res) => {
  res.render("user/login");
});

router.post("/login",passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,}),  (req, res) => {
    req.flash("success", "Successfully logged in");
    const redirectUrl = req.session.returnTo || '/home'
    res.redirect(redirectUrl);
  }
);
router.get("/logout", (req, res, next) => {
  req.logout((er) => {
    if (er) {
      return next(er);
    }
    req.flash("success", "Successfully logged out");
    res.redirect("/home");
  });
});

module.exports = router;
