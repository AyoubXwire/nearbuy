const express = require('express');
const router = express.Router();

const {ensureAuth, ensureNotAuth} = require('../helpers/auth');

router.get('/', ensureNotAuth, (req, res) => {
    res.render('index');
});

// Handle geolocation
router.post('/location', ensureAuth, (req, res) => {
    res.cookie('latitude', req.body.latitude);
    res.cookie('longitude', req.body.longitude);
    res.send();
});

module.exports = router;