const express = require('express');
const router = express.Router();

const {ensureAuth} = require('../helpers/auth');

router.get('/nearby', ensureAuth, (req, res) => {
    res.render('nearby');
});

router.get('/preferred', ensureAuth, (req, res) => {
    res.render('preferred');
});

module.exports = router;