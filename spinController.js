/*  This is an entity that controls the state of the spinning minigame */
sm3.SpinController = function (spinners, extraLifeEntity) {
    "use strict";
    //sm3.Entity.call(this, "", 0, 0);

    var INTRO = 0;
    var SPIN = 1;
    var COMPLETE = 2;
    var currentState = INTRO;

    var timeAccumulator = 0;
    var introDelayTime = 8000; // 8 second delay at intro screen
    var completeDelayTime = 4000; // 3 second delay before going back to the map
    var playCompleteSoundOnce = true;
    this.update = function (dt) {
        switch(currentState) {
        case INTRO:
            timeAccumulator += dt;
            if (timeAccumulator > introDelayTime ||
                sm3.input.getPressed(sm3.JUMP) ||
                sm3.input.getPressed(sm3.ACTION) ||
                sm3.input.getPressed(sm3.START)) {
                spinners.forEach(function (element) {
                    element.changeState(sm3.Spinner.STATE.NOTSTARTED);
                });
                timeAccumulator = 0; //reset so it can be used again at the end
                currentState = SPIN;
                sm3.soundManager.play("smb3_enter_level");
            }
            break;
        case SPIN:
            sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/spinGameBackground.png"));
            var spinnersStopped = 0;
            spinners.forEach(function (element) {
                if (element.getState() == sm3.Spinner.STATE.STOPPED) {
                    spinnersStopped++;
                }
            });
            if (spinnersStopped == spinners.length) {
                currentState = COMPLETE;
            }
            break;
        case COMPLETE:
            var tiles = [];
            spinners.forEach( function (element, index) {
                tiles[index] = element.getStoppedTile();
            });
            if (tiles[0] == tiles[1] && tiles[0] == tiles[2]) {
                extraLifeEntity.winWithTile(tiles[0]);
            } else {
                if (playCompleteSoundOnce) {
                    sm3.soundManager.play("smb3_bonus_game_no_match");
                    playCompleteSoundOnce = false;
                }
            }
            timeAccumulator += dt;
            if (timeAccumulator > completeDelayTime) {
                // if the world exist go back to the map.  If there is no map then the player
                // must have entered the game from the title screen.
                if ( sm3.game.getWorld() ) {
                    sm3.game.getWorld().completeActiveLevel();
                    sm3.game.loadLevel(sm3.game.WORLD01MAP);
                } else {
                    sm3.game.loadLevel(sm3.game.TITLESCREEN);
                }
            }
            break;
        }

    };
    // There is nothing for render to do.  It is only here because the gameloop will call it I do need the entity to tick
    this.render = function () {};
};
