 /*
 */
(function () {
    sm3.Level1_1 = function () {
        "use strict";
        sm3.GameLevel.call(this, sm3.Level1_1.data);
        sm3.game.registerEntity(this);
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer(null,{r:156, g:252, b:240} ));
        var levelGeometry = this.getDataLayer("geometry");
        
        /* geometryTileCoords is a associative map of tile data to tile sheet screen coords */
        var geometryTileCoords = this.getTiles(levelGeometry, "levelTiles");
        var staticGeometryLayer = new sm3.StaticGeometryLayer("./images/levelTiles.png");
        
        var staticCollision = this.getDataLayer("collision");
        
        
        
        this.update = function (dt) {
            
        };
        this.render = function () {
        
        };
    };
})();