/*  */
sm3.StaticGeometryLayer = function (src, levelGeometry, geometryTileCoords, level) {
    "use strict";
    var mapSize = level.getMapSize();
    var tileSize = level.getTileSize();
    var screenTiles = {width : sm3.ctx.canvas.width / level.getTileSize().width,
                    height : sm3.ctx.canvas.width / level.getTileSize().height};
    sm3.Entity.call(this, "./images/levelTiles.png", 0, null);
    var image = this.getImage();
    this.render = function (cameraPos) {
        var topLeftCornerTile = level.getTileAtPos(cameraPos);
        
        var firstColumn = Math.max(topLeftCornerTile.x - 1, 0);
        var lastColumn = Math.min(topLeftCornerTile.x + screenTiles.width + 1, mapSize.width);
        
        var firstRow = Math.max(topLeftCornerTile.y - 1, 0);
        var lastRow = Math.min(topLeftCornerTile.y + screenTiles.height + 1, mapSize.height);
        
        for (var row = firstRow; row <= lastRow; row++) {
            for (var column = firstColumn; column <= lastColumn; column++) {
                var tile = levelGeometry[row][column];
                if (tile === 0) {
                    continue;
                } else {
                    "foo";
                }
                var screenX = column * tileSize.width - cameraPos.x;
                var screenY = row * tileSize.height - cameraPos.y;
                var tileCoords = geometryTileCoords[tile];

                sm3.ctx.drawImage(image,
                              tileCoords.x,
                              tileCoords.y,
                              tileCoords.width,
                              tileCoords.height,
                              screenX,
                              screenY,
                              tileCoords.width,
                              tileCoords.height);
            }
        }
    };
};