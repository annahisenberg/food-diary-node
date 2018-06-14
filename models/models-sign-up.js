'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


const signUpSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});


const signUpSchema = mongoose.model('SignUp', signUpSchema);


module.exports = {
    signUpSchema
};