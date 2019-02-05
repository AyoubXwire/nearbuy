const express = require('express');
const router = express.Router();

const {ensureAuth} = require('../helpers/auth');

const Shop = require('../models/shop');

// TODO: Implement pagination
// TODO: Sort shops by distance
router.get('/nearby', ensureAuth, (req, res) => {
    const query = { $and: [
        { _id: { $nin: req.user.liked }},
        { _id: { $nin: req.user.disliked }}
    ]};
    Shop.find(query , (err, shops) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('nearby', {shops: shops});
        }
    });
});

router.get('/preferred', ensureAuth, (req, res) => {
    Shop.find({ _id: { $in: req.user.liked }}, (err, shops) => {
        if(err) {
            console.log(err);
        }
        else {
            res.render('preferred', {shops: shops});
        }
    });
});

// TODO: Add flash messages
// TODO: Should these routes be PUT requests? 
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
    res.redirect('/shops/preferred');
});

module.exports = router;