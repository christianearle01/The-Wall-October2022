const { Router } = require('express');

const MessageController = require('../controllers/message.controller');

const MessageRoute = Router();

/* Route to post a message */
MessageRoute.post('/post_message', (req, res, next) => {
    new MessageController(req, res).postMessage();
});

/* Route to delete a message */
MessageRoute.post('/delete/:message_id', (req, res, next) => {
    new MessageController(req, res).deleteMessage();
});

module.exports = MessageRoute;