/*  This is an entity that controls the state of the spinning minigame */
sm3.SpinController = function (spinners) {
    "use strict";
    sm3.Entity.call(this, "", 0, 0);

    var INTRO = 0;
    var SPIN = 1;
    var COMPLETE = 2;
    var currentState = INTRO;

    var timeAccumulator = 0;
    var delayTime = 8000; //8 second delay at intro screen
    this.update = function (dt) {
        switch(currentState) {
        case INTRO:
            timeAccumulator += dt;
            if (timeAccumulator > delayTime * 1000 ||
            sm3.input.getPressed(sm3.JUMP) ||
            sm3.input.getPressed(sm3.START)) {
                currentState = SPIN;
            }
            break;
        case SPIN:
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

            //TODO - do some shit to see if you won

            break;
        }
    };
    this.render = function () {};
};
