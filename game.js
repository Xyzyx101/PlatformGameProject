(function () {
    "use strict";   
    sm3.game = (function () {
        function Game () {
            this.TITLESCREEN = 0;
            this.WORLD01MAP = 1;
            this.LEVEL01 = 2;
            this.MINIGAME = 3;
            var gameState = null;
            var backgroundLayer = null;
            var resources = [];
            var currentLevel = null;
            var currentWorld = null;
            var levelSize = {width:0, height:0};
            var screenWidth = {width:1024, height:768};
            var frameRequestId;
            var entities = [];
            
            this.loadLevel = function (gameState) {
                killTick();
                backgroundLayer = null;
                entities = [];
                resources = [];
                switch(gameState) {
                case this.TITLESCREEN:
                    gameState = this.TITLESCREEN;
                    currentLevel = new sm3.TitleScreen();
                    break;
                case this.WORLD01MAP:
                    gameState = this.WORLD01MAP;
                    currentLevel = new sm3.World01Map();
                    changeWorld(currentLevel);
                    break;
                case this.LEVEL:
                    break;
                case this.MINIGAME:
                    break;
                }

                function notLoaded (element) {
                    return element.isLoaded === false;
                }
                /* setTimeout with delay 0 is used because I don't actually want a delay.
                 * I do need to clear the call stack to allow the event loop to run my
                 * onLoad events attached to each resource.  A regular loop would block.*/
                function verifyAllResourcesLoaded () {
                    if ( resources.some(notLoaded) ) {
                         setTimeout(verifyAllResourcesLoaded, 0);
                    } else {
                        frameRequestId = window.requestAnimationFrame(tick);
                    }
                }
                setTimeout(verifyAllResourcesLoaded, 0);
            };
            this.addResource = function (newResource) {
                resources.push(newResource);
            };
            this.setBackgroundLayer = function (layer) {
                backgroundLayer = layer;
                levelSize.width = layer.width;
                levelSize.height = layer.height;
                return layer;
            };
            this.createEntity = function (entity) {
                entities.push(entity);
                return entity;
            };
            this.getWorld = function () {
                return currentWorld;
            };
            
            var lastTick = 0;
            var tick = function (tickTime) {
                var dt = tickTime - lastTick;
                update(dt);
                render();
                lastTick = tickTime;
                frameRequestId = window.requestAnimationFrame(tick);
            };

            var update = function (dt) {
                entities.forEach( function(element) {
                    element.update(dt);
                });
            };

            var render = function () {
                backgroundLayer.render();
                entities.forEach( function(element) {
                    element.render();
                });
            };

            var killTick = function () {
                if (frameRequestId) {
                    window.cancelAnimationFrame(frameRequestId);
                }
            };
            
            var changeWorld = function (newWorld) {
                if (newWorld != currentWorld){
                    //reset world values here
                    currentWorld = newWorld;
                }
            };
        }
        return new Game();
    })();
})();