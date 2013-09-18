$(document).ready(function() {
    $("#login-form").submit(function(event) {
        var username = $("#username-input").val();
        var passwd = $("#password-input").val();
        event.stopPropagation();

        localStorage.clear();
        adrenaline.user.logIn(username, passwd).done(function() {
            console.log("logged in.");
            adrenaline.user.saveCurrentUserToDisk();
            window.location.href = "tictactoe.html";
        }).fail(function(err) {
            console.log("could not sign up: " + err);
        });
        return false;
    });

    $("#signup-button").click(function(event) {
        if (!$("#username-input")[0].checkValidity() ||
            !$("#password-input")[0].checkValidity()) {
            $("#login-button").click();
            return false;
        }


        var username = $("#username-input").val();
        var passwd = $("#password-input").val();

        localStorage.clear();
        adrenaline.user.signUp(username, passwd).done(function() {
            adrenaline.user.saveCurrentUserToDisk();
            window.location.href = "tictactoe.html";
        }).fail(function(err) {
            console.log("could not sign up: " + err);
        });
        return false;
    });

});
