'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const diaryPostSchema = mongoose.Schema({
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String,
    timestamps: true,
    calories: Number,
    img: {
        data: Buffer,
        contentType: String
    }
});

const DiaryPost = mongoose.model('DiaryPost', diaryPostSchema);


module.exports = DiaryPost;