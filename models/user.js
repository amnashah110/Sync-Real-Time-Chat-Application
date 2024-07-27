const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    githubId: {
        type: String,
        unique: true,
        sparse: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;