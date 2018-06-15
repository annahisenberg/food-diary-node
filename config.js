'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/food_diary_db';
exports.PORT = process.env.PORT || 8080;