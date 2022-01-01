// /campgrounds is prepended in all these routes

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgrounds = require('../controllers/campgrounds');



router.route('/')
    //To view all campgrounds
    .get(catchAsync(campgrounds.index))
    //To add new campground
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));


//Render form to add new campground
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


router.route('/:id')
    //View one campground in details
    .get(catchAsync(campgrounds.showCampground))
    //To Update a campground
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
    //Deleting a campground
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

//edit or update a campground
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

module.exports = router;