const express = require('express');
const router = express.Router();

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
    } else {
        console.log('Registered');
    }
});

router.post('/login', (req, res) => {

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