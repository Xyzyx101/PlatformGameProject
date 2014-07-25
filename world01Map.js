(function () {
    "use strict";
    sm3.World01Map = function () {
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/world_01_map_base.png"));
        var EMPTY = 0;
        var PATH = 1;
        var TREE = 3;
        // 11 = level01, 12 = Level02, 13 = level03, ..., level06 = 16;
        var TOADSHOUSE = 17;
        var SPINGAME = 18;
        
        var mapData = [3, 3, 3, 11, 1, 1, 1, 12, 1, 13, 1, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 14, 1, 1, 3, 3, 3, 3, 3, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 3, 3, 0, 0, 0, 3, 3, 0, 0, 1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 15, 1, 1, 1, 16, 0, 0, 0, 0, 0, 3];
        
        // in pixels
        var TILEWIDTH = 70;
        var TILEHEIGHT = 64;
        
        // in tiles
        var MAPWIDTH = 14;
        var MAPHEIGHT = 9;
        
        var EDGEOFFSET = {x:22, y:20};
        var levelTiles = {};
        for (var i = 0; i < mapData.length; i++) {
            var tileX = i % MAPWIDTH;
            var tileY = Math.floor(i / MAPWIDTH);
            
            switch (mapData[i]) {
            case EMPTY:
                break;
            case PATH:
            
                break;
            case TREE:
                sm3.game.createEntity(new sm3.DancingTree({x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case 11:
                 levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL01, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:false,right:false,top:false,bottom:true}));
                break;
            case 12:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL02, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case 13:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL03, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case 14:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL04, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case 15:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL05, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:false,right:false,top:true,bottom:false}));
                break;
            case 16:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL06, 
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case 17:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapMiniGame(sm3.World01Map.LEVELS.SPINGAME,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:false,right:false,top:true,bottom:false}));
                break;
            case 18:
                levelTiles[mapData[i]] = sm3.game.createEntity(new sm3.MapMiniGame(sm3.World01Map.LEVELS.TOADSHOUSE,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}, 
                                        {left:false,right:false,top:true,bottom:false}));
                break;
            default:
                console.log("Unknown tile " + mapData[i] + " found at position " + i);
            }
        }
        // pass in a position in map tiles and returns a new position in pixels or null if the new position is blocked.
        this.checkPassable = function (currentPosition, targetPosition) {
            if (targetPosition.x < 0 ||
                targetPosition.x > MAPWIDTH ||
                targetPosition.y < 0 ||
                targetPosition.y > MAPHEIGHT) {
            return null;    
            }
            var currentTileType = getMapData(currentPosition);
            var targetTileType = getMapData(targetPosition);    
            
            // Current tile type > 10 is a level tile.  if you are standing on a level then
            //  the direction you can move to depends on the level being completed
            if (currentTileType > 10) {
                var openSides = levelTiles[currentTileType].getOpenSides();
                var passable = currentPosition.x < targetPosition.x && openSides.right ||
                            currentPosition.x > targetPosition.x && openSides.left ||
                            currentPosition.y < targetPosition.y && openSides.bottom ||
                            currentPosition.y > targetPosition.y && openSides.top;
                if (targetTileType == PATH && passable) {
                    return getPixelPosition(targetPosition);
                } else {
                    return null;
                }
            } else {
                if (targetTileType == PATH) {
                    return getPixelPosition(targetPosition);
                }
                if (targetTileType > 10) {
                    return getPixelPosition(targetPosition);
                }
            }
            return null;
        };
        
        // attempt to start level
        this.enterLevel = function (mapPosition) {
            var tileType = getMapData(mapPosition);
            switch(tileType) {
            case 11:
                //start level 1
                break;
            case 12:
                //start level 2
                break;
            case 13:
                //start level 3
                break;
            case 14:
                //start level 4
                break;
            case 15:
                //start level 5
                break;
            case 16:
                //start level 6
                break;
            case 17:
                //enter toads house
                break;
            }            
        };
        
         //pass in a map position of form {x:0,y:0} and get back the pixel position of the tile
        function getPixelPosition(mapPosition) {
            return {x:mapPosition.x * TILEWIDTH + EDGEOFFSET.x, y:mapPosition.y * TILEHEIGHT + EDGEOFFSET.y};
        }
        //pass in mapTile {x:0,y:0} and gets tile type back
        function getMapData(mapTile) {
            return mapData[mapTile.y * MAPWIDTH + mapTile.x];
        }
        var initialMapPosition = {x:1,y:2};
        sm3.game.createEntity(new sm3.MarioMap(
                            getPixelPosition(initialMapPosition),
                            sm3.MarioMap.CHARACTERSTATE.SMALL,
                            initialMapPosition
                            ));
        
    };
    sm3.World01Map.LEVELS = 
                {LEVEL01:0,
                LEVEL02:1,
                LEVEL03:2,
                LEVEL04:3,
                LEVEL05:4,
                LEVEL06:5,
                TOADSHOUSE:6,
                SPINGAME:7
                };
})();