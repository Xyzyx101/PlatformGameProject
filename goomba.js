sm3.Goomba = function (initialPosition, level, type) {
    "use strict";
    var that = this;
    var frameSize = {width:64,height:64};
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    this.getType = function () {
        switch(type) {
        case sm3.Goomba.TYPE.GOOMBA:
            return sm3.GameLevel.ENTITYTYPE.GOOMBA;
            break;
        case sm3.Goomba.TYPE.DARKGOOMBA:
            return  sm3.GameLevel.ENTITYTYPE.DARKGOOMBA;
            break;
        default:
            return null;
            console.log("Error unkown type in sm3.Goomba");
        }
    };
    this.getInteractsWithList = function () {
        return null;
    };
    this.interactsWithStaticGeometry = function () {return true;};

    var bbSize = {width:48, height:48};
    var bbOffset = {x:8, y:16};
    var bb = new sm3.BoundingBox(position, frameSize, bbSize, bbOffset);
    this.getBoundingBox = function () {
        return bb;
    };
    sm3.Entity.call(this, "./images/goomba.png", 300, frameSize);

    var spriteRow;
    if (type == sm3.Goomba.TYPE.GOOMBA) {
        spriteRow = 0;
    } else if (type == sm3.Goomba.TYPE.DARKGOOMBA) {
        spriteRow = 1;
    }
    this.addAnim(new sm3.Anim("Walk",
                              [{x:0, y:frameSize.height * spriteRow},
                               {x:frameSize.width, y:frameSize.height * spriteRow}],
                              [0,1])
                );
    this.addAnim(new sm3.Anim("Squish",
                              [{x:frameSize.width * 2, y:frameSize.height * spriteRow}],
                              [0])
                );

    this.stomp = function () {
        this.changeState(sm3.Goomba.STATE.SQUISH);
    };
    this.hit = function () {
        this.changeState(sm3.Goomba.STATE.FLIP);
    };

    var velocity = {x:-50, y:0};

    var maxVelocity = {x:100, y:800};
    var acceleration = -25;
    var gravity = 2.4;
    var deathTimer = 0;
    var deathTimerTarget = 2000;
    var currentState = null;
    this.getState = function () {
        return currentState;
    };
    this.update = function (dt) {
        switch(currentState) {
        case sm3.Goomba.STATE.WALK:
            velocity.x += acceleration;
            if ( detectWall() ) {
                acceleration *= -1;
            }
            velocity.x = Math.max(-maxVelocity.x, Math.min(velocity.x, maxVelocity.x));
            position.x += velocity.x * dt * 0.001;
            break;
        case sm3.Goomba.STATE.SQUISH:
            deathTimer += dt;
            if (deathTimer > deathTimerTarget) {
                level.destroy(this);
            }
            break;
        case sm3.Goomba.STATE.FLIP:
            deathTimer += dt;
            if (deathTimer > deathTimerTarget) {
                level.destroy(this);
            }
        default:
            console.log("unknown goomba state");
        }
        velocity.y += gravity * dt;
        velocity.y = Math.max(-maxVelocity.y, Math.min(velocity.y, maxVelocity.y));
        position.y += velocity.y * dt * 0.001;
        bb.updatePosition(position);
        this.animate(dt);
    };

    this.render = function (cameraOffset) {
        if (currentState == sm3.Goomba.STATE.FLIP) {
            sm3.ctx.save();
            sm3.ctx.scale(1, -1);
            this.displayAnim( -(position.x - cameraOffset.x),
                              position.y - cameraOffset.y + frameSize.height);
            sm3.ctx.restore();
        } else {
            this.displayAnim(position.x - cameraOffset.x, position.y - cameraOffset.y);
        }
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
            level.destroy(this);
            break;
        default:
            console.log("Error in PowerUp.resolveStaticCollisions() Unknown tile type");
        }
    };

    this.changeState = function (newState) {
        currentState = newState;
        switch(newState) {
        case sm3.Goomba.STATE.WALK:
            this.changeAnim("Walk");
            break;
        case sm3.Goomba.STATE.SQUISH:
            this.changeAnim("Squish");
            break;
        case sm3.Goomba.STATE.FLIP:

            break;
        default:
            console.log("unknown goomba state");
        }
    };
    this.changeState(sm3.Goomba.STATE.WALK);
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
    var detectWall = function () {
        var testPoint;
        if (velocity.x > 0) {
            testPoint = sm3.utils.vectorAdd(bb.center, {x:bb.halfWidth + 1, y:0});
        } else {
            testPoint = sm3.utils.vectorAdd(bb.center, {x:-bb.halfWidth - 1, y:0});
        }
        var testTile = level.getTileAtPos(testPoint);
        return level.getTileType(testTile.y, testTile.x) == sm3.CollisionSystem.COLLISIONTILES.SOLID;
    };
};

sm3.Goomba.TYPE = {GOOMBA:0,
                   DARKGOOMBA:1
                  };
sm3.Goomba.STATE = {WALK:0,
                    SQUISH:1,
                    FLIP:2
                   };
