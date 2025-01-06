
const express = require('express')
const router = express.Router({mergeParams:true});
const{postReview, destroyReview} = require('../controllers/reviewControllers')
router.post('/',postReview)
router.delete('/:revId',destroyReview)


module.exports = router;