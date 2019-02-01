module.exports = {
    port: process.env.PORT || 3000,
    db: process.env.NODE_ENV === 'production' ? 
    'mongodb://benayoubid:benayoubid101@ds235181.mlab.com:35181/nearbuy' : 'mongodb://localhost:27017/nearbuy'
}