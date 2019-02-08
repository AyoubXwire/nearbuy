const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');

const app = express();

// Set environment variables
const keys = require('./config/keys');
let store;

// Connect to database
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true
});

// Config/Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(flash());

// Set session store
if(process.env.NODE_ENV === 'production') {
    store = new MongoDBStore({
        uri: keys.mongoURI,
        databaseName: 'nearbuy',
        collection: 'sessions'
    });
} else {
    store = new session.MemoryStore();
}

// Passport
app.use(session({
    secret: keys.secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // One day
}));

app.use(passport.initialize());
app.use(passport.session());

// Global variables
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Load routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/shops', require('./routes/shops'));

// Listener
app.listen(keys.port, () => {
    console.log(`listening on port ${keys.port}`);
});