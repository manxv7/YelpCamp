const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const Joi = require('joi');
const Campground = require('./models/campground');
const { campgroundSchema } = require('./schemas.js'); //To validate data
const methodOverride = require('method-override');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
    console.log("MongoDB Connected");
});

app.engine('ejs', ejsMate);
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


//Middleware to validate data
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
    // console.log(result);
}



app.get('/', (req, res) => {
    res.render('home');
});

//View all campgrounds
app.get('/campgrounds', catchAsync(async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));


//Add a new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async(req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Data', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect('/campgrounds/' + campground._id)
}))


//View one campground in details
app.get('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/show', { campground })
}));

//edit or update a campground

app.get('/campgrounds/:id/edit', catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground })
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground }); //spreading using ...
    res.redirect('/campgrounds/' + campground._id);
}))

//Deleteing a campground
app.delete('/campgrounds/:id', catchAsync(async(req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

//Route Not Found
app.all('*', (req, res, next) => {
    // res.send("404");
    next(new ExpressError('Page Not Found', 404));
})

//Error Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No Something Went Wrong'; //If meassage is not present setting a default message
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Listening to port 3000!!");
})