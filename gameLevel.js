(function () {
    "use strict";
    sm3.GameLevel = function (data) {
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
            }
        };
        this.getTiles = function (levelGeometry, tileSet) {
            var mapWidth = data.width;
            var mapHeight = data.height;
            var coordMap = {};
            for (var column = 0; column < mapWidth; column++) {
                for (var row = 0; row < mapHeight; row++) {
                    var tile = levelGeometry[row][column];
                    coordMap[tile] = getTileCoords(tile, tileSet);
                }
            }
            return coordMap;
        };
                
        var getTileCoords = function (tile, tileSet) {
            var tileHeight = data.tileheight;
            var tileWidth = data.tilewidth;
            var margin = 0;
            var imageHeight = 0;
            var imageWidth = 0;
            
            if (tile != 0) {
                "DeleteME";
            }
            
            data.tilesets.forEach( function (element) {
                    if (element.name == tileSet) {
                        margin = element.margin;
                        imageHeight = element.imageheight;
                        imageWidth = element.imagewidth;
                    }
                });
            var totalWidth = tileWidth + margin;
            var totalHeight = tileHeight + margin;
            var xPos = tile * totalWidth % imageWidth;
            var yPos = Math.floor(tile * totalHeight / imageHeight);
            return {x:xPos, y:yPos, width:tileWidth, height:tileHeight};
        };
        
        var convertTo2DArray = function (dataArray) {
            var mapWidth = data.width;
            var mapHeight = data.height;
            var mapData = [];
            for (var column = 0; column < mapWidth; column++) {
                mapData[column] = [];
            }
            for (var i = 0; i < dataArray.length; i++) {
                var tileX = i % mapWidth;
                var tileY = Math.floor(i / mapWidth);
                mapData[tileX][tileY] = dataArray[i];
            }
            return mapData;
        };
        
    };
})();