'use strict';
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const diaryPostSchema = mongoose.Schema({
    title: String,
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String,
    notes: String,
    img: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

const DiaryPost = mongoose.model('DiaryPost', diaryPostSchema);

module.exports = DiaryPost;