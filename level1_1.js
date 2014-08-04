/*
 */
(function () {
    sm3.Level1_1 = function () {
        "use strict";
        sm3.GameLevel.call(this, sm3.Level1_1.data);
        sm3.game.registerEntity(this);
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer(null,{r:156, g:252, b:240} ));

        var levelSize = this.getLevelSize();
        var levelGeometry = this.getDataLayer("geometry", "levelTiles");

        /* geometryTileCoords is a associative map of tile data to tile sheet screen coords */
        var geometryTileCoords = this.getTiles(levelGeometry, "levelTiles");
        var staticGeometryLayer = new sm3.StaticGeometryLayer("./images/levelTiles.png",
                                                              levelGeometry,
                                                              geometryTileCoords,
                                                              this
                                                             );
        var staticCollisionData = this.getDataLayer("collision", "collision");
        var staticBBoxes = this.buildStaticBBArray(staticCollisionData);
        var collision = new sm3.CollisionSystem();

        var entities = [];
        var mario = registerEntity(new sm3.SmallMario({x:256,y:1600}));

        var groundLimit = 1728; //this is the bottom limit the camera will show
        var camera = new sm3.Camera(mario, levelSize, groundLimit);

        this.update = function (dt) {
            var cameraPos = camera.updateView();
            var screenBounds = camera.getScreenBounds();
            collision.clearColliderLists();
            entities.forEach(function (entity) {
                var entityPos = entity.getPosition();
                if (entityPos.x > screenBounds.minX &&
                    entityPos.x < screenBounds.maxX &&
                    entityPos.y > screenBounds.minY &&
                    entityPos.y < screenBounds.maxY) {
                    entity.update(dt);
                    collision.addActiveCollider(entity);
                }
            });
            var topLeftTile = this.getTileAtPos({x:screenBounds.minX, y:screenBounds.minY});
            var botRightTile = this.getTileAtPos({x:screenBounds.maxX, y:screenBounds.maxY});
            var row = topLeftTile.y;
            while (row < botRightTile.y) {
                var col = topLeftTile.x;
                while (col < botRightTile.x) {
                    var bb = staticBBoxes[row][col];
                    if (bb) {
                        collision.addPassiveCollider(bb);
                    }
                    col++;
                }
                row++;
            }
            //add passive colliders

            mario.setCameraOffset(cameraPos);
        };
        this.render = function () {
            var cameraPos = camera.getCameraPosition();
            staticGeometryLayer.render(cameraPos);
            mario.render();
        };
        function registerEntity (entity) {
            entities.push(entity);
            return entity;
        };
    };
})();