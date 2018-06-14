'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const diaryPostSchema = mongoose.Schema({
    Breakfast: String,
    Lunch: String,
    Dinner: String,
    Snacks: String,
    Date: Date,
    Calories: Number
});

const signUpSchema = mongoose.Schema({
    Username: {
        type: String,
        required: true,
        unique: true
    },
    Password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
});


const diaryPost = mongoose.model('DiaryPost', diaryPostSchema);
const signUpSchema = mongoose.model('SignUp', signUpSchema);


module.exports = {
    diaryPost,
    signUpSchema
};