const Mysql = require('mysql');

const { prepareHtmlPartial } = require('../helpers/index.helper')

const DatabaseModel = require('./database.model');

class MessagesModel extends DatabaseModel {
    constructor(){
        super();
    }

    /* Function to post a message */
    postMessage = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let date_now = new Date();

            let post_message_query = Mysql.format(
                'INSERT INTO messages (user_id, content, created_at, updated_at) VALUES(?, ?, ?, ?)',
                [params.user_id, params.content, date_now, date_now]
            );

            let post_message_response = await this.executeQuery(post_message_query);
            let insertId = post_message_response?.result?.insertId;

            if(post_message_response.status && insertId){
                response_data.status = true
                response_data.result = prepareHtmlPartial({...params, date_now, insertId});
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed in posting a message.";
        }

        return response_data;
    }

    /* Function to fetch a messages or a specific message data */
    fetchMessages = async (params = null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_message_query = '';

            if(!params){
                fetch_message_query = Mysql.format(
                    `SELECT messages.id, messages.user_id, messages.content, messages.created_at, CONCAT(users.first_name, ' ', users.last_name) AS name
                    FROM messages
                    INNER JOIN users
                        ON users.id = messages.user_id
                    ORDER BY messages.id DESC;`
                );
            }
            else{
                fetch_message_query = Mysql.format(
                    `SELECT * FROM messages WHERE id = ? AND user_id = ?`, 
                    [params.message_id, params.user_id]
                );
            }

            response_data = await this.executeQuery(fetch_message_query);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed in fetching messages.";
        }

        return response_data;
    }

    /* Function to delete a message */
    deleteMessage = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { result: [fetch_message_data] } = await this.fetchMessages(params);

            if(parseInt(params.user_id) === fetch_message_data.user_id){
                let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE message_id = ?`, [params.message_id]);
                await this.executeQuery(delete_comment_query);

                let delete_message_query = Mysql.format(`DELETE FROM messages WHERE id = ? AND user_id = ?`, [params.message_id, params.user_id]);
                response_data = await this.executeQuery(delete_message_query);
            }
            else{
                response_data.message = 'Unauthorized message deletion are block to non author!';
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed in deleting a message';
        }

        return response_data;
    }
}

module.exports = MessagesModel;