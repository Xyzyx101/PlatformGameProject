 /*
 */
(function () {
    sm3.Level1_1 = function () {
        "use strict";
        sm3.GameLevel.call(this, sm3.Level1_1.data);
        sm3.game.registerEntity(this);
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer(null,{r:156, g:252, b:240} ));

        var levelSize = this.getLevelSize();
        var levelGeometry = this.getDataLayer("geometry");

        /* geometryTileCoords is a associative map of tile data to tile sheet screen coords */
        var geometryTileCoords = this.getTiles(levelGeometry, "levelTiles");
        var staticGeometryLayer = new sm3.StaticGeometryLayer("./images/levelTiles.png",
                                                              levelGeometry,
                                                              geometryTileCoords,
                                                              this
                                                              );
        var staticCollision = this.getDataLayer("collision");
        var mario = sm3.game.registerEntity(new sm3.SmallMario({x:256,y:1600}));

        var groundLimit = 1728; //this is the bottom limit the camera will show
        var camera = new sm3.Camera(mario, levelSize, groundLimit);

        this.update = function (dt) {
            //TODO collision.update();
            var cameraPos = camera.updateView();
            mario.setCameraOffset(cameraPos);
            //TODO camera.updateActiveEntities();
        };
        this.render = function () {
            var cameraPos = camera.getCameraPos();
            staticGeometryLayer.render(cameraPos);
            
        };

    };
})();