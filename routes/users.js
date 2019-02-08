const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/shops/nearby?page=1',
    failureRedirect: '/users/login',
    failureFlash: true
}), (req, res) => {
    User.findOne({ username: req.body.username })
    .then(user => {
        if(user === undefined || user.password !== req.body.password) {
            res.redirect('/')
        }
        else {
            res.redirect('/shops/nearby?page=1');
        }
    })
    .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/users/login')
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    validateForm(req.body)
    .then((validUser) => {
        User.register(validUser, req.body.password, (err, user) => {
            if(err) {
                req.flash('error', err.message);
                return res.redirect('/users/register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/shops/nearby?page=1');
            });
        });
    })
    .catch(error => {
        req.flash('error', error);
        res.redirect('/users/register');
    });
});

// Make sure the form is valid and return the error message if any
function validateForm({ username, email, password, password2 }) {
    return new Promise((resolve, reject) => {
        // Check required fields
        if(!username || !email || !password || !password2) {
            reject('Please fill in all fields');
        }
    
        // Check password strength
        if(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password) == false){
            reject('Password should be at least 8 characters long and contains uppercase, lowercase, number and a symbol');
        }
    
        // Check passwords match
        if(password !== password2) {
            reject('Passwords do not match');
        }
        
        // If the form is valid
        const validUser = new User({
            username: username,
            email: email
        });
        resolve(validUser);
    });
}

module.exports = router;