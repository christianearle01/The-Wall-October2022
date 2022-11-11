
const UserRoute = require('./user.route');
const MessageRoute = require('./message.route');
const CommentRoute = require('./comment.route');

const MessageController = require('../controllers/message.controller');

let APIRoute = (App) => {
    /* Routes to Homepage */
    App.use('/', UserRoute);

    /* Routes for logout */
    App.use('/logout', UserRoute);

    /* Routes for users feature or function */
    App.use('/api/users', UserRoute);

    /* Routes for messages feature or function */
    App.use('/api/messages', MessageRoute);

    /* Routes for comments feature or function */
    App.use('/api/comments', CommentRoute);

    /* Route to wall page */
    App.get('/wall', (req, res, next) => {
        new MessageController(req, res).wallpage();
    });
}

module.exports = APIRoute;