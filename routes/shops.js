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

    Shop.find(query)
    .then(shops => res.render('nearby', {shops: shops}))
    .catch(err => console.log(err));
});

router.get('/preferred', ensureAuth, (req, res) => {
    const query = { _id: { $in: req.user.liked }};

    Shop.find(query)
    .then(shops => res.render('preferred', {shops: shops}))
    .catch(err => console.log(err));
});

// TODO: Should these routes be PUT requests?
// TODO: Flash messages should maybe display the shop's name?
router.get('/:shop/like', ensureAuth, (req, res) => {
    req.user.like(req.params.shop);
    req.flash('success', 'Added to preferred shops');
    res.redirect('/shops/nearby');
});

router.get('/:shop/dislike', ensureAuth, (req, res) => {
    req.user.dislike(req.params.shop);
    req.flash('success', 'Added to disliked shops, it will be shown back again within nearby shops in two hours');
    res.redirect('/shops/nearby');
});

router.get('/:shop/remove', ensureAuth, (req, res) => {
    req.user.removeLiked(req.params.shop);
    req.flash('success', 'Removed from preffered shops');
    res.redirect('/shops/preferred');
});

module.exports = router;