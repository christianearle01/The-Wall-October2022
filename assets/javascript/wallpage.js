$(document).ready(() =>{
    const requestData = (element, callback) => {
        $.post($(element).attr('action'), $(element).serialize(), (response_data) =>{
            callback(response_data);
            return false;
        });
    };

    const deleteRequest = (element, callback) => {
        $.post($(element).attr('href'), (response_data) =>{
            callback(response_data);
            return false;
        });
    };

    $(document).on('submit', '#message_form', function(){
        requestData(this, (response_data) => {
            if(response_data.status){
                $(response_data.result).insertAfter($(this).siblings('div').children('#message_header'));
            }
            else{
                alert(response_data.message);
            }
        });

        return false;
    });

    $(document).on('submit', '.comment_form', function(){
        requestData(this, (response_data) => {
            if(response_data.status){
                $(response_data.result).insertBefore($(this));
            }
            else{
                alert(response_data.message);
            }
        });

        return false;
    });

    $(document).on('click', '.comment_delete', function(){
        deleteRequest(this, (response_data) => {
            if(response_data.status){
                $(this).parent().remove();
            }
            else{
                alert(response_data.message);
            }
        });

        return false;
    });

    $(document).on('click', '.message_delete', function(){
        deleteRequest(this, (response_data) => {
            if(response_data.status){
                $(this).parent().remove();
            }
            else{
                alert(response_data.message);
            }
        });

        return false;
    });
});