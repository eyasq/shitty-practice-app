var passport = require("passport");

const isLoggedIn = (req, res, next) => {
    console.log('req.user from isLoggedIn:........',req.user)
  if (!req.isAuthenticated()) {
    res.locals.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to view this page");
    console.log("redirecting to original url");
    return res.redirect("/home");
  }
  next();
};
module.exports.isLoggedIn = isLoggedIn;
