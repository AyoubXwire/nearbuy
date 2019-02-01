const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ShopSchema = new schema({
    picture: String,
    name: String,
    email: String,
    city: String,
    location: {
        type: String,
        coordinates: [Number, Number]
    }
});

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;