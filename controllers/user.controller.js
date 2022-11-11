
const { validateFields, sessionEncryption, emailValidation } = require('../helpers/index.helper');

const UsersModel = require('../models/users.model');

class UserController {
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    /* Function to to visit and load the homepage */
    homepage = () => {
        if(this.#req.session?.user_id){
            this.#res.redirect('/wall')
        }
        else{
            this.#res.render('layouts/homepage');
        }
    }

    /* Function to login as a user */
    loginUser = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.body, ['email_address', 'password']);

            if(validate_fields.status){
                if(emailValidation(validate_fields.result.sanitized_fields.email_address)){
                    let usersModel = new UsersModel();
                    response_data = await usersModel.loginUser(validate_fields.result.sanitized_fields);

                    if(response_data.status){
                        let user_data = response_data.result;
                        this.#req.session.user_id = user_data.id;
                        this.#req.session.first_name = user_data.first_name;
                        this.#req.session.name = user_data.name;
                        this.#req.session.date_time = user_data.created_at.toString();
                    }
                }
                else{
                    response_data.message = "Invalid email address format!"
                }
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error upon login."
        }

        this.#res.json(response_data);
    }

    /* Function to register a user */
    registerUser = async () => {
        let response_data = { status: false, result: {}, error: null };

        try{
            let validate_fields = validateFields(this.#req.body, ['first_name', 'last_name', 'email_address', 'password']);

            if(validate_fields.status){
                let email_address = validate_fields.result.sanitized_fields.email_address;

                if(emailValidation(email_address)){
                    let usersModel = new UsersModel();
                    let {result: [existing_email]} = await usersModel.fetchUserByEmail(email_address, "id, email_address");

                    if(!existing_email?.email_address){
                        response_data = await usersModel.registerUser(validate_fields.result.sanitized_fields);
                    }
                    else{
                        response_data.message = "Email address already taken!";
                    }
                }
                else{
                    response_data.message = "Invalid email address format!"
                }
            }
            else{
                response_data = validate_fields;
            }
        }
        catch(error){
            response_data.error = error;
            response_data.message = "Encountered an error upon register."
        }

        this.#res.json(response_data);
    }

    /* Function to logout a user */
    logoutUser = () => {
        this.#req.session.destroy();
        this.#res.redirect('/');
    }
}

module.exports = UserController;