/*  This is the mario representation in a regular level.
 @param position - an object in the form {x:pixels, y:pixels}. */
sm3.SmallMario = function (initialPosition, level) {
    "use strict";
    var that = this;
    var frameSize = {width:64,height:64};
    var cameraOffest = {x:0, y:0};

    this.getFrameSize = function () {
        return frameSize;
    };
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    var flip = true;
    sm3.Entity.call(this, "./images/smallMario.png", 100, frameSize);
    this.addAnim(new sm3.Anim("Stopped",
                              [{x:0, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Run",
                              [{x:0, y:0},
                               {x:frameSize.width, y:0}],
                              [0,0,1,1])
                );
    this.addAnim(new sm3.Anim("Jump",
                              [{x:frameSize.width * 2, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("ChangeDirection",
                              [{x:frameSize.width * 3, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("PreFly",
                              [{x:frameSize.width * 4, y:0},
                               {x:frameSize.width * 5, y:0},
                               {x:frameSize.width * 6, y:0}],
                              [1,0,1,2,0])
                );
    this.addAnim(new sm3.Anim("Slide",
                              [{x:frameSize.width * 7, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Tube",
                              [{x:frameSize.width * 8, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Climb",
                              [{x:0, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Die",
                              [{x:frameSize.width, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Swim",
                              [{x:frameSize.width * 2, y:frameSize.height},
                               {x:frameSize.width * 3, y:frameSize.height},
                               {x:frameSize.width * 4, y:frameSize.height}],
                              [2,2,2,2,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1])
                );
    this.addAnim(new sm3.Anim("Fly",
                              [{x:frameSize.width * 5, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("CarryShell",
                              [{x:frameSize.width * 6, y:frameSize.height},
                               {x:frameSize.width * 7, y:frameSize.height}],
                              [0,0,1,1])
                );

    this.changeAnim("Stopped");

    var currentState = sm3.SmallMario.STATE.STOPPED;

    this.update = function (dt) {
        switch(currentState) {
        case sm3.SmallMario.STATE.STOPPED:
            if (sm3.input.getPressed(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
                this.changeState(sm3.SmallMario.STATE.RUNNING);
            } else if ( sm3.input.getPressed(sm3.RIGHT)) {
                this.changeState(sm3.SmallMario.STATE.RUNNING);
                accelerate(dt, sm3.RIGHT);
            }
            break;
        case sm3.SmallMario.STATE.RUNNING:
            if (sm3.input.getHeld(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
            } else if ( sm3.input.getHeld(sm3.RIGHT)) {
                accelerate(dt, sm3.RIGHT);
            } else {
                decelerate(dt);
            }
            if (sm3.input.getPressed(sm3.LEFT) && velocity.x > 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
            } else if (sm3.input.getPressed(sm3.RIGHT) && velocity.x < 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
            }
            checkFlip();
            break;
        case sm3.SmallMario.STATE.JUMPING:

            checkFlip();
            break;
        case sm3.SmallMario.STATE.CHANGEDIRECTION:
            if (sm3.input.getHeld(sm3.LEFT) && velocity.x > 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
                accelerate(dt, sm3.LEFT);
            } else if (sm3.input.getHeld(sm3.RIGHT) && velocity.x < 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
                accelerate(dt, sm3.RIGHT);
            } else {
                that.changeState(sm3.SmallMario.STATE.RUNNING);
            }
            break;
        case sm3.SmallMario.STATE.PREFLY:

            break;
        case sm3.SmallMario.STATE.SLIDE:

            break;
        case sm3.SmallMario.STATE.TUBE:

            break;
        case sm3.SmallMario.STATE.CLIMB:

            break;
        case sm3.SmallMario.STATE.DIE:

            break;
        case sm3.SmallMario.STATE.SWIM:

            break;
        case sm3.SmallMario.STATE.FLY:

            break;
        case sm3.SmallMario.STATE.CARRYSHELL:

            break;
        }
        updatePosition(dt);
        this.animate(dt);
    };
    this.changeState = function (newState) {
        currentState = newState;
        switch(newState) {
        case sm3.SmallMario.STATE.STOPPED:
            this.changeAnim("Stopped");
            break;
        case sm3.SmallMario.STATE.RUNNING:
            this.changeAnim("Run");
            break;
        case sm3.SmallMario.STATE.JUMPING:

            break;
        case sm3.SmallMario.STATE.CHANGEDIRECTION:
            this.changeAnim("ChangeDirection");
            break;
        case sm3.SmallMario.STATE.PREFLY:

            break;
        case sm3.SmallMario.STATE.SLIDE:

            break;
        case sm3.SmallMario.STATE.TUBE:

            break;
        case sm3.SmallMario.STATE.CLIMB:

            break;
        case sm3.SmallMario.STATE.DIE:

            break;
        case sm3.SmallMario.STATE.SWIM:

            break;
        case sm3.SmallMario.STATE.FLY:

            break;
        case sm3.SmallMario.STATE.CARRYSHELL:

            break;
        }
    };
    this.render = function () {
        sm3.ctx.save();
        if (flip) {
            sm3.ctx.scale(-1,1);
            this.displayAnim(-(position.x - cameraOffest.x + frameSize.width), position.y - cameraOffest.y);
        } else {
            this.displayAnim(position.x - cameraOffest.x, position.y - cameraOffest.y);
        }
        sm3.ctx.restore();
    };
    this.setCameraOffset = function (cameraPosition) {
        cameraOffest = cameraPosition;
    };
    var collisionWidth = 60;
    var collisionHeight = 60;
    var collisionOffset = {x:2, y:4}; //collision is centered in x but at he bottom in y
    this.getCollisionBox = function () {

    };
    var maxVelocity = {x:0.6, y:1.0};
    var velocity = {x:0, y:0};
    var acceleration = 0.001;
    var accelerate = function (dt, direction) {
        if (direction == sm3.LEFT) {
            velocity.x -= acceleration * dt;
        } else if (direction == sm3.RIGHT) {
            velocity.x += acceleration * dt;
        }
        if (velocity.x > maxVelocity.x) {
            velocity.x = maxVelocity.x;
        } else if ( velocity.x < -1 * maxVelocity.x) {
            velocity.x = -1 * maxVelocity.x;
        }
    };
    var decelerate = function (dt) {
        if (velocity.x < 0) {
            velocity.x += acceleration * dt;
        } else if (velocity.x > 0) {
            velocity.x -= acceleration * dt;
        }
        if (Math.abs(velocity.x) < 0.35) {
            velocity.x = 0;
            that.changeState(sm3.SmallMario.STATE.STOPPED);
        }
    };
    var updatePosition = function (dt) {
        position.x += velocity.x * dt;
        position.y += velocity.y * dt;
    };
    var checkFlip = function () {
        if (flip) {
            if (velocity.x < 0) {
                flip = false;
            }
        } else {
            if (velocity.x > 0) {
                flip = true;
            }
        }
    };
};

sm3.SmallMario.STATE = {
    STOPPED:0,
    RUNNING:1,
    JUMPING:2,
    CHANGEDIRECTION:3,
    PREFLY:4,
    SLIDE:5,
    TUBE:6,
    CLIMB:7,
    DIE:8,
    SWIM:9,
    FLY:10,
    CARRYSHELL:11
};
