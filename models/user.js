const mongoose = require('mongoose');
const schema = mongoose.Schema;

const UserSchema = new schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
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

const User = mongoose.model('User', UserSchema);

module.exports = User;