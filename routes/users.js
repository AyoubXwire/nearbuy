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

router.post('/register', (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = validateForm(username, email, password, password2);

    // Handle the form
    if(errors.length > 0) {
        console.log(errors);
        res.render('register');
    } else {
        // Create the user
        const newUser = new User({
            username: req.body.username,
            email: req.body.email
        });
        User.register(newUser, req.body.password, (err, user) => {
            if(err) {
                console.log(err.message);
                return res.redirect('/users/register');
            }
            passport.authenticate('local')(req, res, () => {
                res.redirect('/shops/nearby');
            });
        });
    }
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/shops/nearby',
    failureRedirect: '/'
}), (req, res) => {
    User.findOne({username: req.body.username}, (err, user) => {
        if(user === undefined || user.password !== req.body.password) {
            res.redirect('/')
        }
        else {
            res.redirect('/shops/nearby');
        }
    });
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/')
});

function validateForm(username, email, password, password2) {
    let errors = [];

    // Check required fields
    if(!username || !email || !password || !password2) {
        errors.push({ msg: 'Please fill in all the fields' });
    }

    // Check password strength
    if(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/.test(password) == false){
        errors.push({ msg: 'Make sure your password is at least 8 characters long and contains uppercase, lowercase, number and a symbol' });
    }

    // Check passwords match
    if(password !== password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    return errors;
}

module.exports = router;