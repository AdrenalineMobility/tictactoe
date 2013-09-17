$(document).ready(function() {
    $("#login-form").submit(function(event) {
        var username = $("#username-input").val();
        var passwd = $("#password-input").val();

        adrenaline.user.signUp(username, passwd).done(function() {
            adrenaline.user.saveCurrentUserToDisk();
            window.location.href = "tictactoe.html";
        }).fail(function(err) {
            console.log("could not sign up: " + err);
        });
        return false;
    });
});
