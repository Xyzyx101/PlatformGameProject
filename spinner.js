/* Entity that represent each one of the spinning wheels in the spin minigame */
sm3.Spinner = function (wheel) {
    var frameSize = {width:936, height:116};

    //This entity is strange because the screen position is static and
    // the part of the sprite that is displayed scrolls.
    var position = {x:0,y:0}; //position is the position on the screen
    var wheelPosition = {x:0, y:0}; //wheelPosition is the position on the sprite

    var backwards = false;
    switch(wheel) {
    case sm3.Spinner.WHEEL.FIRST:
        position = {x:22, y:180};
        wheelPosition = {x:0, y:0}; //TODO set x
        break;
    case sm3.Spinner.WHEEL.SECOND:
        position = {x:22, y:296};
        wheelPosition = {x:0, y:116}; //TODO set x
        backwards = true;
        break;
    case sm3.Spinner.WHEEL.THIRD:
        position = {x:22, y:412};
        wheelPosition = {x:0, y:232}; //TODO set x
        break;
    }
    sm3.Entity.call(this, "./images/spinGameSprite.png", 0, frameSize);

    var currentState = null;
    this.changeState(sm3.Spinner.STATE.INVISBLE);
    this.changeState = function (newState) {
        currentState = newState;
    };
    this.getState = function () {
        return currentState;
    };

    var fastSpeed = 3; // pixels/millisecond when spinning
    var slowSpeed = 0.2; // pixels/millisecond when moving to final position
    var timeToChangeSpeed = 4000; // ampunt of milliseconds it takes to slow after player presses stop
    this.update = function(dt) {
        switch(currentState) {
        case sm3.Spinner.STATE.INVISIBLE:
            break;
        case sm3.Spinner.STATE.NOTSTARTED:
            break;
        case sm3.Spinner.STATE.SPINNING:
            break;
        case sm3.Spinner.STATE.SLOWING:
            break;
        case sm3.Spinner.STATE.STOPPED:
            break;
        }
    };
    this.render = function() {
        if (currentState == sm3.Spinner.STATE.INVISIBLE) {
            return;
        }
    };
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