/* A system for detecting collisions.  The active collider and passive collider list is built every tick
 * as a rough pass.  Collisions are only checked on objects on the screen.
 * It builds a list of collisions and passes them back to the active game entity to perform
 * collision resolution */

sm3.CollisionSystem = function () {
    // Active colliders are game objects that need to test for collision (mario and enemies)
    //  Two active colliders can collide with eachother.
    var activeColliders = [];
    this.addActiveCollider = function (collider) {
        activeColliders.push(collider);
    };

    // Passive colliders are objects that active colliders need to test against but will
    //  never collide with anything on their own like blocks and game geometry
    var passiveColliders = [];
    this.addPassiveCollider = function (type, bb) {
        passiveColliders.push({type:type, bb:bb});
    };
    this.clearColliderLists = function () {
        passiveColliders = [];
        activeColliders = [];
    };

    var collisions = [];
    this.detectCollisions = function (dt) {
        activeColliders.forEach(function (element) {
            collisions = [];
            //checkActiveCollisions(element);
            //element.resolveActiveCollisions(collisions);
            collisions = [];
            checkStaticCollision(element, dt);
            if (collisions.length) {
                //element.resolveStaticCollisions(collisions);
            }
        });
    };

    var checkStaticCollision = function (firstElement, dt) {
        // note this assumes only aabb are allowed.  If I add slopes in the future this will need to change.
        var bb = firstElement.getBoundingBox();
        var axisProjX = new sm3.AxisProjection(bb.center.x - bb.halfWidth,
                                               bb.center.x + bb.halfWidth);
        var axisProjY = new sm3.AxisProjection(bb.center.y - bb.halfHeight,
                                               bb.center.y + bb.halfHeight);
        passiveColliders.forEach(function (secondElement) {
            var targetBB = secondElement.bb;
            var targetAxisProjX = new sm3.AxisProjection(targetBB.center.x - targetBB.halfWidth,
                                                         targetBB.center.x + targetBB.halfWidth);
            var targetAxisProjY = new sm3.AxisProjection(targetBB.center.y - targetBB.halfHeight,
                                                         targetBB.center.y + targetBB.halfHeight);
            if (overlap(axisProjX, targetAxisProjX) &&
                overlap(axisProjY, targetAxisProjY)) {

                var xOverlap = bb.halfWidth + targetBB.halfWidth - Math.abs(bb.center.x - targetBB.center.x);
                var yOverlap = bb.halfHeight + targetBB.halfHeight - Math.abs(bb.center.y - targetBB.center.y);
                var collisionVector = {};

                if (Math.abs(xOverlap) > Math.abs(yOverlap)) {
                    if (bb.center.y < targetBB.center.y) {
                        collisionVector = {x: 0, y: -yOverlap};
                    } else {
                        collisionVector = {x: 0, y: yOverlap};
                    }
                } else {
                    if(bb.center.x < targetBB.center.y) {
                        collisionVector = {x: -xOverlap, y: 0};
                    } else {
                        collisionVector = {x: xOverlap, y: 0};
                    }
                 }

                var collision = new sm3.Collision(secondElement.type, collisionVector);
                firstElement.resolveStaticCollision(collision, dt);
                //collisions.push(collision);
            }
        });
    };

    // pass in two objects of type sm3.AxisProjection and returns true if they overlap
    var overlap = function (projA, projB) {
        if (projA.min > projB.max ||
            projA.max < projB.min) {
            return false;
        }
        return true;
    };

};

// These are not arbitrary and must match the tilemap!
sm3.CollisionSystem.COLLISIONTILES = {EMPTY:0,
                                      SOLID:1,
                                      TOPONLY:2};

/* a bounding box object that should be a property of anything affected by the collision system
 * @param position is pixel space position of the top left corner {x:0, y:0}
 * @param tileSize {width:0, height:0} is the full size of the object
 * @param bbSize {width:0, height:0} is the size of the bounding box
 * @param offset is the pixel offset compared to the tile {x:0, y:0}
 * @param axes - TODO - for now the collision detection only check x and y axes.  If
 * I add slopes I can use this property to cache the axes that need to be checked */
sm3.BoundingBox = function (position, tileSize, bbSize, offset, axes) {
    var internalCenterX = offset.x + (bbSize.width * 0.5);
    var internalCenterY = offset.y + (bbSize.height * 0.5);
    this.halfWidth = bbSize.width * 0.5;
    this.halfHeight = bbSize.height * 0.5;
    this.updatePosition = function (position) {
        this.center = {x: position.x + internalCenterX, y: position.y + internalCenterY};
    };
    this.updatePosition(position);
};

/* Contains the minimum and max values of an object projected onto an axis */
sm3.AxisProjection = function (min, max) {
    this.min = min;
    this.max = max;
};

/* There is one Collision object created for each object that a game entity is colliding with.
 * @param objectType should be a constant from sm3.ObjectTypes
 * @parama collisionVector should be a normalized vector in the form {x:0, y:0} */
sm3.Collision = function (objectType, collisionVector) {
    this.type = objectType;
    this.collisionVector = collisionVector;
};