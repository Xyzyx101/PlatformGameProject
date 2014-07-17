$(document).ready(
	function() {
		"use strict";
		var canvas = $("#canvas");
		
		var game = {
			TITLESCREEN = 0,
			OVERWORLD = 1,
			LEVEL = 2,
			MINIGAME = 3,
			gameState = STARTSCREEN,
			loadLevel = function (gameState) {
				switch(gameState) {
				case TITLESCREEN:
					break;
				case OVERWORLD:
					break;
				case LEVEL:
					break;
				case MINIGAME:
					break;
				}
			}
			tick = function () {
				console.log("tick");
			}
			
		}
		
		
		
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
	});
