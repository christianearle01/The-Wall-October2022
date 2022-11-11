const { validateFields } = require('../helpers/index.helper');

const CommentsModel = require('../models/comments.model');

class CommentController {
    #req;
    #res;
    
    constructor(req, res){
        this.#req = req;
        this.#res = res;

        /* Check if the user is not login */
        if(!this.#req.session?.user_id){
            this.#req.session.destroy();
            this.#res.redirect('/');
        }
    }
    
    /* Function to post comment */
    postComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields({ ...this.#req.body, ...this.#req.params }, ['message_id', 'content']);
            
            if(validate_fields.status){
                let commentsModel = new CommentsModel();
                response_data = await commentsModel.postComment({ user_id: this.#req.session.user_id, ...validate_fields.result.sanitized_fields, name: this.#req.session.name });
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered error in posting a comment."
        }

            this.#res.json(response_data);
    }

    /* Function to delete comment */
    deleteComment = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.params, ['comment_id']);
            
            if(validate_fields.status){
                let commentsModel = new CommentsModel();
                response_data = await commentsModel.deleteComment({ user_id: this.#req.session.user_id, comment_id: validate_fields.result.sanitized_fields.comment_id });
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered error in deleting a comment."
        }

        this.#res.json(response_data);
    }
}

module.exports = CommentController;