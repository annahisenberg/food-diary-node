'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const diaryPostSchema = mongoose.Schema({
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String,
    created: Date,
    calories: Number
});

const diaryPost = mongoose.model('DiaryPost', diaryPostSchema);


module.exports = {
    diaryPost
};