const Campground = require('../models/campground');

//For /campgrounds route
module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

//To Render form to create new campground
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

//To create new campground
module.exports.createCampground = async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Campground Created');
    res.redirect('/campgrounds/' + campground._id)
}

//To Show a campground in detail
module.exports.showCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if (!campground) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground })
}

//To render for to edit a campground
module.exports.renderEditForm = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Campground Does Not Exist');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground })
}

//To edit a campground
module.exports.updateCampground = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }); //spreading using ...
    req.flash('success', 'Campground Updated');
    res.redirect('/campgrounds/' + campground._id);
}

//to delete a campground
module.exports.deleteCampground = async(req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `${deletedCampground.title} Deleted`)
    res.redirect('/campgrounds');
}