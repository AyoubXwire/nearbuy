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

router.get('/:shop/like', ensureAuth, (req, res) => {
    req.user.like(req.params.shop);
    res.redirect('/shops/nearby');
});

router.get('/:shop/dislike', ensureAuth, (req, res) => {
    req.user.dislike(req.params.shop);
    res.redirect('/shops/nearby');
});

router.get('/:shop/remove', ensureAuth, (req, res) => {
    req.user.removeLiked(req.params.shop);
    res.redirect('/shops/nearby');
});

module.exports = router;