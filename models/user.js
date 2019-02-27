const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

const dislikeTimeout = 1000 * 60 * 60 * 2; // 2 hours

const UserSchema = new schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'cannot be blank']
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: [true, 'cannot be blank']
    },
    liked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        }
    ],
    disliked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Shop'
        }
    ],
    hash: String,
    salt: String
});

UserSchema.plugin(passportLocalMongoose, {usernameField: 'username'});

// Add a shop to preferred shops
UserSchema.methods.like = function(shop) {
    if(this.liked.indexOf(shop) === -1) {
        this.liked.push(shop);
        return this.save();
    }
}

// Remove a shope from the preferred shops
UserSchema.methods.removeLiked = function(shop) {
    if(this.liked.indexOf(shop) !== -1) {
        this.liked.remove(shop);
        return this.save();
    }
}

// Dislike a shop, so it will get a timeout before getting removed from the disliked shops
UserSchema.methods.dislike = function(shop) {
    if(this.disliked.indexOf(shop) === -1) {
        this.disliked.push(shop);

        // Set the timeout
        setTimeout(() => {
            this.disliked.remove(shop);
            this.save();
        }, dislikeTimeout);
        return this.save();
    }
}

// Override MongoDB duplicate key errors
UserSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next(new Error('A user with the given email is already registered'));
    } else {
        next(error);
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;