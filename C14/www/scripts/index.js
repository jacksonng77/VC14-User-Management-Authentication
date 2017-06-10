(function () {
    "use strict";

    var userid;
    var password;

    $(document).ready(function () {

        $("#LoginForm").validate({
            messages: {
                txtLogin: "User ID is required",
                txtPassword: "Password is required",
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            },
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnLogin").bind("click", function () {
            if ($("#LoginForm").valid()) {
                login();
            }
        });

        $("#btnNewUser").bind("click", function () {
            window.location = "newuser.html";
        });

    }); 

    function login() {
        var url = serverURL() + "/login.php";
        var result;
        userid = $("#txtLogin").val();
        password = $("#txtPassword").val();

        var JSONObject = {
            "userid": userid,
            "password": password
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _getLoginResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _getLoginResult(arr) {
        if (arr[0].result.trim() !== "0") {
            localStorage.setItem("userid", userid);
            localStorage.setItem("password", password);
            validationMsgs("Login OK", "Information", "OK");
        }
        else {
            validationMsgs("Error in Username or Password", "Validation", "Try Again");
        }
    }
} )();