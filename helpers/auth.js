module.exports = {
    ensureAuth: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error', 'Please login first');
        res.redirect('/users/login');
    },
    ensureNotAuth: function(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        res.redirect('/shops/nearby?page=1');
    }
}