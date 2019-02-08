const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

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

ShopSchema.plugin(mongoosePaginate);

const Shop = mongoose.model('Shop', ShopSchema);

module.exports = Shop;