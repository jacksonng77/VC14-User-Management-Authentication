(function () {

    var imgNewUserPictureName = "";
    var userid;
    var password;
    var passwordagain;
    var description;
    var email;

    $(document).ready(function () {
        $("#NewUserForm").validate({
            rules: {
                txtNewEmail: {
                    email: true,
                },
                txtNewPasswordAgain: {
                    equalTo: "#txtNewPassword"
                }
            },
            messages: {
                txtNewName: "new user name is required",
                txtNewEmail: "new email address is required and must be of the format a@b.c",
                txtNewPassword: "new password is required",
                txtNewPasswordAgain: "new password again is required and must be the same as new password",
            },
            focusInvalid: false,
            submitHandler: function () {
                return false;
            }, 
            errorPlacement: function (error, element) {
                error.appendTo(element.parent().parent().after());
            },
        });

        $("#btnSelectImg").bind("click", function () {
            capturePhoto();
        });

        $("#btnCreateAccount").bind("click", function () {
            savenewuser();
        });
    }); 


    //Image Section
    function capturePhoto() {
        var source = navigator.camera.PictureSourceType.PHOTOLIBRARY;
        navigator.camera.getPicture(_onPhotoURISuccess, _failCapture, { quality: 50, destinationType: navigator.camera.DestinationType.FILE_URI, sourceType: source });
    }

    function _failUpload(error) {
        validationMsgs("Error:" + error.code, "Upload Error", "Try Again");
    }

    function _failCapture(message) {
        validationMsgs("Error:" + message, "Image Error", "Try Again");
    }

    function _onPhotoURISuccess(imageURI) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = new Object();
        params.value1 = "test";
        params.value2 = "param";
        options.params = params;
        options.chunkedMode = false;
        options.headers = { Connection: "close" };
        var ft = new FileTransfer();
        ft.upload(imageURI, serverURL() + "/upload.php", _winUpload, _failUpload, options);
    }

    function _winUpload(r) {
        if (imgNewUserPictureName !== "") {
            _deleteOldImg(imgNewUserPictureName);
        }
        var arr = JSON.parse(r.response);
        imgNewUserPictureName = arr[0].result;
        $("#imgNewUser").attr("src", serverURL() + "/images/" + imgNewUserPictureName + "_s");
    }

    function _deleteOldImg(oldImg) {
        var url = serverURL() + "/deleteimg.php";

        var JSONObject = {
            "imgfile": oldImg
        };

        $.ajax({
            url: url,
            type: 'GET',
            data: JSONObject,
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            success: function (arr) {
                _deleteImgResult(arr);
            },
            error: function () {
                validationMsg();
            }
        });
    }

    function _deleteImgResult(arr) {
        if (arr[0].result !== "1") {
            validationMsgs("Error deleteing old image", "Upload Error", "Try Again");
        }
    }


    //New User Saving Section
    function savenewuser() {
        if ($("#NewUserForm").valid()) {
            var profileimage = imgNewUserPictureName;

            userid = $("#txtNewName").val();
            email = $("#txtNewEmail").val();
            password = $("#txtNewPassword").val();
            passwordagain = $("#txtNewPasswordAgain").val();
            description = $("#txtNewDescription").val();

            if (_validate()) {
                var url = serverURL() + "/newuser.php";

                var JSONObject = {
                    "userid": userid,
                    "password": password,
                    "email": email,
                    "description": description,
                    "profileimage": profileimage
                };

                $.ajax({
                    url: url,
                    type: 'GET',
                    data: JSONObject,
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    success: function (arr) {
                        _getNewUserResult(arr);
                    },
                    error: function () {
                        validationMsg();
                    }
                });
            }
        }
    }

    function _validate() {
        var validate = true;

        if (imgNewUserPictureName === "") {
            validationMsgs("Select a photo", "Validation", "OK");
            validate = false;
        }
        return validate;
    }

    function _getNewUserResult(arr) {
        if (arr[0].result === 1) {
            localStorage.setItem("userid", userid);
            localStorage.setItem("password", password);
            //window.plugins.OneSignal.sendTag("email", email);
            validationMsgs("New User created", "Validation", "OK");
            //window.location = "me.html";
        }
        else {
            validationMsgs("User ID already exist", "Validation", "OK");
        }
    }
})();