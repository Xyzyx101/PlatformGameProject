/*
 */
(function () {
    sm3.Level1_1 = function () {
        "use strict";
        var that = this;
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
        this.getTileType = function (row, col) {
            return staticCollisionData[row][col];
        };
        var staticBBoxes = this.buildStaticBBArray(staticCollisionData);
        var collision = new sm3.CollisionSystem();

        var entities = [];
        // note that this register entity is local to the level not the global list in game.js

        var entityData = this.getDataLayer("entities", "entities");

        var groundLimit = 1728; //this is the bottom limit the camera will show
        var mario = registerEntity(new sm3.SmallMario({x:256,y:1600}));
        this.getMario = function () {
            return mario;
        };
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

            // a list of collidable tiles is created that includes every tile
            // fully on the screen plus one row and column around the screen
            var topLeftTile = this.getTileAtPos({x:screenBounds.minX, y:screenBounds.minY});
            var botRightTile = this.getTileAtPos({x:screenBounds.maxX, y:screenBounds.maxY});
            var mapSize = this.getMapSize();
            topLeftTile.x = Math.max(topLeftTile.x - 1, 0);
            topLeftTile.y = Math.max(topLeftTile.y - 1, 0);
            botRightTile.x = Math.min(botRightTile.x + 1, mapSize.width);
            botRightTile.y = Math.min(botRightTile.y + 1, mapSize.height);
            var row = topLeftTile.y;
            while (row < botRightTile.y) {
                var col = topLeftTile.x;
                while (col < botRightTile.x) {
                    var bb = staticBBoxes[row][col];
                    if (bb) {
                        var tileType = staticCollisionData[row][col];
                        collision.addPassiveCollider(tileType, bb);
                    }
                    col++;
                }
                row++;
            }
            // the collision detection module will use the active collider list created above and
            // pass the collision results back to each entity for resolution.
            collision.detectCollisions(dt);
        };
        this.render = function () {
            var cameraPos = camera.getCameraPosition();
            staticGeometryLayer.render(cameraPos);
            var screenBounds = camera.getScreenBounds();
            entities.forEach(function (entity) {
                var entityPos = entity.getPosition();
                if (entityPos.x > screenBounds.minX &&
                    entityPos.x < screenBounds.maxX &&
                    entityPos.y > screenBounds.minY &&
                    entityPos.y < screenBounds.maxY) {
                    entity.render(cameraPos);
                }
            });
        };
        this.destroy = function (entity) {
            var index = entities.indexOf(entity);
            entities.splice(index, 1);
        };
        this.registerEntity = function (entity) {
            // this function is not an error.  I need the private version so
            // I can register mario without circular dependancy issues between
            // the level, camera and mario and I also need the public property version
            registerEntity(entity);
        };
        function registerEntity (entity) {
            entities.push(entity);
            return entity;
        };
        var spawnEntityLayer = function (data) {
            var tileSize = that.getTileSize();
            for (var row = 0; row < data.length; row++) {
                for (var col = 0; col < data[0].length; col++) {
                    var spawnPosition = {x:col * tileSize.width, y:row * tileSize.height};
                    switch(data[row][col]) {
                    case sm3.GameLevel.ENTITYTYPE.COIN:
                        registerEntity(new sm3.Coin(spawnPosition, that));
                        break;
                    case sm3.GameLevel.ENTITYTYPE.COINBLOCK:
                        registerEntity(new sm3.CoinBlock(spawnPosition, that, sm3.CoinBlock.TYPE.COIN));
                        break;
                    case sm3.GameLevel.ENTITYTYPE.LEAFBLOCK:
                        registerEntity(new sm3.CoinBlock(spawnPosition, that, sm3.CoinBlock.TYPE.LEAF));
                        break;
                    case sm3.GameLevel.ENTITYTYPE.GOOMBA:
                        break;
                    default:
                    }
                }
            }
        };
        spawnEntityLayer(entityData);
    };
})();