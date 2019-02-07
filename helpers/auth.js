module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Please login first');
        res.redirect('/users/login');
    }
}