const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

//To SignUp/register
router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password); //Passport Provided function
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to YelpCamp');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}))

//login routes
router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(async(req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; //To send user back to the page from where they were directed to login page
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}))

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out')
    res.redirect('/campgrounds');
})
module.exports = router;