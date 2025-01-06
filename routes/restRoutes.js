const express = require("express");
const router = express.Router();
const {postNewRest, showRests, getNewRest,showRest, showEdit, putEdit, destroyRest} = require('../controllers/restControllers')

router.route('')
  .get(showRests)
  .post(postNewRest);

router.route('/:id')
  .get(showRest)
  .put(putEdit)
  .delete(destroyRest);

router.get("/new", getNewRest);
router.get("/:id/edit",showEdit);

module.exports = router;
