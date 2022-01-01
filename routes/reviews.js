// /campgrounds/:id/reviews is prepended in all these reviews
// mergeParams:true is to retrive id varible from index.js file

const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');


//Adding a review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//Deleting a Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;