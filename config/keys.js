if(process.env.NODE_ENV === 'production') {
    module.exports = {
        port: process.env.PORT,
        secret: process.env.SECRET,
        mongoURI: process.env.MONGO_URI
    }
} else {
    module.exports = {
        port: 3000,
        secret: 'cosmic secret',
        mongoURI: 'mongodb://localhost:27017/nearbuy'
    }
}
