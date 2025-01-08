const {wrapAsync} = require('../utils/wrapAsync')
const Rest = require('../models/rest')
const {isLoggedIn, isOwner} = require('../utils/middleware')
const {validateRest,validateReview} = require('../utils/schemas')
const multer = require('multer')
const {storage}  = require('../cloudinary')
const upload = multer({storage});
module.exports.getNewRest =[isLoggedIn, (req, res) => {
  res.render("pages/new.ejs");
}]

module.exports.showRests =  wrapAsync(async (req, res) => {
    var rests = await Rest.find({});
    res.render("pages/home.ejs", { rests });
  })


module.exports.postNewRest =[isLoggedIn,upload.array('rest[image]'), wrapAsync(async (req, res) => {
  var rest = new Rest(req.body.rest);
  rest.author = req.user._id;
  rest.images = req.files.map(f=>({url:f.path, filename:f.filename}))
  await rest.save();
  req.flash("success", "Successfully added Restaurant");
  res.redirect("/home");
  console.log(req.body, req.files)
  res.redirect('/home')
})]

module.exports.showRest = wrapAsync(async (req, res) => {
    var restId = req.params.id;
    var rest = await Rest.findById(restId).populate({path:"reviews",populate:{
      path:'author'
    }}).populate('author');
    if (!rest) {
      req.flash("error", "Cannot find this restaurant");
      return res.redirect("/home");
    }

    res.render("pages/show", { rest });
  })

module.exports.showEdit =[ isLoggedIn,isOwner,
wrapAsync(async (req, res) => {
  var restId = req.params.id;
  var rest = await Rest.findById(restId);
  res.render("pages/edit", { rest });
})]

module.exports.putEdit = [isLoggedIn,
isOwner,upload.array('rest[image]'),
wrapAsync(async (req, res) => {
  var restId = req.params.id;
  var restEdited = await Rest.findByIdAndUpdate(restId, req.body.rest, {new: true,runValidators: true,});
  const imgs = req.files.map(f=>({url:f.path, filename: f.filename}))
  restEdited.images.push(...imgs)
  await restEdited.save();
  res.redirect(`/home/${restId}`);
})]

module.exports.destroyRest = [isLoggedIn,isOwner, async (req, res) => {
    var { id } = req.params;
    await Rest.findByIdAndDelete(id);
    req.flash("success", "Succesfully Deleted Restaurant");
    res.redirect("/home");
  }]