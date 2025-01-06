const express = require("express");
const app = express();
const router = express.Router();
const { wrapAsync } = require("../utils/wrapAsync");
const AppError = require("../utils/AppError");
const Review = require("../models/reviews");
const Rest = require("../models/rest");
const { validateRest } = require("../utils/schemas");
const { isLoggedIn, isOwner } = require("../utils/middleware");

router.get(
  "",
  wrapAsync(async (req, res) => {
    var rests = await Rest.find({});
    res.render("pages/home.ejs", { rests });
  })
);
router.get("/new", isLoggedIn, (req, res) => {
  res.render("pages/new.ejs");
});
router.post("", validateRest, isLoggedIn, async (req, res) => {
  var rest = new Rest(req.body.rest);
  rest.author = req.user._id;
  await rest.save();
  req.flash("success", "Successfully added Restaurant");
  res.redirect("/home");
});
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    var restId = req.params.id;
    var rest = await Rest.findById(restId).populate({path:"reviews",populate:{
      path:'author'
    }}).populate('author');
    if (!rest) {
      req.flash("error", "Cannot find this restaurant");
      return res.redirect("/home");
    }
    console.log('##########################')
    console.log('user',req.user,'author', rest.author)
    console.log('##########################')
    res.render("pages/show", { rest });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,isOwner,
  wrapAsync(async (req, res) => {
    var restId = req.params.id;
    var rest = await Rest.findById(restId);
    res.render("pages/edit", { rest });
  })
);
router.put(
  "/:id",
  isLoggedIn,
  validateRest,isOwner,
  wrapAsync(async (req, res) => {
    var restId = req.params.id;
    var restEdited = await Rest.findByIdAndUpdate(restId, req.body.rest, {
      new: true,
      runValidators: true,
    });
    await restEdited.save();
    res.redirect(`/home/${restId}`);
  })
);
router.delete("/:id/", isLoggedIn,isOwner, async (req, res) => {
  var { id } = req.params;
  await Rest.findByIdAndDelete(id);
  req.flash("success", "Succesfully Deleted Restaurant");
  res.redirect("/home");
});

module.exports = router;
