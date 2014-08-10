/*  This is the mario representation in a regular level.
 @param position - an object in the form {x:pixels, y:pixels}. */
sm3.SmallMario = function (initialPosition, level, powerLevel) {
    "use strict";
    var that = this;

    var marioPowerLevel = powerLevel || sm3.SmallMario.POWERLEVEL.SMALL;
    this.getPowerLevel = function () {
        return marioPowerLevel;
    };

    var frameSize = {width:64,height:64};
    this.getFrameSize = function () {
        return frameSize;
    };
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };

    // Bounding box is centered in x and at the bottom in y
    var bbSize = {width:46, height:56};
    var bbOffset = {x:9, y:8};
    var bb = new sm3.BoundingBox(position, frameSize, bbSize, bbOffset);
    this.getBoundingBox = function () {
        return bb;
    };
    var flip = true;
    var isStanding = false;
    var isFast = false; // this is true when you hold the run button
    var maxVelocity = {walk:325,
                       run:500,
                       fly:750,
                       y:800.0};
    var velocity = {x:0, y:0};
    var acceleration = {walk:0.5,
                        run:0.75,
                        fly:0.1}; // horizontal acceleration
    var gravity = 2.4; // vertical acceleration
    var initialJumpVelocity = 750;
    var holdJumpAcceleration = 200;
    var holdFlyAcceleration = 260;
    var jumpTimer = 0;
    var maxHoldJumpTime = 400;
    var currentTimer = null;
    var timerTarget = null;

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
    this.getType = function () {
        return sm3.GameLevel.ENTITYTYPE.MARIO;
    };
    this.update = function (dt) {
        isFast = sm3.input.getHeld(sm3.ACTION);
        switch(currentState) {
        case sm3.SmallMario.STATE.STOPPED:
            if (sm3.input.getPressed(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
                this.changeState(sm3.SmallMario.STATE.RUNNING);
            } else if ( sm3.input.getPressed(sm3.RIGHT)) {
                this.changeState(sm3.SmallMario.STATE.RUNNING);
                accelerate(dt, sm3.RIGHT);
            }
            if (sm3.input.getPressed(sm3.JUMP)) {
                that.changeState(sm3.SmallMario.STATE.JUMPING);
                jump(dt);
            }
            break;
        case sm3.SmallMario.STATE.RUNNING:
            if (sm3.input.getHeld(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
                if (velocity.x < -maxVelocity.run * 0.95) {
                    this.changeState(sm3.SmallMario.STATE.PREFLY);
                }
            } else if ( sm3.input.getHeld(sm3.RIGHT)) {
                accelerate(dt, sm3.RIGHT);
                if (velocity.x > maxVelocity.fly * 0.95) {
                    this.changeState(sm3.SmallMario.STATE.PREFLY);
                }
            } else {
                decelerate(dt);
            }
            if (sm3.input.getPressed(sm3.LEFT) && velocity.x > 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
            } else if (sm3.input.getPressed(sm3.RIGHT) && velocity.x < 0) {
                that.changeState(sm3.SmallMario.STATE.CHANGEDIRECTION);
            }
            if (sm3.input.getPressed(sm3.JUMP)) {
                that.changeState(sm3.SmallMario.STATE.JUMPING);
                jump(dt);
            }
            checkFlip();
            break;
        case sm3.SmallMario.STATE.JUMPING:
            if (sm3.input.getHeld(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
            } else if ( sm3.input.getHeld(sm3.RIGHT)) {
                accelerate(dt, sm3.RIGHT);
            }
            if (isStanding) {
                this.changeState(sm3.SmallMario.STATE.RUNNING);
            }
            if ( sm3.input.getHeld(sm3.JUMP) &&
                 jumpTimer < maxHoldJumpTime) {
                velocity.y -= holdJumpAcceleration * dt * 0.01;
            }
            jumpTimer += dt;
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
            if (sm3.input.getPressed(sm3.JUMP)) {
                that.changeState(sm3.SmallMario.STATE.FLY);
                jump(dt);
            }
            if (Math.abs(velocity.x) < maxVelocity.fly * 0.9) {
                this.changeState(sm3.SmallMario.STATE.RUNNING);
            }
            sm3.soundManager.play("smb3_pmeter");
            checkFlip();
            break;
        case sm3.SmallMario.STATE.SLIDE:

            break;
        case sm3.SmallMario.STATE.TUBE:

            break;
        case sm3.SmallMario.STATE.CLIMB:

            break;
        case sm3.SmallMario.STATE.DIE:
            currentTimer += dt;
            if (currentTimer > timerTarget) {
                sm3.game.loadLevel(sm3.game.WORLD01MAP);
            }
            break;
        case sm3.SmallMario.STATE.SWIM:

            break;
        case sm3.SmallMario.STATE.FLY:
            if (sm3.input.getHeld(sm3.LEFT)) {
                accelerate(dt, sm3.LEFT);
            } else if ( sm3.input.getHeld(sm3.RIGHT)) {
                accelerate(dt, sm3.RIGHT);
            }
            if (isStanding) {
                this.changeState(sm3.SmallMario.STATE.RUNNING);
            }
            if ( sm3.input.getHeld(sm3.JUMP) &&
                 jumpTimer < maxHoldJumpTime) {
                velocity.y -= holdFlyAcceleration * dt * 0.01;
            }
            jumpTimer += dt;
            checkFlip();
            sm3.soundManager.play("smb3_pmeter");
            break;
        case sm3.SmallMario.STATE.CARRYSHELL:

            break;
        default:
            console.log("Error in smallMario update unknown state");
        }
        fall(dt);
        isStanding = false;
        updatePosition(dt);
        bb.updatePosition(position); //update bounding box with new position
        this.animate(dt);

        //FIXME
        //console.log("posX: " + position.x + "velX: " + velocity.x)
        //console.log("posY: " + position.y + "velY: " + velocity.y)
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
            sm3.soundManager.play("smb3_jump");
            jumpTimer = 0;
            this.changeAnim("Jump");
            break;
        case sm3.SmallMario.STATE.CHANGEDIRECTION:
            this.changeAnim("ChangeDirection");
            break;
        case sm3.SmallMario.STATE.PREFLY:
            this.changeAnim("PreFly");
            break;
        case sm3.SmallMario.STATE.SLIDE:

            break;
        case sm3.SmallMario.STATE.TUBE:

            break;
        case sm3.SmallMario.STATE.CLIMB:

            break;
        case sm3.SmallMario.STATE.DIE:
            this.changeAnim("Die");
            sm3.soundManager.play("smb3_player_down");
            currentTimer = 0;
            timerTarget = 4000;
            velocity.x = 0;
            velocity.y = -initialJumpVelocity * 2;
            canInteractWithStaticGeometry = false;
            break;
        case sm3.SmallMario.STATE.SWIM:

            break;
        case sm3.SmallMario.STATE.FLY:
            jumpTimer = 0;
            this.changeAnim("Fly");
            break;
        case sm3.SmallMario.STATE.CARRYSHELL:

            break;
        default:
            console.log("Error in smallMario changeState unknown state");
        }
    };

    this.render = function (cameraOffset) {
        if (flip) {
            sm3.ctx.save();
            sm3.ctx.scale(-1,1);
            this.displayAnim(-(position.x - cameraOffset.x + frameSize.width), position.y - cameraOffset.y);
            sm3.ctx.restore();
        } else {
            this.displayAnim(position.x - cameraOffset.x, position.y - cameraOffset.y);
        }
    };
    var canInteractWithStaticGeometry = true;
    this.interactsWithStaticGeometry = function () {
        return canInteractWithStaticGeometry;
    };
    this.getInteractsWithList = function () {
        return [sm3.GameLevel.ENTITYTYPE.COIN,
                sm3.GameLevel.ENTITYTYPE.COINBLOCK,
                sm3.GameLevel.ENTITYTYPE.LEAFBLOCK,
                sm3.GameLevel.ENTITYTYPE.GOOMBA,
                sm3.GameLevel.ENTITYTYPE.KOOPA,
                sm3.GameLevel.ENTITYTYPE.FLYINGGOOMBA,
                sm3.GameLevel.ENTITYTYPE.FLYINGKOOPA,
                sm3.GameLevel.ENTITYTYPE.SUPERMUSHROOM,
                sm3.GameLevel.ENTITYTYPE.UPMUSHROOM];
    };

    this.resolveStaticCollision = function (collision, dt) {
        switch(collision.type) {
        case sm3.CollisionSystem.COLLISIONTILES.SOLID:
            updateCollisionPhysics(collision.collisionVector, dt);
            break;
        case sm3.CollisionSystem.COLLISIONTILES.TOPONLY:
            if (collision.collisionVector.y < 0) {
                updateCollisionPhysics(collision.collisionVector, dt);
            }
            break;
        case sm3.CollisionSystem.COLLISIONTILES.DEATH:
            this.changeState(sm3.SmallMario.STATE.DIE);
            break;
        default:
            console.log("Error in smallMario.resolveStaticCollisions() Unknown tile type");
        }
        updateIsStanding(collision.collisionVector);
    };

    // @param collider - collision object with collision vector and type
    // @param object - th object that you are collising with
    // @param dt - the tick dt in milliseconds
    var angle;
    this.resolveActiveCollision = function (collision, object, dt) {
        if (currentState == sm3.SmallMario.STATE.DIE) {
            return;
        }
        switch(collision.type) {
        case sm3.GameLevel.ENTITYTYPE.COIN:
            sm3.soundManager.play("smb3_coin");
            object.hit();
            break;
        case sm3.GameLevel.ENTITYTYPE.COINBLOCK:
            angle = sm3.utils.getAngle(collision.collisionVector);
            if (angle > -0.75 * Math.PI && angle < -0.25 * Math.PI) {
                sm3.soundManager.play("smb3_bump");
                object.hit();
            }
            break;
        case sm3.GameLevel.ENTITYTYPE.LEAFBLOCK:

            break;
        case sm3.GameLevel.ENTITYTYPE.GOOMBA:
            if (object.getState() != sm3.Goomba.STATE.WALK) {
                return;
            }
            angle = sm3.utils.getAngle(collision.collisionVector);
            if (angle > 0.25 * Math.PI && angle < 0.75 * Math.PI) {
                sm3.soundManager.play("smb3_stomp");
                object.stomp();
                jump(dt);
                this.changeState(sm3.SmallMario.STATE.JUMPING);
            } else {
                this.changeState(sm3.SmallMario.STATE.DIE);
            }
            break;
        case sm3.GameLevel.ENTITYTYPE.DARKGOOMBA:
            if (object.getState() != sm3.Goomba.STATE.WALK) {
                return;
            }
            angle = sm3.utils.getAngle(collision.collisionVector);
            if (angle > 0.25 * Math.PI && angle < 0.75 * Math.PI) {
                sm3.soundManager.play("smb3_stomp");
                object.stomp();
                jump(dt);
                this.changeState(sm3.SmallMario.STATE.JUMPING);
            } else {
                this.changeState(sm3.SmallMario.STATE.DIE);
            }
            break;
        case sm3.GameLevel.ENTITYTYPE.KOOPA:

            break;
        case sm3.GameLevel.ENTITYTYPE.FLYINGGOOMBA:

            break;
        case sm3.GameLevel.ENTITYTYPE.FLYINGKOOPA:

            break;
        case sm3.GameLevel.ENTITYTYPE.SUPERMUSHROOM:
            console.log("TODO -- get big");
            sm3.soundManager.play("smb3_power-up");
            object.hit();
            break;
        case sm3.GameLevel.ENTITYTYPE.UPMUSHROOM:
            sm3.soundManager.play("smb3_1-up");
            console.log("TODO -- 1UP");
            object.hit();
            break;
        default:
            console.log("Error in smallMario resolve active collision - unkown entity");
        };
    };

    var updateIsStanding = function (collisionVector) {
        var finalCollisionAngle = sm3.utils.getAngle(collisionVector);
        if (finalCollisionAngle < Math.PI * -0.25 &&
            finalCollisionAngle > Math.PI * -0.75) {
            isStanding = true;
        }
    };

    var updateCollisionPhysics = function (collisionVector, dt) {
        // this ignores wierd buggy collision when a collision vector tries
        // to push you in a direction you are already going
        if ( (collisionVector.x < 0 && velocity.x < 0) ||
             (collisionVector.x > 0 && velocity.x > 0) ) {
            return;
        }
        if ( (collisionVector.y < 0 && velocity.y < 0) ||
             (collisionVector.y > 0 && velocity.y > 0) ) {
            return;
        }
        position.x += collisionVector.x;
        position.y += collisionVector.y;
        bb.updatePosition(position);

        velocity.x = sm3.utils.absSub(velocity.x, collisionVector.x * 100);
        velocity.y = sm3.utils.absSub(velocity.y, collisionVector.y * 100);
    };

    var accelerate = function (dt, direction) {
        var realAcceleration;
        if (currentState != sm3.SmallMario.STATE.CHANGEDIRECTION &&
            Math.abs(velocity.x) > maxVelocity.run ) {
                realAcceleration = acceleration.fly;
            } else if (isFast) {
                realAcceleration = acceleration.run;
            } else {
                realAcceleration = acceleration.walk;
            }

        if (direction == sm3.LEFT) {
            velocity.x -= realAcceleration * dt;
        } else if (direction == sm3.RIGHT) {
            velocity.x += realAcceleration * dt;
        }
    };

    var decelerate = function (dt) {
        velocity.x = sm3.utils.absSub(velocity.x, acceleration.walk * dt);
        if (Math.abs(velocity.x) < 0.35) {
            velocity.x = 0;
            that.changeState(sm3.SmallMario.STATE.STOPPED);
        }
    };

    var fall = function (dt) {
        velocity.y += gravity * dt;
    };

    var jump = function (dt) {
        velocity.y = -initialJumpVelocity;
        isStanding = false;
    };

    var updatePosition = function (dt) {
        var realMaxVel;
        if (currentState == sm3.SmallMario.STATE.PREFLY ||
            currentState == sm3.SmallMario.STATE.FLY) {
            realMaxVel = maxVelocity.fly;
        } else if (isFast) {
            realMaxVel = maxVelocity.fly;
        } else {
            realMaxVel = maxVelocity.walk;
        }
        velocity.x = Math.max(-realMaxVel, Math.min(velocity.x, realMaxVel));
        velocity.y = Math.max(-maxVelocity.y, Math.min(velocity.y, maxVelocity.y));
        position.x += velocity.x * dt * 0.001;
        position.y += velocity.y * dt * 0.001;
    };

    // check flip does nothing when velocity is 0.  if you come to a stop
    // you will not flip until you move.
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

sm3.SmallMario.POWERLEVEL = {
    SMALL:0,
    BIG:1,
    RACOON:2};
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
