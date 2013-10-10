$(document).ready(function() {
    var myMark;
    var isMyMove;
    var board;
    var connected = false;

    $("#invite-button").click(function(event) {
        console.log("invite clicked");
        event.preventDefault();
        if (connected) {
            //window.location.reload();
            //return;
        }

        var friendId = $("#friend-input").val();
        if (friendId !== "") {
            $("#friend-input").prop("disabled", true);
            $("#invite-button").prop("disabled", true);
            $("#invite-button").val("Connecting ...");
            sendInviteForNewGame(friendId).fail(function(err) {
                $("#msg").text("could not send invite " + err);
                $("#friend-input").prop("disabled", false);
                $("#invite-button").prop("disabled", false);
                $("#invite-button").val("Play!");
            }).done(function() {
            });
        }
    });

    $("#logout").click(function(event) {
        event.preventDefault();
        adrenaline.user.currentUser().logOut().done(function() {
            window.location.href = "login.html";
        });
        return false;
    });

    $(".cell").click(function() {
        var cellId = $(this).attr("id");
        sendMyMove(cellId);
    });

    addGameStateHandler(function(myMark, isMyMove, boardState, opponent) {
        connected = true;
        $("#status").show();
        $("#friend-input").prop("disabled", true);
        $("#opponent").text(opponent);
        $("#friend-input").val(opponent);
        $("#invite-button").prop("disabled", false);
        $("#invite-button").val("Disconnect!");


        if (isMyMove) {
            $(".arrow-left").show();
            $(".arrow-right").hide();
        } else {
            $(".arrow-right").show();
            $(".arrow-left").hide();
        }

        for (var cell in boardState) {
            if (boardState[cell] !== null) {
                console.log("setting class " + boardState[cell]);
                $("#" + cell).children().addClass(boardState[cell]);
            }
        }
    });
});
