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

            this.loadLevel = function (gameState) {
                killTick();
                this.resources = [];
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
                do {
                    //loop until all the resources are loaded
                    if (resources.length === 0) {
                        console.log("No Resources Loaded!!!");
                        break;
                    }
                } while (this.resources.some(notLoaded));
                frameRequestId = window.requestAnimationFrame(tick);
            };
            this.addResource = function (newResource) {
                resources.push(newResource);
            };
            this.setBackgroundLayer = function (layer) {
                backgroundLayer = layer;
                levelSize.width = layer.width;
                levelSize.height = layer.height;
            };

            var lastTick = 0;
            var tick = function (tickTime) {
                var dt = tickTime - lastTick;
                console.log(dt);
                update(dt);
                render();
                lastTick = tickTime;
                frameRequestId = window.requestAnimationFrame(tick);
            };

            var update = function (dt) {

            };

            var render = function () {
                backgroundLayer.render();
            };

            var killTick = function () {
                if (frameRequestId) {
                    window.cancelAnimationFrame(frameRequestId);
                }
            };
        }

        function BackgroundLayer (src) {
            this.isLoaded = false;
            var image = new Image();
            image.addEventListener("load", this.loadHandler, false);
            image.src = src;
            game.addResource(this);
            this.render = function () {
                ctx.drawImage(image, 0, 0);
            };
        }
        BackgroundLayer.prototype.loadHandler = function () {
            this.isLoaded = true;
        };

        function Entity (src) {
            this.isLoaded = false;
            game.addResource(this);

            var currentFrame = 0;
            var frameDelay = 0; //frame delay of 0 will not animate
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
         @image - a loaded image objects
         @frameSize - {width:0,height:0} - height and width of each animation frame
         @frames - [{x:0,y:0},{x:0,y:0},{x:0,y:0}] - array of position vectors from the source image
         @playOrder - [0,1,2,3,2,1,0] - animation frame sequence */
        function Anim (image, frameSize, frames, playOrder) {

        }

        function StartMenu (src) {
            Entity.call(this, src);
            this.prototype = new Entity();

        }
        //StartMenu.prototype = new Entity();

        function TitleScreen () {
            game.setBackgroundLayer(new BackgroundLayer("./images/titleScreenBackground.png"));
        }

        /*
         function Product(name, value){
         this.name = name;
         if(value >= 1000)
         this.value = 999;
         else
         this.value = value;
         }

         function Prod_dept(name, value, dept){
         this.dept = dept;
         Product.call(this, name, value);
         }

         Prod_dept.prototype = new Product();
         */

        var game = new Game();
        game.loadLevel(game.TITLESCREEN);

        /*
         function Monster (row, column) {
         // State Consts
         var HIDING = 0;
         var JUMPING = 1;
         var HIT = 2

         //initial state
         var currentState = 0;

         var canvas = document.createElement("canvas");
         canvas.setAttribute("width", SIZE);
         canvas.setAttribute("height", SIZE);
         stage.appendChild(canvas);
         canvas.style.top = row * (SIZE + SPACE) + "px";
         canvas.style.left = column * (SIZE + SPACE) + "px";
         canvas.addEventListener("mousedown", mousedownHandler, false);
         var ctx = canvas.getContext("2d");

         function mousedownHandler (e) {
         console.log(row + ":" + column);
         console.log(currentState);
         if (currentState == JUMPING) {
         changeState(HIT);
         }
         };
         var hitDisplayFrames = 10;
         this.update = function () {
         switch(currentState) {
         case HIDING:
         if (Math.random() > 0.975) {
         playAnimForward = true;
         changeState(JUMPING);
         }
         break;
         case JUMPING:
         if (currentFrame == 0 && !playAnimForward) {
         changeState(HIDING);
         }
         break;
         case HIT:
         hitDisplayFrames--;
         if (hitDisplayFrames < 0) {
         hitDisplayFrames = 10;
         changeState(HIDING);
         }
         break;
         }
         }
         var playAnimForward = true;
         var currentFrame = 0; // initial frame
         this.render = function () {
         var outFrame = {x:0, y:0};
         switch(currentState) {
         case HIDING:
         currentFrame = 0;
         break;
         case JUMPING:
         if (currentFrame < 5 && playAnimForward) {
         currentFrame++;
         }
         if (currentFrame >= 5) {
         playAnimForward = false;
         }
         if (!playAnimForward) {
         currentFrame--;
         }
         break;
         case HIT:
         currentFrame = 6;
         break;
         }
         getFrame(currentFrame, outFrame);
         ctx.drawImage(this.spriteSheet, outFrame.x * SIZE, outFrame.y * SIZE, SIZE, SIZE, 0, 0, SIZE, SIZE);
         };
         var changeState = function (newState) {
         currentState = newState;
         };
         }
         var image = new Image();
         image.addEventListener("load", loadHandler, false);
         image.src = "./images/monsterTileSheet.png";
         function loadHandler() {
         Monster.prototype.spriteSheet = image;
         Monster.prototype.getFrame = getFrame;
         startGame();
         }
         function getFrame(frameNumber, outFrame) {
         //No return value.  Output needs an x and y so alter the values of outFrame
         var framesWide = Math.floor(image.width / SIZE);
         var framesHigh = Math.floor(image.height / SIZE);
         outFrame.x = frameNumber % framesWide;
         outFrame.y = Math.floor(frameNumber / framesHigh);
         }
         var monsters = [];
         function startGame() {
         for (var i = 0; i < ROWS; i++) {
         for (var j = 0; j < COLUMNS; j++) {
         monsters.push(new Monster(i,j));
         }
         }
         mainLoop();
         }

         function mainLoop () {
         monsters.forEach(
         function(element, index, array) {
         element.update();
         element.render();
         });
         setTimeout(mainLoop, 120);
         }
         */
    });
