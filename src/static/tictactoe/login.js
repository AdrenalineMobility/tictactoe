$(document).ready(function() {
    if (adrenaline.user.currentUser()) {
        window.location.href = "tictactoe.html";
        return;
    }

    $("#login-form").submit(function(event) {
        event.stopPropagation();
        var username = $("#username-input").val();
        var passwd = $("#password-input").val();
        var remember = $("#remember").is(':checked');

        $(".loading").show();
        adrenaline.user.logIn(username, passwd).done(function() {
            adrenaline.user.saveCurrentUserToDisk();
            window.location.href = "tictactoe.html";
        }).fail(function(err) {
            console.log("could not login: " + err);
            $(".loading").hide();
        });
        return false;
    });

    $("#signup-button").click(function(event) {
        event.stopPropagation();
        if (!$("#username-input")[0].checkValidity() ||
            !$("#password-input")[0].checkValidity()) {
            $("#login-button").click();
            return false;
        }

        var username = $("#username-input").val();
        var passwd = $("#password-input").val();
        var remember = $("#remember").is(':checked');

        $(".loading").show();
        adrenaline.user.signUp(username, passwd).done(function() {
            adrenaline.user.saveCurrentUserToDisk();
            window.location.href = "tictactoe.html";
        }).fail(function(err) {
            $(".loading").hide();
            console.log("could not sign up: " + err);
        });
        return false;
    });

});
