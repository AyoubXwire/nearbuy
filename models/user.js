const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const schema = mongoose.Schema;

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

const User = mongoose.model('User', UserSchema);

module.exports = User;