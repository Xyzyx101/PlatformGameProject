/* The world map is a level that you can interact with.  The map is different from other levels because
 it is also stored as the current world on the game object.  This allows the map state to persist
 even when you load a new game level or minigame.
 */

(function () {
    "use strict";
    sm3.World01Map = function () {

        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/world_01_map_base.png"));
        sm3.soundManager.loadAudio("smb3_map_new_world", 1);
        sm3.soundManager.loadAudio("smb3_enter_level", 1);
        sm3.soundManager.loadAudio("smb3_level_clear", 1);

        var persistantWorld = sm3.game.getWorld();
        // If the current game world is a World01Map then return the saved map state rather than create a new one.
        if (persistantWorld && persistantWorld.__proto__.constructor == sm3.World01Map) {
            persistantWorld.restartTheWorld();
            return persistantWorld;
        }

        var mapData = [3, 3, 3, 11, 1, 1, 1, 12, 1, 13, 1, 1, 3, 3, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 3, 1, 3, 3, 1, 1, 1, 1, 3, 3, 3, 1, 1, 14, 1, 17, 3, 3, 3, 3, 3, 0, 3, 3, 3, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 1, 1, 1, 1, 18, 3, 3, 0, 0, 0, 3, 3, 0, 0, 1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 1, 0, 17, 1, 1, 1, 1, 1, 1, 0, 3, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 15, 1, 1, 1, 16, 0, 0, 0, 0, 0, 3];

        // in pixels
        var TILEWIDTH = 70;
        var TILEHEIGHT = 64;

        // in tiles
        var MAPWIDTH = 14;
        var MAPHEIGHT = 9;
        var mapObjects = [];
        for (var column = 0; column < MAPWIDTH; column++) {
            mapObjects[column] = [];
        }

        var EDGEOFFSET = {x:22, y:20};

        for (var i = 0; i < mapData.length; i++) {
            var tileX = i % MAPWIDTH;
            var tileY = Math.floor(i / MAPWIDTH);

            switch (mapData[i]) {
            case sm3.World01Map.LEVELS.EMPTY:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapObject(sm3.World01Map.LEVELS.EMPTY,
                                                                                     {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.PATH:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapObject(sm3.World01Map.LEVELS.PATH,
                                                                                     {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.TREE:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapObject(sm3.World01Map.LEVELS.TREE,
                                                                                     {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y}));
                break;
            case sm3.World01Map.LEVELS.LEVEL01:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL01,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:true,right:true,top:true,bottom:true}));// FIX ME                                        {left:false,right:false,top:false,bottom:true}));
                break;
            case sm3.World01Map.LEVELS.LEVEL02:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL02,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:true,right:true,top:true,bottom:true}));// FIX ME                                        {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL03:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL03,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL04:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL04,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL05:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL05,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:false,right:false,top:true,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.LEVEL06:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.LEVEL06,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:true,right:false,top:false,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.TOADSHOUSE:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.TOADSHOUSE,
                                                                                    {x : tileX * TILEWIDTH + EDGEOFFSET.x, y : tileY * TILEHEIGHT + EDGEOFFSET.y},
                                                                                    {left:false,right:false,top:true,bottom:false}));
                break;
            case sm3.World01Map.LEVELS.SPINMINIGAME:
                mapObjects[tileX][tileY] = sm3.game.registerEntity(new sm3.MapLevel(sm3.World01Map.LEVELS.SPINMINIGAME,
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
            var currentTileType = mapObjects[currentPosition.x][currentPosition.y].getType();
            var targetTileType = mapObjects[targetPosition.x][targetPosition.y].getType();

            // Current tile type > 10 is a level tile.  if you are standing on a level then
            //  the direction you can move to depends on the level being completed
            if (currentTileType > 10) {
                var openSides = mapObjects[currentPosition.x][currentPosition.y].getOpenSides();
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

        var activeLevel = null;
        // attempt to start level
        this.enterLevel = function (mapPosition) {
            activeLevel = mapPosition;
            var targetLevelState = mapObjects[mapPosition.x][mapPosition.y].getState();
            if ( targetLevelState &&
                 (targetLevelState == sm3.MapLevel.STATE.COMPLETENORMAL ||
                  targetLevelState == sm3.MapLevel.STATE.COMPLETEFLIPPED) ) {
                console.log("Level already complete");
                activeLevel = null;
                return;
            }
            var tileType = mapObjects[mapPosition.x][mapPosition.y].getType();
            sm3.soundManager.play("smb3_enter_level");
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
            default:
                activeLevel = null;
                console.log("Nothing to enter");
            }
        };

        //pass in a map position of form {x:0,y:0} and get back the pixel position of the tile
        function getPixelPosition(mapPosition) {
            return {x:mapPosition.x * TILEWIDTH + EDGEOFFSET.x, y:mapPosition.y * TILEHEIGHT + EDGEOFFSET.y};
        }

        //DELETEME
        //pass in mapTile {x:0,y:0} and gets tile type back
        function getMapData(mapTile) {
            return mapData[mapTile.y * MAPWIDTH + mapTile.x];
        }

        var initialMapPosition = {x:1,y:2};
        var mario = sm3.game.registerEntity(new sm3.MarioMap(
            getPixelPosition(initialMapPosition),
            sm3.MarioMap.CHARACTERSTATE.SMALL,
            initialMapPosition
        ));
        this.restartTheWorld = function () {
            sm3.soundManager.play("smb3_map_new_world");
            for (var column = 0; column < MAPWIDTH; column++) {
                for (var row = 0; row < MAPHEIGHT; row++) {
                    sm3.game.registerEntity(mapObjects[column][row]);
                }
            }
            sm3.game.registerEntity(mario);
        };
        this.completeActiveLevel = function () {
            sm3.soundManager.play("smb3_level_clear");
            mapObjects[activeLevel.x][activeLevel.y].changeState(sm3.MapLevel.STATE.COMPLETENORMAL);
        };
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