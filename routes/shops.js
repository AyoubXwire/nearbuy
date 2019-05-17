const express = require('express')
const router = express.Router()

const {ensureAuth} = require('../helpers/auth')
const { paginate, sortByDistance } = require('../helpers/functions')

const Shop = require('../models/shop')

router.get('/nearby', ensureAuth, (req, res) => {
    const location = {
        latitude: req.cookies.latitude,
        longitude: req.cookies.longitude
    }
    const query = { 
        $and: [
            { _id: { $nin: req.user.liked }},
            { _id: { $nin: req.user.disliked }}
        ]
    }
    
    Shop.find(query)
    .then(result => {
        // sort by distance from user if location available in cookies
        if(location.latitude != null && location.longitude != null) {
            result.sort(sortByDistance(location))
        }
        // Paginate the results
        paginate(result, req.query.page || 1, 24)
        .then(data => res.render('nearby', {data: data, url: req.url}))
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

router.get('/preferred', ensureAuth, (req, res) => {
    const query = { _id: { $in: req.user.liked }}

    Shop.find(query)
    .then(data => res.render('preferred', {data: data, url: req.url}))
    .catch(err => console.log(err))
})

router.get('/:shop/like', ensureAuth, (req, res) => {
    req.user.like(req.params.shop)
    req.flash('success', 'Added to preferred shops')
    res.redirect('/shops/nearby')
})

router.get('/:shop/dislike', ensureAuth, (req, res) => {
    req.user.dislike(req.params.shop)
    req.flash('success', 'Added to disliked shops, it will be shown back again within nearby shops in two hours')
    res.redirect('/shops/nearby')
})

router.get('/:shop/remove', ensureAuth, (req, res) => {
    req.user.removeLiked(req.params.shop)
    req.flash('success', 'Removed from preffered shops')
    res.redirect('/shops/preferred')
})

module.exports = router