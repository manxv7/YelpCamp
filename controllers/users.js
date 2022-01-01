const User = require('../models/user');

//To render Form for registration
module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

//To register
module.exports.register = async(req, res) => {
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
}

//To render login form
module.exports.loginForm = (req, res) => {
    res.render('users/login');
}

//To login
module.exports.login = async(req, res) => {
    req.flash('success', 'Welcome Back!!');
    const redirectUrl = req.session.returnTo || '/campgrounds'; //To send user back to the page from where they were directed to login page
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

//To Logout
module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out')
    res.redirect('/campgrounds');
}