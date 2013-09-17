$(document).ready(function() {
    var myMark;
    var isMyMove;
    var board;

    $("#invite-button").click(function() {
        var friendId = $("#friend-input").val();
        if (friendId !== "") {
            $("#friend-input").prop("disabled", true);
            $("#invite-button").prop("disabled", true);
            $("#invite-button").text("Connecting...");
            sendInviteForNewGame(friendId).fail(function(err) {
                $("#msg").text("could not send invite " + err);
                $("#friend-input").prop("disabled", false);
                $("#invite-button").prop("disabled", false);
                $("#invite-button").text("Play!");
            }).done(function() {
                $("#invite-button").text("Connected!");
            });
        }
    });

    $(".cell").click(function() {
        var cellId = $(this).attr("id");
        sendMyMove(cellId);
    });

    addGameStateHandler(function(myMark, isMyMove, boardState, opponent) {
        $("#friend-input").prop("disabled", true);
        $("#friend-input").val(opponent);
        $("#friend-input").prop("disabled", true);
        $("#invite-button").prop("disabled", true);
        $("#invite-button").text("Connected!");

        if (isMyMove) {
            $("#msg").text("Make your move");
        } else {
            $("#msg").text("Waiting for " + opponent + " to move");
        }

        for (var cell in boardState) {
            if (boardState[cell] !== null) {
                console.log("setting class " + boardState[cell]);
                $("#" + cell).children().addClass(boardState[cell]);
            }
        }
    });
});
