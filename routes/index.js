const express = require('express');
const router = express.Router();

const {ensureNotAuth} = require('../helpers/auth');

router.get('/', ensureNotAuth, (req, res) => {
    res.render('index');
});

module.exports = router;