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

        this.getDataLayer = function (name) {
            var layerData = null;
            data.layers.forEach( function (element) {
                if (element.name == name) {
                    layerData = element.data;
                }
            });
            if (layerData) {
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
            var tileSet = null;
            data.tilesets.forEach( function (element) {
                if (element.name == "levelTiles") {
                    tileSet = element;
                }
            });
            var levelWidth = tileSet.tilewidth * tileWidth;
            var levelHeight = tileSet.tileheight * tileHeight;
            return {width:levelWidth, height:levelHeight};
        };

        this.getTileAtPos = function (position) {
            var tileX = Math.floor(position.x / tileWidth);
            var tileY = Math.floor(position.y / tileHeight);
            return {x:tileX,y:tileY};
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
    };
})();
