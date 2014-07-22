(function () {
    "use strict";
    sm3.World01Map = function () {
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/world_01_map_base.png"));

        var EMPTY = 0;
        var PATH = 1;
        var TREE = 3;
        // 11 = level01, 12 = Level02, 13 = level03, ..., level02 = 16;
        var mapData = [3, 3, 3, 11, 1, 1, 1, 12, 1, 13, 1, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 14, 1, 1, 3, 3, 3, 3, 3, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 0, 0, 0, 3, 3, 0, 0, 1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 15, 1, 1, 1, 16, 0, 0, 0, 0, 0, 3];
        
        // in pixels
        var TILEWIDTH = 70;
        var TILEHEIGHT = 64;
        
        // in tiles
        var MAPWIDTH = 14;
        var MAPHEIGHT = 9;
        
        for (var i = 0; i < mapData.length; i++) {
            var tileX = i % MAPWIDTH;
            var tileY = Math.floor(i / MAPWIDTH);
            
            switch (mapData[i]) {
            case EMPTY:
                break;
            case PATH:
            
                break;
            case TREE:
                //spawn tree entity
                break;
            case 11:
                //spawn level01 entity
                break;
            case 12:
            
                break;
            case 13:
            
                break;
            case 14:
            
                break;
            default:
                console.log("Unknown tile " + mapData[i] + "found at position " + i);
            }
            
            //DELETE ME
            console.log(tileX + "x, " + tileY + "y");
        }
    };
})();