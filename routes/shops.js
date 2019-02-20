const express = require('express');
const router = express.Router();
const geolib = require('geolib');

const {ensureAuth} = require('../helpers/auth');

const Shop = require('../models/shop');

router.get('/nearby', ensureAuth, (req, res) => {
    const location = {
        latitude: req.cookies.latitude,
        longitude: req.cookies.longitude
    };
    const query = { 
        $and: [
            { _id: { $nin: req.user.liked }},
            { _id: { $nin: req.user.disliked }}
        ]
    };
    
    Shop.find(query)
    .then(result => {
        // sort by distance from user if location available in cookies
        if(location.latitude != null && location.longitude != null) {
            result.sort(sortByDistance(location));
        }
        // Paginate the results
        paginate(result, req.query.page || 1, 24)
        .then(data => res.render('nearby', {data: data}))
        .catch(err => {
            console.log(err);
            res.redirect('/shops/nearby');
        });
    })
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

const sortByDistance = (location) => {
    return (a, b) => {
        const a_distance = geolib.getDistance(location, a.location.coordinates);
        const b_distance = geolib.getDistance(location, b.location.coordinates);
        if (a_distance < b_distance) {
            return -1;
        }
        if (a_distance > b_distance) {
            return 1;
        }
        return 0;
    }
}

const paginate = (array, pageNumber, pageSize) => {
    return new Promise((resolve, reject) => {
        pageNumber--;
        
        const totalPages = Math.ceil(array.length / pageSize);
        const docs = array.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize);
        const currentPage = pageNumber + 1;
        const size = pageSize;
        const hasNext = currentPage < totalPages;
        const hasPrev = currentPage > 1;
        const nextPage = currentPage + 1;
        const prevPage = currentPage - 1;

        if(currentPage < 1 || currentPage > totalPages) {
            reject('pageNumber out of boundaries');
        }
        resolve({ docs, totalPages, currentPage, size, hasNext, hasPrev, nextPage, prevPage });
    });
}

module.exports = router;