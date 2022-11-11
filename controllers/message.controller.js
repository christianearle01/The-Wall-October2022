
const { validateFields } = require('../helpers/index.helper');
const MessagesModel = require('../models/messages.model');
const CommentsModel = require('../models/comments.model');

class MessageController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;

        if(!this.#req.session?.user_id){
            this.#req.session.destroy();
            this.#res.redirect('/');
        }
    }

    /* Function to visit and load the Wall Page */
    wallpage = async () => {
        let messagesModel = new MessagesModel();
        let { result: messages } = await messagesModel.fetchMessages();

        let commentsModel = new CommentsModel();
        let { result: [{comments_data: comments}] } = await commentsModel.fetchComments();
        comments = JSON.parse(comments || '{}');


        this.#res.render('layouts/wallpage', { first_name: this.#req.session?.first_name, current_user_id: this.#req.session.user_id , messages, comments });
    }

    /* Function to post a message */
    postMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.body, ['content']);
            
            if(validate_fields.status){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.postMessage({ user_id: this.#req.session.user_id, content: validate_fields.result.sanitized_fields.content, name: this.#req.session.name });
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered error in posting a message."
        }

        this.#res.json(response_data);
    }

    /* Function to delete a message */
    deleteMessage = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.params, ['message_id']);
            
            if(validate_fields.status){
                let messagesModel = new MessagesModel();
                response_data = await messagesModel.deleteMessage({ user_id: this.#req.session.user_id, message_id: validate_fields.result.sanitized_fields.message_id, name: this.#req.session.name });
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered error in deleting a message."
        }

        this.#res.json(response_data);
    }

}

module.exports = MessageController;