const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongooose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongooose);
//This is going to add a field of hash password,salt value and username to our schema
//It also add that username is unique

module.exports = mongoose.model('User', UserSchema);