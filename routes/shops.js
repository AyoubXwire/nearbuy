const express = require('express');
const router = express.Router();

const {ensureAuth} = require('../helpers/auth');

const Shop = require('../models/shop');

router.get('/nearby', ensureAuth, (req, res) => {
    Shop.find({}, (err, shops) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('nearby', {shops: shops});
        }
    });
});

router.get('/preferred', ensureAuth, (req, res) => {
    res.render('preferred');
});

module.exports = router;