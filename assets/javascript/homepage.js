$(document).ready(() =>{
    const requestData = (element, callback) => {
        $.post($(element).attr('action'), $(element).serialize(), (response_data) =>{
            callback(response_data);
            return false;
        });
    };

    $(document).on('submit', '#login_form', function(){
        requestData(this, (response_data) => {
            if(response_data.status){
                window.location.href = "/wall";
            }
            else{
                alert(response_data.message);
            }
        });

        return false;
    });

    $(document).on('submit', '#register_form', function(){
        requestData(this, (response_data) => {
            if(!response_data.status){
                alert(response_data.message);
            }
        });

        return false;
    });
});