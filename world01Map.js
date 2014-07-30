(function () {
    "use strict";
    sm3.World01Map = function () {
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/world_01_map_base.png"));

        var mapData = [3, 3, 3, 11, 1, 1, 1, 12, 1, 13, 1, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 14, 1, 17, 3, 3, 3, 3, 3, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 18, 3, 3, 0, 0, 0, 3, 3, 0, 0, 1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 17, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 15, 1, 1, 1, 16, 0, 0, 0, 0, 0, 3];

        // in pixels
        var TILEWIDTH = 70;
        var TILEHEIGHT = 64;

        // in tiles
        var MAPWIDTH = 14;
        var MAPHEIGHT = 9;
        var levelObjects = [];
        for (var i = 0; i < MAPWIDTH; i++) {
            levelObjects[i] = [];
        }

        var EDGEOFFSET = {x:22, y:20};

        for (var i = 0; i < mapData.length; i++) {
            var tileX = i % MAPWIDTH;
            var tileY = Math.floor(i / MAPWIDTH);

            switch (mapData[i]) {
            case sm3.World01Map.LEVELS.EMPTY:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapObject(sm3.World01Map.LEVELS.EMPTY,
                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.PATH:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapObject(sm3.World01Map.LEVELS.PATH,
                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.TREE:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapObject(sm3.World01Map.LEVELS.TREE,
                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.LEVEL01:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL01,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
{left:true,right:true,top:true,bottom:true}));// FIX ME                                        {left:false,right:false,top:false,bottom:true}));
                break;
            case sm3.World01Map.LEVELS.LEVEL02:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL02,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
 {left:true,right:true,top:true,bottom:true}));// FIX ME                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL03:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL03,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL04:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL04,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL05:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL05,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                        {left:false,right:false,top:true,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL06:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL06,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.TOADSHOUSE:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapMiniGame(sm3.World01Map.LEVELS.TOADSHOUSE,
                                        {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                        {left:false,right:false,top:true,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.SPINMINIGAME:
                levelObjects[tileX][tileY] = sm3.game.createEntity(new sm3.MapMiniGame(sm3.World01Map.LEVELS.SPINMINIGAME,
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
            var currentTileType = levelObjects[currentPosition.x][currentPosition.y].getType();
            var targetTileType = levelObjects[targetPosition.x][targetPosition.y].getType();

            // Current tile type > 10 is a level tile.  if you are standing on a level then
            //  the direction you can move to depends on the level being completed
            if (currentTileType > 10) {
                var openSides = levelObjects[currentPosition.x][currentPosition.y].getOpenSides();
                var passable = currentPosition.x < targetPosition.x && openSides.right ||
                            currentPosition.x > targetPosition.x && openSides.left ||
                            currentPosition.y < targetPosition.y && openSides.bottom ||
                            currentPosition.y > targetPosition.y && openSides.top;
                if (targetTileType ==  sm3.World01Map.LEVELS.PATH && passable) {
                    return getPixelPosition(targetPosition);
                } else {
                    return null;
                }
            } else {
                if (targetTileType ==  sm3.World01Map.LEVELS.PATH) {
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
            case sm3.World01Map.LEVELS.LEVEL01:
                sm3.game.loadLevel(sm3.game.LEVEL01);
                break;
            case sm3.World01Map.LEVELS.LEVEL02:
                //start level 2
                break;
            case sm3.World01Map.LEVELS.LEVEL03:
                //start level 3
                break;
            case sm3.World01Map.LEVELS.LEVEL04:
                //start level 4
                break;
            case sm3.World01Map.LEVELS.LEVEL05:
                //start level 5
                break;
            case sm3.World01Map.LEVELS.LEVEL06:
                //start level 6
                break;
            case sm3.World01Map.LEVELS.TOADSHOUSE:
                sm3.game.loadLevel(sm3.game.TOADSHOUSE);
                break;
            case sm3.World01Map.LEVELS.SPINMINIGAME:
                sm3.game.loadLevel(sm3.game.SPINMINIGAME);
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

    // These constants are not arbitrary.  They must match the tile positions in the .json file.
    sm3.World01Map.LEVELS = {
                EMPTY:0,
                PATH:1,
                BLOCKED:2,
                TREE:3,
                LEVEL01:11,
                LEVEL02:12,
                LEVEL03:13,
                LEVEL04:14,
                LEVEL05:15,
                LEVEL06:16,
                TOADSHOUSE:17,
                SPINMINIGAME:18
                };
})();