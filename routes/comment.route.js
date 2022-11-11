const { Router } = require('express');

const CommentController = require('../controllers/comment.controller');

const CommentRoute = Router();

/* Route to post a comment */
CommentRoute.post('/post_comment/:comment_id', (req, res, next) => {
    new CommentController(req, res).postComment();
});

/* Route to delete a comment */
CommentRoute.post('/delete/:comment_id', (req, res, next) => {
    new CommentController(req, res).deleteComment();
});

module.exports = CommentRoute;