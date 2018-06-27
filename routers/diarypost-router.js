'use strict'

const express = require('express');
const DiaryPost = require('../models/diarypost-model');
const router = express.Router();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', { session: false });

//Once user's token expires and they need a new one, do this:
router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({ authToken });
});

//Gets all posts
router.route('/posts')
    .get(jwtAuth, (req, res) => {
        DiaryPost.find()
            .then((posts) => {
                res.json(posts);
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    error: 'something went wrong'
                });
            });
    })

// Make diary post 
.post(jwtAuth, (req, res) => {
    const payload = {
        breakfast: req.body.breakfast,
        lunch: req.body.lunch,
        dinner: req.body.dinner,
        snacks: req.body.snacks,
        // timestamps: req.body.date_input,
        calories: req.body.calories,
        img: req.body.img
    };
    DiaryPost.create(payload)
        .then((post) => res.status(201).json(post))
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                error: 'Something went wrong'
            });
        });
});




// PUT routes
router.route('/posts/:id')
    .get(jwtAuth, (req, res) => {
        DiaryPost.findById(req.params.id)
            .then((post) => res.json(post))
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    error: 'something went wrong'
                });
            });
    })
    //Update post with specific ID
    .put(jwtAuth, (req, res) => {
        console.log(req.params.id, req.body.id);

        if (!(req.params.id && req.body._id && req.params.id === req.body._id)) {
            return res.status(400).json({
                error: 'Request path id and request body id values must match'
            });
        }

        const updated = {};
        const updateableFields = [
            'breakfast',
            'lunch',
            'dinner',
            'snacks',
            'timestamps',
            'calories',
            'img'
        ];
        updateableFields.forEach((field) => {
            if (field in req.body) {
                updated[field] = req.body[field];
            }
        });

        DiaryPost
            .findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
            .then((updatedPost) => {
                res.status(200).json({
                    message: 'You successfully updated your post.'
                });
            })
            .catch((err) => {
                res.status(500).json({
                    message: 'There is an error with updating your post.'
                });
            });
    })

.delete(jwtAuth, (req, res) => {
    DiaryPost
        .findByIdAndRemove(req.params.id).then(() => {
            console.log(`Deleted diary entry with id \`${req.params.id}\``);
            return res.status(200).json({
                message: 'Your entry was successfully deleted',
                post: req.params.id
            });
        });
});


module.exports = { router };