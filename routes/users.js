const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
    //To render signup form
    .get(users.renderRegister)
    //to signup
    .post(catchAsync(users.register));

//login routes
router.route('/login')
    //to render login form
    .get(users.loginForm)
    //to login
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), catchAsync(users.login));

//To logout
router.get('/logout', users.logout);

module.exports = router;