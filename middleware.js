module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; //Storing the sage from which the user will be redirted to login page
        req.flash('error', 'You Must Be Signed In');
        return res.redirect('/login');
    }
    next();
}