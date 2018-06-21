'use strict'

const express = require('express');
const DiaryPost = require('../models/diarypost-model');
const router = express.Router();
const { verifyToken } = require('../server');

console.log("verifyToken:", verifyToken);

//Gets all posts
router.route('/posts')
    .get(verifyToken, (req, res) => {
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
.post(verifyToken, (req, res) => {
    jwt.verify(req.token, process.env.SECRET, (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            // res.json({
            //     message: 'Post created',
            //     authData
            // })
            const payload = {
                breakfast: req.body.breakfast_input,
                lunch: req.body.lunch_input,
                dinner: req.body.dinner_input,
                snacks: req.body.snacks_input,
                // timestamps: req.body.date_input,
                calories: req.body.calories_input,
                img: req.body.pic
            };
            DiaryPost.create(payload)
                .then((post) => res.status(201).json(post))
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({
                        error: 'Something went wrong'
                    });
                });
        }
    });
});


//gets specific diary post by id
router.route('/posts/:id')
    .get(verifyToken, (req, res) => {
        DiaryPost.findById(req.params.id)
            .then((post) => res.json(post))
            .catch((err) => {
                console.error(err);
                res.status(500).json({
                    error: 'something went wrong'
                });
            });
    });



// PUT routes
router.route('/posts/:id')

//Get post with specific ID
.get(verifyToken, (req, res) => {
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
.put(verifyToken, (req, res) => {
            if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
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

            DiaryPost.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
                .then((updatedPost) => {
                        res.status(200).json({
                            message: 'You successfully updated your post.'
                        });
                    }
                    .catch((err) => {
                        res.status(500).json({
                            message: 'There is an error with updating your post.'
                        });
                    });

                });

        // DElETE routes
        router.route('/entries/:id')
        .delete(verifyToken, (req, res) => {
            DiaryPost.findByIdAndRemove(req.params.id).then(() => {
                console.log(`Deleted diary entry with id \`${req.params.id}\``);
                return res.status(200).json({
                    message: 'Your entry was successfully deleted',
                    post: req.params.id
                });
            });
        });


        module.exports = { router };