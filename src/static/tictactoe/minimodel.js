(function(global) {
    var WAITING_FOR_INVITE = 0;
    var INVITE_SENT = 1;
    var PLAYING_GAME = 2;
    var gameState = WAITING_FOR_INVITE;
    var board = {"cell0": null, "cell1": null, "cell2": null,
                 "cell3": null, "cell4": null, "cell5": null,
                 "cell6": null, "cell7": null, "cell8": null};

    var myMark;
    var opponent;
    var isMyMove;

    var onGameStateUpdate = null;

    global.addGameStateHandler = function(callback) {
        onGameStateUpdate = callback;
    };

    function triggerGameUpdate() {
        if (!onGameStateUpdate) {
            console.error("register for game state updates to see when the game state changes");
            return;
        }

        var opponentId = "opponent";
        if (opponent) {
            opponentId = opponent.userId;
        }


        onGameStateUpdate(myMark, isMyMove, board, opponentId);
    }

    global.sendMyMove = function(cellId) {
        if (!isMyMove) {
            console.log("it's not your move");
            return;
        }

        if (board[cellId] != null) {
            console.log("cell occupied, ignoring click");
            return;
        }

        board[cellId] = myMark;
        isMyMove = false;
        opponent.sendMessage("move", {"board": board}).fail(function(err) {
            console.error("could not send move: " + err);
        });

        triggerGameUpdate();
    }

    global.sendInviteForNewGame = function(friendId) {
        if (gameState !== WAITING_FOR_INVITE) {
            var ret = $.Deferred();
            ret.reject("already waiting for invite");
            return ret.promise();
        }

        gameState = INVITE_SENT;
        myMark = "X";
        isMyMove = true;
        opponent = adrenaline.user.getUser(friendId);
        var def = opponent.sendMessage("newGame",
                                       {"opponent": adrenaline.user.currentUser().userId});
        return def;
    };

    $(document).ready(function() {
        // simple check to see if there is a valid current user with this page
        if (!adrenaline.user.currentUser()) {
            window.location.href = "login.html";
            return;
        }

        $("#logout").text("Sign out (" + adrenaline.user.currentUser().userId + ")");

        /********** Application specific message handlers ***********/
        // XXX FIXME check game states on handlers

        // another user has requested a new game, reply with a
        // "newGameAccepted" message to start a game
        adrenaline.user.currentUser().getCommsChannel('newGame')
            .addHandler(function(data) {
                opponent = adrenaline.user.getUser(data.msg_data.opponent);
                opponent.sendMessage("newGameAccepted", "Yeah!").done(function() {
                    console.log("starting game");
                    gameState = PLAYING_GAME;
                    myMark = "O";
                    isMyMove = false;
                    triggerGameUpdate();
                }).fail(function(err) {
                    console.log("failed sending newGameAccepted message back " + err);
                });
        });

        // The other user accepted our new game, let the user know
        // that they can move
        adrenaline.user.currentUser().getCommsChannel('newGameAccepted')
            .addHandler(function() {
                gameState = PLAYING_GAME;
                triggerGameUpdate();
                console.log("new game accepted");
            });

        adrenaline.user.currentUser().getCommsChannel('move')
            .addHandler(function(data) {
                console.log("got move: " + JSON.stringify(data));
                board = data.msg_data.board;
                isMyMove = true;
                triggerGameUpdate();
        });

        adrenaline.comms.connect();

        /************************************************************/

    });
})(this);
