/*  This is the mario representation on the world map.
    @param position - an object in the form {x:pixels, y:pixels}. */
sm3.MarioMap = function (position, characterState, initialMapPosition) {
    "use strict";
    var currentCharacterState = characterState;
    var mapPosition = initialMapPosition;
    var frameSize = {width:70,height:64};
    sm3.Entity.call(this, "./images/mapTiles.png", 350, frameSize);
    sm3.soundManager.loadAudio("smb3_map_travel", 0.6);
    this.addAnim(new sm3.Anim("Small",
                [{x:0, y:frameSize.height * 4},
                {x:0, y:frameSize.height * 5}],
                [0,1])
    );
    this.addAnim(new sm3.Anim("Super",
                [{x:frameSize.width, y:frameSize.height * 4},
                {x:frameSize.width, y:frameSize.height * 5}],
                [0,1])
    );
    this.addAnim(new sm3.Anim("Racoon",
                [{x:frameSize.width * 2, y:frameSize.height * 4},
                {x:frameSize.width * 2, y:frameSize.height * 5}],
                [0,1])
    );
    this.changeAnim("Small");

    var moveSpeed = 0.3;

    var MOVING = 0;
    var STOPPED = 1;
    var currentState = STOPPED;

    var newPixelPosition;
    this.update = function (dt) {
        switch(currentState) {
        case MOVING:
            sm3.soundManager.play("smb3_map_travel");
            var xDirection = newPixelPosition.x - position.x;
            var yDirection = newPixelPosition.y - position.y;
            if (xDirection < 0) {
                xDirection = -1;
                position.x += xDirection * moveSpeed * dt;
                if (position.x < newPixelPosition.x ) { position.x = newPixelPosition.x;}
            }
            if (xDirection > 0) {
                xDirection = 1;
                position.x += xDirection * moveSpeed * dt;
                if (position.x > newPixelPosition.x ) {position.x = newPixelPosition.x;}
            }
            if (yDirection > 0) {
                yDirection = 1;
                position.y += yDirection * moveSpeed * dt;
                if (position.y > newPixelPosition.y ) {position.y = newPixelPosition.y;}
            }
            if (yDirection < 0) {
                yDirection = -1;
                position.y += yDirection * moveSpeed * dt;
                if (position.y < newPixelPosition.y) {position.y = newPixelPosition.y;}
            }
            if (position.x == newPixelPosition.x &&
                position.y == newPixelPosition.y) {
                newPixelPosition = null;
                currentState = STOPPED;
            }
            break;
        case STOPPED:
            if (sm3.input.getPressed(sm3.JUMP) || sm3.input.getPressed(sm3.START)) {
                sm3.game.getWorld().enterLevel(mapPosition);
            }

            var targetPosition;
            switch(true) {
            case sm3.input.getPressed(sm3.UP):
                targetPosition = {x:mapPosition.x, y:mapPosition.y - 1};
                newPixelPosition = sm3.game.getWorld().checkPassable(mapPosition, targetPosition);
                break;
            case sm3.input.getPressed(sm3.DOWN):
                targetPosition = {x:mapPosition.x, y:mapPosition.y + 1};
                newPixelPosition = sm3.game.getWorld().checkPassable(mapPosition, targetPosition);
                break;
            case sm3.input.getPressed(sm3.LEFT):
                targetPosition = {x:mapPosition.x - 1, y:mapPosition.y};
                newPixelPosition = sm3.game.getWorld().checkPassable(mapPosition, targetPosition);
                break;
            case sm3.input.getPressed(sm3.RIGHT):
                targetPosition = {x:mapPosition.x + 1, y:mapPosition.y};
                newPixelPosition = sm3.game.getWorld().checkPassable(mapPosition, targetPosition);
                break;
            }
            if (newPixelPosition) {
                mapPosition = targetPosition;
                currentState = MOVING;
            }
            break;
        }
        this.animate(dt);
    };
    this.render = function () {
        this.displayAnim(position.x, position.y);
    };
    this.moveTo = function (newTargetPosition) {
        targetPosition = newTargetPosition;
    };
};
sm3.MarioMap.CHARACTERSTATE = {SMALL:0, SUPER:1, RACOON:2};
