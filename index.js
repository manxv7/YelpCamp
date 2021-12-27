const express = require('express');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');

//Express Routers
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //Serving Static Files i.e. css,js files

const sessionConfig = {
    secret: 'thisisthekey',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //Date.now() is in millisecond, we are writing 7 days from now
        maxAge: 100 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

//To Save Flash Message
//properties in res.locals can be accessed by our ejs templates
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Home Page
app.get('/', (req, res) => {
    res.render('home');
});

//Campground Routes
app.use('/campgrounds', campgrounds);

//Review Routes
app.use('/campgrounds/:id/reviews', reviews);

//Route Not Found
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
    // throw new ExpressError('Page Not Found', 404);
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