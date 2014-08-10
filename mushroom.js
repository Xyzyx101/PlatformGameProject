sm3.Mushroom = function (initialPosition, level, type, initFlip) {
    "use strict";
    var that = this;
    var frameSize = {width:64,height:64};
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    this.getType = function () {
        switch(type) {
        case sm3.Mushroom.TYPE.SUPERMUSHROOM:
            return sm3.GameLevel.ENTITYTYPE.SUPERMUSHROOM;
            break;
        case sm3.Mushroom.TYPE.UPMUSHROOM:
            return  sm3.GameLevel.ENTITYTYPE.UPMUSHROOM;
            break;
        default:
            return null;
            console.log("Error unkown type in sm3.Mushroom");
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
    sm3.Entity.call(this, "./images/CoinsBlocksPowerUps.png", 0, frameSize);

    this.addAnim(new sm3.Anim("SuperMushroom",
                              [{x:0, y:frameSize.height * 2}],
                              [0])
                );
    this.addAnim(new sm3.Anim("UpMushroom",
                              [{x:0, y:frameSize.height * 3}],
                              [0])
                );
    switch(type) {
    case sm3.Mushroom.TYPE.SUPERMUSHROOM:
        this.changeAnim("SuperMushroom");
        break;
    case sm3.Mushroom.TYPE.UPMUSHROOM:
        this.changeAnim("UpMushroom");
        break;
    default:
        console.log("Unknown mushroom type");
    }

    this.hit = function () {
        level.destroy(this);
    };

    var velocity = {x:100, y:0};
    if (initFlip) {
        velocity.x *= -1;
    }
    var maxVelocity = {x:200, y:800};
    var acceleration = 25;
    var gravity = 2.4;
    this.update = function (dt) {
        velocity.x += acceleration;
        velocity.y += gravity * dt;
        if ( detectWall() ) {
            acceleration *= -1;
        }
        velocity.x = Math.max(-maxVelocity.x, Math.min(velocity.x, maxVelocity.x));
        velocity.y = Math.max(-maxVelocity.y, Math.min(velocity.y, maxVelocity.y));
        position.x += velocity.x * dt * 0.001;
        position.y += velocity.y * dt * 0.001;
        bb.updatePosition(position);
    };

    this.render = function (cameraOffset) {
        this.displayAnim(position.x - cameraOffset.x, position.y - cameraOffset.y);
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
        default:
            console.log("Error in PowerUp.resolveStaticCollisions() Unknown tile type");
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

sm3.Mushroom.TYPE = {SUPERMUSHROOM:0,
                     UPMUSHROOM:1};
