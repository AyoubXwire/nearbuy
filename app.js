const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Set environment variables
const envir = require('./config/envir');

// Connect to database
mongoose.connect(envir.db, {
    useNewUrlParser: true,
    useCreateIndex: true
});

// Config/Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Load routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/shops', require('./routes/shops'));

// Listener
app.listen(envir.port, () => {
    console.log('listening on port 3000..');
});