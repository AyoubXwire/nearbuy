module.exports = {
    ensureAuth: (req, res, next) => {
        if(req.isAuthenticated()) {
            return next()
        }
        req.flash('error', 'Please login first')
        res.redirect('/users/login')
    },
    ensureNotAuth: (req, res, next) => {
        if(!req.isAuthenticated()) {
            return next()
        }
        res.redirect('/shops/nearby')
    }
}