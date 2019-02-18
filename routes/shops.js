const express = require('express');
const router = express.Router();
const geolib = require('geolib');

const {ensureAuth} = require('../helpers/auth');

const Shop = require('../models/shop');

// Handle geolocation
let location;

router.post('/location', ensureAuth, (req, res) => {
    location = req.body;
    res.end();
});

router.get('/nearby', ensureAuth, (req, res) => {
    const query = { 
    $and: [
        { _id: { $nin: req.user.liked }},
        { _id: { $nin: req.user.disliked }}
    ]};

    Shop.find(query)
    .then(result => {
        // sort by distance from user if location provided
        if(location != null) {
            result.sort((a, b) => {
                const a_distance = geolib.getDistance(location, a.location.coordinates);
                const b_distance = geolib.getDistance(location, b.location.coordinates);
                if (a_distance < b_distance) {
                    return -1;
                }
                if (a_distance > b_distance) {
                    return 1;
                }
                return 0;
            });
        }
        res.render('nearby', {data: result});
    })
    .catch(err => console.log(err));

    // const paginate = { page: req.query.page || 1, limit: 24 };

    // Shop.paginate(query, paginate)
    // .then(result => {
    //     res.render('nearby', {data: result});
    // })
    // .catch(err => console.log(err));
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