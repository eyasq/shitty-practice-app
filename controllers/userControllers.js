var User = require("../models/user");
const passport = require('passport')

module.exports.getLogin = (req, res) => {
    res.render("user/login");
}

module.exports.postLogin =[ passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    keepSessionInfo: true,}),  (req, res) => {
    req.flash("success", "Successfully logged in");
    const redirectUrl = req.session.returnTo || '/home'
    res.redirect(redirectUrl);
}]

module.exports.getRegister =  (req, res) => {
    res.render("user/register");
}

module.exports.postRegister = async (req, res,next) => {
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
}

module.exports.getLogout = (req, res, next) => {
    req.logout((er) => {
      if (er) {
        return next(er);
      }
      req.flash("success", "Successfully logged out");
      res.redirect("/home");
    });
}
