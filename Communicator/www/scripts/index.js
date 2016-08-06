

SERVER = "http://psoap.atlantistelecom.net/android/ajax.php";
iAccount = null;
number = null;

function onPause() {
    // TODO: This application has been suspended. Save application state here.
};

function onResume() {
    // TODO: This application has been reactivated. Restore application state here.
};

function init() {
}
//***************************
function clearUser() {
    number = null;
    iAccount = null;
}

//************** AJAX functions
function getChatsList() {
    $.ajax({
        type: "get",
        url: SERVER,
        dataType: "json",
        data: {
            functionName: "get_messages_stat",
            number: number
        },
        success: function (data) {
            console.log(data);

            data.forEach(function (dataItem, i, arr) {

                var li = $("<li />", {
                    'class': 'chart_list_item',
                    "data-id": dataItem.ID
                });

                li.load("res/layout/chatListItem.xml", function (responseText, extStatus, jqXHR) {
                    var item = $(this);
                    item.find(".contact_number").text(dataItem.ID);
                    item.find(".unreaded_cnt").text(dataItem.UNVIEWED);
                    item.find(".message_body").text(dataItem.BODY);
                    item.find(".messagege_date").text(dataItem.ISSUE_DATE);
                 });

                $("#lv_chats").append(li);
            });

        }
    })
    return true;
}
function getMessagesList( numberB) {
    $.ajax({
        type: "get",
        url: SERVER,
        dataType: "json",
        data: {
            functionName: "get_message_list",
            numberA: number,
            numberB: numberB
        },
        success: function (data) {
            console.log(data);
            data.forEach(function (dataItem, i, arr) {
                var li = $("<li />", {
                    'class': 'message_list_item',
                    'data-i_message': dataItem.I_MESSAGE
                });
                li.load("items.html #msg_from", function (responseText, extStatus, jqXHR) {
                    var item = $(this);
                    item.find(".message_date").text(dataItem.ISSUE_DATE);
                    item.find(".message_body").text(dataItem.BODY);
                    item.find(".message_time").text( date2Time(dataItem.ISSUE_DATE) );
                });
                $("#lv_messages").append(li);

            })
        }
    });
    return true;
}
//*************************************************
function date2Time(mySqlDateStr) {
    mydate = new Date(mySqlDateStr);
    return mydate.format("G:i");
}

(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        init();

    };

    $('#loginForm').validate({
        rules: {
            phoneNumbe: {
                required: true,
                digits: true,
                rangelength: [6, 6]
            },
            userPassword: {
                required: true
            }
        },
        messages: {
            phoneNumbe: {
                required: "Please enter phone number."
            },
            userPassword: {
                required: "Please enter password."
            }
        },
        errorPlacement: function (error, element) {
            error.appendTo(element.parent().prev());
        },
        submitHandler: function (form) {
            number = "380894" + $("#phoneNumbe").val()
            $.ajax({
                type: "get",
                url: SERVER,
                dataType: "json",
                data: {
                    functionName: "login",
                    number: number,
                    password: $("#userPassword").val()
                },
                success: function (data) {
                    console.log(data);
                    if(data.result && (data.result == true)) {
                        $(':mobile-pagecontainer').pagecontainer('change', '#chatsPage', { reload: false });
                        if (data.i_account) {
                            iAccount = data.i_account;
                        }
                        getChatsList();
                    } else {
                        alert("Wrong password");
                        clearUser ();
                    }
                }
            })
            return false;
        }
    });

    $('#cbShowpass').on("click", function () {
        $("#userPassword").attr("type",  $(this).is(':checked') ? "text" : "password" );
    });
    
    $("#lv_chats").on("click", ".chart_list_item", function (event) {
        var numberB = $(this).attr("data-id");
        console.log(numberB);
        getMessagesList(numberB);
        $(':mobile-pagecontainer').pagecontainer('change', '#messagesPage', { reload: false });

    });

})();
