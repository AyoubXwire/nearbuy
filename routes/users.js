const express = require('express');
const passport = require('passport');
const router = express.Router();

const User = require('../models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/shops/nearby',
    failureRedirect: '/'
}), (req, res) => {
    User.findOne({username: req.body.username})
    .then(user => {
        if(user === undefined || user.password !== req.body.password) {
            res.redirect('/')
        }
        else {
            res.redirect('/shops/nearby');
        }
    })
    .catch(err => console.log(err));
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});

router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    validateForm(username, email, password, password2)
        .then((validUser) => {
            User.register(validUser, req.body.password, (err, user) => {
                if(err) {
                    console.log(err.message);
                    return res.redirect('/users/register');
                }
                passport.authenticate('local')(req, res, () => {
                    res.redirect('/shops/nearby');
                });
            });
        })
        .catch(errors => {
            console.log(errors);
            res.render('register');
        });
});

// Make sure the form is valid and return an array of errors if any
function validateForm(username, email, password, password2) {
    return new Promise((resolve, reject) => {
        let errors = [];
    
        // Check required fields
        if(!username || !email || !password || !password2) {
            errors.push('Please fill in all fields');
        }
    
        // Check password strength
        if(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password) == false){
            errors.push('Password shouldt be at least 8 characters long and contains uppercase, lowercase, number and a symbol');
        }
    
        // Check passwords match
        if(password !== password2) {
            errors.push('Passwords do not match');
        }
    
        if(errors.length > 0) {
            reject(errors);
        } else {
            const validUser = new User({
                username: username,
                email: email
            });
            resolve(validUser);
        }
    });
}

module.exports = router;