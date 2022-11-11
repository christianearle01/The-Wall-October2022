const Bcrypt = require('bcrypt');
const CryptoJS = require('crypto-js');
const Moment = require('moment');

const { SESSION_SECRET, SESSION_SALT } = require('../config/constants');

let GlobalHelper = {};

/* Field Validations if the required fields are not empty */
GlobalHelper.validateFields = (field_data, required_fields) => {
    let response_data = { status: false, result: {}, error: null };

    let sanitized_fields = {};
    let missing_fields = [];

    for(let key of required_fields){
        if(field_data?.[key]){
            sanitized_fields[key] = field_data[key];
        }
        else{
            missing_fields.push(key);
        }
    }

    response_data.status = !missing_fields.length;
    response_data.result = response_data.status ? {sanitized_fields} : {missing_fields};
    response_data.message = response_data.status ? '' : `Missing Fields: ${missing_fields.join(', ')}`;

    return response_data
}

/* Email validation for valid email address format */
GlobalHelper.emailValidation = (email_address) => {
    let email_format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return email_address.match(email_format);
}

/* Use bcrypt to encrypt the user's password upon registration */
GlobalHelper.passwordEncryption = (password) => {
    return Bcrypt.hashSync(password, 2);
}

/* Use bcrypt to check if the credentials entered by user are valid/existing */
GlobalHelper.passwordIsValid = (password, hash_password) => {
    return Bcrypt.compareSync(password, hash_password);
}

/* To encrypt the user's session */
GlobalHelper.sessionEncryption = (data) => {
    return CryptoJS.AES.encrypt(data, SESSION_SALT).toString();
}

/* To decrypt the encrypted user's session */
GlobalHelper.sessionDecryption = (encrypted_data) => {
    let bytes  = CryptoJS.AES.decrypt(encrypted_data, SESSION_SALT);
    
    return bytes.toString(CryptoJS.enc.Utf8);
}

/* To prepare the html partial to pass on client side */
GlobalHelper.prepareHtmlPartial = (params, is_message_partial = true) => {
    let prepare_html_partial = '';

    if(is_message_partial){
        prepare_html_partial = 
            `<div data-message-id="${params.insertId}">
            <a href="/api/messages/delete/${params.insertId}" class="message_delete">X</a>
            <p>${params.name}(${Moment(params.date_now).format('YYYY-MM-DD hh:mm:ss a')})</p>
            <p>${params.content}</p>
    
            <header id="comment_header">Comments: </header>
    
            <form class="comment_form" action="/api/comments/post_comment/${params.insertId}" method="post">
                <input type="hidden" name="message_id" value="${params.insertId}">
                <textarea name="content"></textarea>
                <input type="submit" value="Post a Comment">
            </form>
        </div>`;
    }
    else{
        prepare_html_partial = 
            `<div data-comment-id="">
                <a href="/api/comments/delete/${params.insertId}" class="comment_delete">X</a>
                <p>${params.name}(${Moment(params.date_now).format('YYYY-MM-DD hh:mm:ss a')})</p>
                <p>${params.content}</p>
            </div>`;
    }

    return prepare_html_partial;
}

module.exports = GlobalHelper;