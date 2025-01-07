const express = require("express");
const router = express.Router();
const {postNewRest, showRests, getNewRest,showRest, showEdit, putEdit, destroyRest} = require('../controllers/restControllers')
const multer = require('multer')
const upload = multer({dest:'uploads/'});

router.route('')
  .get(showRests)
  .post(postNewRest);
router.get("/new", getNewRest);
router.route('/:id')
  .get(showRest)
  .put(putEdit)
  .delete(destroyRest);
router.get("/:id/edit",showEdit);

module.exports = router;
