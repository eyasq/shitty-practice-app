if(process.env.NODE_ENV!== "production"){
  require('dotenv').config()
}
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const app = express();
var AppError = require("./utils/AppError");
const restRoutes = require("./routes/restRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

mongoose
  .connect("mongodb://localhost:27017/bidyaR")
  .then(() => {
    console.log("mongo con success");
  })
  .catch((e) => {
    console.log(e, "mongo conn error");
  });
var sessionConfig = {
  secret: "FooBar",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24,
    maxAge: 1000 * 60 * 60 * 24,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/home", restRoutes);
app.use("/home/:id/reviews", reviewRoutes);
app.use("", userRoutes);
app.get('home/new', (req, res) => {
  res.render("pages/new.ejs");
})
app.all("*", (req, res, next) => {
  throw new AppError("Page not found!", 404);
  next();
});

app.use((err, req, res, next) => {
  var { status = 500, message = "Something went wrong!" } = err;
  if (err.name == "ValidationError") {
    err.message = "Validation Fail";
    err.status = 400;
  } else if (err.name == "CastError") {
    err.message = "Could not cast to this ID";
    err.status = 400;
  }
  res.status(status).render("error.ejs", { err });
});
app.listen("3000", () => {
  console.log("listening on 3000");
});
