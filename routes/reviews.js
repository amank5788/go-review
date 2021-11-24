const express = require('express');
const router = express.Router({mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Product = require('../models/product');
const Review = require('../models/review');
const reviews = require('../controllers/reviews')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');


router.post('/', validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
