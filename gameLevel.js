/* This is all of common level code.  It is mostly the importer for tiled files */
(function () {
    "use strict";
    sm3.GameLevel = function (data) {
        var mapWidth = data.width;
        var mapHeight = data.height;
        this.getMapSize = function () {
            return {width:mapWidth, height:mapHeight};
        };

        var tileWidth = data.tilewidth;
        var tileHeight = data.tileheight;
        this.getTileSize = function () {
            return {width:tileWidth, height:tileHeight};
        };

        var mapWidthPixels = mapWidth * tileWidth;
        var mapHeightPixels = mapHeight * tileHeight;
        this.getMapPixelSize = function () {
            return {width:mapWidthPixels,height:mapHeightPixels};
        };

        this.getDataLayer = function (layerName, tilesetName) {
            var layerData = null;
            data.layers.forEach( function (element) {
                if (element.name == layerName) {
                    layerData = element.data;
                }
            });
            // gid is from the tiled file format. All tiles on all layers have a global id.
            // I want them to be constant and all layers to start counting at one. 0 == no tile
            var firstGID = null;
            data.tilesets.forEach( function (element) {
                if (element.name == tilesetName) {
                    firstGID = element.firstgid;
                }
            });

            if (layerData) {
                layerData = stripGID(firstGID, layerData);
                return convertTo2DArray(layerData);
            } else {
                console.log("Data layer " + name + " not found");
                return null;
            }
        };

        this.getTiles = function (levelGeometry, tileSet) {
            var coordMap = {};
            for (var column = 0; column < mapWidth; column++) {
                for (var row = 0; row < mapHeight; row++) {
                    var tile = levelGeometry[row][column];
                    if (tile !== 0) {
                        coordMap[tile] = getTileCoords(tile, tileSet);
                    }
                }
            }
            return coordMap;
        };

        this.getLevelSize = function () {
            return {width: mapWidth * tileWidth, height: mapHeight * tileHeight};
        };

        this.getTileAtPos = function (position) {
            var tileX = Math.floor(position.x / tileWidth);
            var tileY = Math.floor(position.y / tileHeight);
            return {x:tileX,y:tileY};
        };

        this.buildStaticBBArray = function (staticCollisionData) {
            var bbArray = [];
            for (var row = 0; row < staticCollisionData.length; row++) {
                bbArray[row] = [];
                for (var col = 0; col < staticCollisionData[0].length; col++) {
                    switch (staticCollisionData[row][col]) {
                    case sm3.CollisionSystem.COLLISIONTILES.EMPTY:
                        bbArray[row][col] = null;
                        break;
                    case sm3.CollisionSystem.COLLISIONTILES.SOLID:
                        bbArray[row][col] = createBB(row, col);
                        break;
                    case sm3.CollisionSystem.COLLISIONTILES.TOPONLY:
                        bbArray[row][col] = createBB(row, col);
                        break;
                    case sm3.CollisionSystem.COLLISIONTILES.DEATH:
                        bbArray[row][col] = createBB(row, col);
                        break;
                    default:
                        console.log("Error in buildStaticBBArray - unknown tiletype");
                    }
                }
            }
            return bbArray;
        };

        var createBB = function (row, col) {
            var position = {x:col * tileWidth, y:row * tileHeight};
            var tileSize = {width:tileWidth, height:tileHeight};
            var bbSize = tileSize;
            var offset = {x:0, y:0};
            return new sm3.BoundingBox(position, tileSize, bbSize, offset);
        };

        var getTileCoords = function (tile, tileSet) {
            var margin = 0;
            var imageHeight = 0;
            var imageWidth = 0;

            data.tilesets.forEach( function (element) {
                if (element.name == tileSet) {
                    margin = element.margin;
                    imageHeight = element.imageheight;
                    imageWidth = element.imagewidth;
                }
            });
            var totalWidth = tileWidth + margin;
            var totalHeight = tileHeight + margin;
            var leftGap = imageWidth % totalWidth;
            var effectiveWidth = imageWidth - leftGap; //this is to eliminate any junk/gap and the end of the sheet
            var xPos = tile * totalWidth % effectiveWidth - tileWidth;
            var yPos = Math.floor(tile * totalWidth / effectiveWidth) * totalHeight + margin;
            return {x:xPos, y:yPos, width:tileWidth, height:tileHeight};
        };

        var convertTo2DArray = function (dataArray) {
            var mapData = [];
            for (var i = 0; i < mapHeight; i++) {
                mapData[i] = [];
            }
            for (var element = 0; element < dataArray.length; element++) {
                var column = element % mapWidth;
                var row = Math.floor(element / mapWidth);
                mapData[row][column] = dataArray[element];
            }
            return mapData;
        };
        var stripGID = function (firstGID, layerData) {
            for (var i = 0; i < layerData.length; i++) {
                if (layerData[i] === 0) continue;
                layerData[i] = layerData[i] - firstGID + 1; // +1 because 0 == no tile
            }
            return layerData;
        };
    };
    // These types need to match up to the entity tiles layer from the tiled map
    sm3.GameLevel.ENTITYTYPE = {
        COIN:1,
        COINBLOCK:2,
        LEAFBLOCK:3,
        GOOMBA:4,
        KOOPA:5,
        FLYINGGOOMBA:6,
        FLYINGKOOPA:7,
        SUPERMUSHROOM:8,
        UPMUSHROOM:9,
        MARIO:9999
    };
})();
