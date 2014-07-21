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
            var frameDelay = newFrameDelay; // frame delay in milliseconds. 0 will not animate
            var animations = []; // should contain anim objects
            var frameSize = newFrameSize;
            var animFrameChangeCount = 0;
            var currentAnim = {};
            this.addAnim = function (anim) {
                animations.push(anim);
            };
            this.update = function () {
                console.log("Update should be overwritten in the child class");
            };
            this.render = function () {
                console.log("Render should be overwritten in the child class");
            };
            this.animate = function (dt) {
                animFrameChangeCount += dt;
                while (animFrameChangeCount > frameDelay) {
                    animFrameChangeCount -= frameDelay;
                    currentFrame++;
                    if (currentFrame >= currentAnim.playOrder.length) {
                        currentFrame = 0;
                    }
                }
            };
            this.changeAnim = function (newAnim) {
                currentFrame = 0;
                animFrameChangeCount = 0;
                var index = 0;
                var found = false;
                do {
                    if (animations[index].name == newAnim) {
                        found = true;
                        break;
                    }
                    index++;
                } while (index < animations.length);
                if (found === true) {
                    currentAnim = animations[index];
                } else {
                    console.log("Error " + newAnim + " not found!");
                }
            };
            this.displayAnim = function (dx, dy) {
                var myFrame = currentAnim.playOrder[currentFrame];
                var sx = currentAnim.frames[myFrame].x;
                var sy = currentAnim.frames[myFrame].y;
                ctx.drawImage(image,
                              sx,
                              sy,
                              frameSize.width,
                              frameSize.height,
                              dx,
                              dy,
                              frameSize.width,
                              frameSize.height);
            };
        }

        /* A single animation.  Which animation is playing will change based on an entities state machine.
         @name - animation name
         @frames - [{x:0,y:0},{x:0,y:0},{x:0,y:0}] - array of position vectors from the source image
         @playOrder - [0,1,2,3,2,1,0] - animation frame sequence */
        function Anim (name, frames, playOrder) {
            this.name = name;
            this.frames = frames;
            this.playOrder = playOrder;
        }

        function StartMenu () {
            Entity.call(this, "./images/mainMenu.png", 0, {width:400,height:120});
            this.addAnim(new Anim("Start",[{x:0,y:0}],[0]));
            this.addAnim(new Anim("Match",[{x:400,y:0}],[0]));
            this.changeAnim("Start");
            var START = 0;
            var MATCH = 1;
            var currentState = START;
            this.update = function () {
                switch(currentState) {
                case START:
                    if (input.getPressed(Input.DOWN) || input.getPressed(Input.SELECT)) {
                        this.changeAnim("Match");
                        currentState = MATCH;
                    }
                    if (input.getPressed(Input.JUMP) || input.getPressed(Input.START)) {
                        console.log("start game!");
                    }
                    break;
                case MATCH:
                    if (input.getPressed(Input.UP) || input.getPressed(Input.SELECT)) {
                        this.changeAnim("Start");
                        currentState = START;
                    }
                    if (input.getPressed(Input.JUMP) || input.getPressed(Input.START)) {
                        console.log("match game!");
                    }
                    break;
                }
            };
            this.render = function () {
                this.displayAnim(300, 620);
            };
        }

        function FlashingTitle () {
            Entity.call(this, "./images/flashingTitle3.png", 120, {width:170,height:177});
            this.addAnim(new Anim("Flash",
                                  [{x:0,y:0},
                                   {x:170,y:0},
                                   {x:340,y:0},
                                   {x:510,y:0}],
                                  [0,1,2,3,2,1])
                        );
            this.changeAnim("Flash");
            this.update = function (dt) {
                this.animate(dt);
            };
            this.render = function () {
                this.displayAnim(450, 440);
            };
        }

        function TitleScreen () {
            game.setBackgroundLayer(new BackgroundLayer("./images/titleScreenBackground.png"));
            game.createEntity(new StartMenu());
            game.createEntity(new FlashingTitle());
        }

        function Input() {
            var keyPress = {};
            var keyHeld = {};
            var bindings = {};

            this.getPressed = function (action) {
                if (keyPress[action]) {
                    keyPress[action] = false;
                    return true;
                }
                return false;
            };
            this.getHeld = function (action) {
                if (keyHeld[action]) {
                    return true;
                }
                return false;
            };
            this.bindKey = function (key, action) {
                bindings[key] = action;
            };
            var keyDown = function (event) {
                var action = bindings[event.keyCode];
                // if (action) verifies the action exists and === 0 is just an edgecase where it is 0
                if (action || action === 0) {
                    keyPress[action] = true;
                    keyHeld[action] = true;
                }
                event.stopPropagation();
                event.preventDefault();
            };
            var keyUp = function (event) {
                var action = bindings[event.keyCode];
                if (action || action === 0) {
                    keyPress[action] = false;
                    keyHeld[action] = false;
                }
                event.stopPropagation();
                event.preventDefault();
            };
            window.addEventListener('keydown', keyDown.bind(this), false);
            window.addEventListener('keyup', keyUp.bind(this), false);
        }
        Input.KEY = {'LEFT_ARROW':37,
                               'UP_ARROW':38,
                               'RIGHT_ARROW':39,
                               'DOWN_ARROW':40,
                               'CTRL':17,
                               'ALT':18,
                               'W':87,
                               'A':65,
                               'S':83,
                               'D':68,
                               'COMMA':188,
                               'PERIOD':190,
                               'OPEN_BRACKET':219,
                               'CLOSE_BRACKET':221
                              };
        Input.UP = 0;
        Input.LEFT = 1;
        Input.DOWN = 2;
        Input.RIGHT = 3;
        Input.JUMP = 4;
        Input.ACTION = 5;
        Input.SELECT = 6;
        Input.START = 7;

        var input = new Input();
        input.bindKey(Input.KEY.W, Input.UP);
        input.bindKey(Input.KEY.A, Input.LEFT);
        input.bindKey(Input.KEY.S, Input.DOWN);
        input.bindKey(Input.KEY.D, Input.RIGHT);
        input.bindKey(Input.KEY.COMMA, Input.ACTION);
        input.bindKey(Input.KEY.PERIOD, Input.JUMP);
        input.bindKey(Input.KEY.OPEN_BRACKET, Input.SELECT);
        input.bindKey(Input.KEY.CLOSE_BRACKET, Input.START);

        var game = new Game();
        game.loadLevel(game.TITLESCREEN);

    });
