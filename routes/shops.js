const express = require('express');
const router = express.Router();

router.get('/nearby', (req, res) => {
    res.render('nearby');
});

router.get('/preferred', (req, res) => {
    res.render('preferred');
});

module.exports = router;