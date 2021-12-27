const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js'); //To validate data

//Middleware to validate data
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


//View all campgrounds
router.get('/', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));


//Add a new campground
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

router.post('/', validateCampground, catchAsync(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Campground Created');
    res.redirect('/campgrounds/' + campground._id)
}))


//View one campground in details
router.get('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}));

//edit or update a campground

router.get('/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}))

router.put('/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }); //spreading using ...
    req.flash('success', 'Campground Updated');
    res.redirect('/campgrounds/' + campground._id);
}))

//Deleting a campground
router.delete('/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `${deletedCampground.title} Deleted`)
    res.redirect('/campgrounds');
}))

module.exports = router;