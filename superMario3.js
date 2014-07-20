$(document).ready(
    function() {
        "use strict";

        var gameElement = $("#game");
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", "1024px");
        canvas.setAttribute("height", "960px");
        gameElement.append(canvas);
        //canvas.addEventListener("mousedown", mousedownHandler, false);
        var ctx = canvas.getContext("2d");

        function Game () {
            this.TITLESCREEN = 0;
            this.OVERWORLD = 0;
            this.LEVEL01 = 2;
            this.MINIGAME = 3;
            var gameState = null;
            var backgroundLayer = null;
            var resources = [];
            var currentLevel = null;
            var levelSize = {width:0, height:0};
            var screenWidth = {width:1024, height:960};
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
                    currentLevel = new TitleScreen();
                    break;
                case this.OVERWORLD:
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
                    element.update();
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
        }

        function BackgroundLayer (src) {
            this.isLoaded = false;
            var loadHandler = function () {
                 this.isLoaded = true;
            };
            var image = new Image();
            // loadHandler.bind(this) should make loadHandler run in the context
            // of this function rather than the context of image.
            image.addEventListener("load", loadHandler.bind(this), false);
            image.src = src;
            game.addResource(this);
            this.render = function () {
                ctx.drawImage(image, 0, 0);
            };
        }

        function Entity (src, newFrameDelay, newFrameSize) {
            this.isLoaded = false;
            var loadHandler = function () {
                 this.isLoaded = true;
            };
            var image = new Image();
            // loadHandler.bind(this) should make loadHandler run in the context
            // of this function rather than the context of image.
            image.addEventListener("load", loadHandler.bind(this), false);
            image.src = src;
            game.addResource(this);

            var currentFrame = 0;
            var frameDelay = 0; // frame delay in milliseconds. 0 will not animate
            var animations = []; // should contain anim objects
            var frameSize = {width:0,height:0};
            this.addAnim = function (anim) {
                animations.push(anim);
            };
            this.update = function () {
                console.log("Update should be overwritten in the child class");
            };
            this.render = function () {
                console.log("Render should be overwritten in the child class");
            };
        }

        /* A single animation.  Which animation is playing will change based on an entities state machine.
         @name - animation name
         @frames - [{x:0,y:0},{x:0,y:0},{x:0,y:0}] - array of position vectors from the source image
         @playOrder - [0,1,2,3,2,1,0] - animation frame sequence */
        function Anim (name, frames, playOrder) {

        }

        function StartMenu () {
            Entity.call(this, "./images/mainMenu.png", 150, {width:400,height:120});
            this.addAnim(new Anim("Start",{x:0,y:0},[0]));
            this.addAnim(new Anim("Match",{x:400,y:0},[0]));
            console.log(currentFrame);
        }
        //StartMenu.prototype = Object.create(Entity.prototype);

        function TitleScreen () {
            game.setBackgroundLayer(new BackgroundLayer("./images/titleScreenBackground.png"));
            var startMenu = game.createEntity(new StartMenu());

        }
        var game = new Game();
        game.loadLevel(game.TITLESCREEN);

    });
