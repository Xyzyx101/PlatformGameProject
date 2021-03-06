/* Entity that represent each one of the spinning wheels in the spin minigame */
sm3.Spinner = function (wheel) {
    var frameSize = {width:980, height:116};
    var tileWidth = 535;
    //This entity is strange because the screen position is static and
    // the part of the sprite that is displayed scrolls.
    var position = {x:0,y:0}; //position is the position on the screen
    var wheelPosition = {x:0, y:0}; //wheelPosition is the position on the sprite

    var backwards = false; // backwards is a multiplier for the spin direction

    var initWheelPosition = function () {
        switch(wheel) {
        case sm3.Spinner.WHEEL.FIRST:
            position = {x:22, y:126};
            wheelPosition = {x:getTileOffset(2), y:0};
            break;
        case sm3.Spinner.WHEEL.SECOND:
            position = {x:22, y:242};
            wheelPosition = {x:getTileOffset(3), y:116};
            backwards = true;
            break;
        case sm3.Spinner.WHEEL.THIRD:
            position = {x:22, y:358};
            wheelPosition = {x:getTileOffset(1), y:232}; //313
            break;
        }
    };
    sm3.Entity.call(this, "./images/spinGameSprite.png", 0, frameSize);

    var currentState = null;
    this.changeState = function (newState) {
        currentState = newState;
    };
    this.changeState(sm3.Spinner.STATE.INVISIBLE);
    this.getState = function () {
        return currentState;
    };

    var selectedTile = null;

    var fastSpeed = 2; // pixels/millisecond when spinning
    var slowSpeed = 0.0005; // pixels/millisecond deceleration when moving to final position
    var currentSpeed = fastSpeed;
    var timeToChangeSpeed = 5000; // amount of milliseconds it takes to slow after player presses stop
    var notStartedTime = 2500;
    var notStartedAccumulator = 0;
    var rotateSpinner = function (dt) {
        if (backwards) {
            if (wheelPosition.x < 803) {
                wheelPosition.x = 2943;
            }
        } else {
            if (wheelPosition.x > 2943) {
                wheelPosition.x = 803;
            }
        }
        direction = backwards ? -1 : 1;
        wheelPosition.x += currentSpeed * dt * direction;
    };
    this.update = function(dt) {
        switch(currentState) {
        case sm3.Spinner.STATE.INVISIBLE:
            break;
        case sm3.Spinner.STATE.NOTSTARTED:
            notStartedAccumulator += dt;
            if (notStartedAccumulator > notStartedTime) {
                this.changeState(sm3.Spinner.STATE.SPINNING);
            }
            break;
        case sm3.Spinner.STATE.SPINNING:
            rotateSpinner(dt);
            if ( sm3.input.getPressed(sm3.JUMP) || sm3.input.getPressed(sm3.JUMP) ) {
                sm3.soundManager.play("smb3_nspade_match");
                selectedTile = getCurrentTile();
                this.changeState(sm3.Spinner.STATE.SLOWING);
            }
            break;
        case sm3.Spinner.STATE.SLOWING:
            currentSpeed -= slowSpeed * dt;
            if (currentSpeed < 0.4) {
                currentSpeed = 0.4;
                if (wheelPosition ) {

                }
            }
            rotateSpinner(dt);
            var stopPosition = getTileOffset(selectedTile);
            if (currentSpeed == 0.4 &&
                Math.abs(wheelPosition.x - stopPosition) < 35) {
                currentSpeed = 0;
                wheelPosition.x = stopPosition;
                this.changeState(sm3.Spinner.STATE.STOPPED);
            }
            break;
        case sm3.Spinner.STATE.STOPPED:
            break;
        default:
            console.log("Error unkown state in Spinner entity");
        }
    };
    this.render = function() {
        if (currentState == sm3.Spinner.STATE.INVISIBLE) {

            return;
        }
        sm3.ctx.drawImage(this.getImage(),
                wheelPosition.x,
                wheelPosition.y,
                frameSize.width,
                frameSize.height,
                position.x,
                position.y,
                frameSize.width,
                frameSize.height);
    };

    // returns an integer to represent which tile is at the center of the screen
    var getCurrentTile = function () {
        var tile = Math.floor((wheelPosition.x + frameSize.width / 2) / tileWidth);
        if (tile == 6) {
            // if you stop on the last mushroom you can see the end of the sprite.
            // This just fudges the answer so when you click the last mushroom you stop
            // on the second last one.
            tile = 4;
        }
        return tile;
    };
    var getTileOffset = function (tile) {
        var centerOffset  = Math.floor((frameSize.width - tileWidth) / 2);
        return tile * tileWidth - centerOffset;
    };
    var tiles = [sm3.Spinner.TILE.MUSHROOM,
                 sm3.Spinner.TILE.FLOWER,
                 sm3.Spinner.TILE.MUSHROOM,
                 sm3.Spinner.TILE.STAR,
                 sm3.Spinner.TILE.MUSHROOM,
                 sm3.Spinner.TILE.FLOWER,
                 sm3.Spinner.TILE.MUSHROOM];

    // this will be used by the minigame controller to see if you won
    this.getStoppedTile = function () {
        if (currentState != sm3.Spinner.STATE.STOPPED) {
            return null;
        }
        return tiles[selectedTile];
    };
    initWheelPosition();

};
sm3.Spinner.WHEEL = {
    FIRST:0,
    SECOND:1,
    THIRD:2
};
sm3.Spinner.STATE = {
    INVISIBLE:0,
    NOTSTARTED:1,
    SPINNING:2,
    SLOWING:3,
    STOPPED:4
};
sm3.Spinner.TILE = {
    MUSHROOM:0,
    FLOWER:1,
    STAR:2
};