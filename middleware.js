const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js'); //To validate data
const Campground = require('./models/campground');
const Review = require('./models/review');

//To check is someone loggedIn
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //Storing the sage from which the user will be redirted to login page
        req.flash('error', 'You Must Be Signed In');
        return res.redirect('/login');
    }
    next();
}

//Middleware to validate data
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

//To check whether the current user is author of said campground
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'Permission denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//To check whether the current user is author of said review
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'Permission denied');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//Middlewares to validate data
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}