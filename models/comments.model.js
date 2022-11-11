const { response } = require('express');
const Mysql = require('mysql');
const { prepareHtmlPartial } = require('../helpers/index.helper');

const DatabaseModel = require('./database.model');

class CommentsModel extends DatabaseModel {
    constructor(){
        super();
    }

    /* Function to post a comment */
    postComment = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let date_now = new Date();

            let post_comment_query = Mysql.format(
                'INSERT INTO comments (user_id, message_id, content, created_at, updated_at) VALUES(?, ? ,?, ?, ?)',
                [params.user_id, params.message_id, params.content, date_now, date_now]
            );

            let post_comment_response = await this.executeQuery(post_comment_query);
            let insertId = post_comment_response?.result?.insertId;

            if(post_comment_response.status && insertId){
                response_data.status = true
                response_data.result = prepareHtmlPartial({...params, date_now, insertId}, false);
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed in posting a message.";
        }

        return response_data;
    }

    /* Function to fetch the comments or a specific comment data */
    fetchComments = async (params = null) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let fetch_comment_query = '';

            if(!params){
                fetch_comment_query = Mysql.format(
                    `SELECT JSON_OBJECTAGG(message_id, comments_data) AS comments_data
                    FROM (
                        SELECT ANY_VALUE(comments.message_id) AS message_id, 
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', comments.id, 
                                    'user_id', comments.user_id, 
                                    'content', comments.content, 
                                    'created_at', comments.created_at, 
                                    'name', CONCAT(users.first_name, ' ', last_name)
                                )
                            ) AS comments_data
                        FROM comments
                        INNER JOIN users
                            ON users.id = comments.user_id
                        GROUP BY comments.message_id
                    ) AS derived_comments_table;`
                );
                
            }
            else{
                fetch_comment_query = Mysql.format(
                    'SELECT * FROM comments WHERE id = ? AND user_id',
                    [params.comment_id, params.user_id]
                )
            }

            response_data = await this.executeQuery(fetch_comment_query);
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Failed in fetching comments.";
        }

        return response_data;
    }

    /* Function to delete a comment */
    deleteComment = async (params) => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let { result: [fetch_comment_data] } = await this.fetchComments(params);

            if(parseInt(params.user_id) === fetch_comment_data.user_id){
                let delete_comment_query = Mysql.format(`DELETE FROM comments WHERE id = ? AND user_id = ?`, [params.comment_id, params.user_id]);
                response_data = await this.executeQuery(delete_comment_query);
            }
            else{
                response_data.message = 'Unauthorized comment deletion are block to non author!';
            }

        }
        catch(error){
            response_data.error = error;
            response_data.message = 'Failed in deleting a message';
        }

        return response_data;
    }
}

module.exports = CommentsModel;