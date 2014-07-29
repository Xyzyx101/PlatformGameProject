/*  This is the mario representation on the world map.
    @param position - an object in the form {x:pixels, y:pixels}. */
sm3.MiniGameExtraLife = function () {
    "use strict";
    
    var frameSize = {width:272,height:80};
    sm3.Entity.call(this, "./images/miniGameExtraLife.png", 0, frameSize);
    
    this.addAnim(new sm3.Anim("2UP", [{x:0, y:0}],[0]));
    this.addAnim(new sm3.Anim("3UP", [{x:frameSize.width, y:0}],[0]));
    this.addAnim(new sm3.Anim("5UP", [{x:frameSize.width * 2, y:0}],[0]));
    
    var position = {x:(1024 - frameSize.width) * 0.5, 
                    y:(768 - frameSize.height) * 0.75};
    var finalPositionY = (768 - frameSize.height) * 0.25;
                      
    var moveSpeed = 1;
    
    var INIT = 0;
    var TWOUP = 1;
    var THREEUP = 2;
    var FIVEUP = 3;
    var DISPLAY = 4;
    var currentState = INIT;
    
    this.update = function (dt) {        
        switch(currentState) {
        case INIT:
            break;
        case TWOUP:
            this.changeAnim("2UP");
            currentState = DISPLAY;
            break;
        case THREEUP:
            this.changeAnim("3UP");
            currentState = DISPLAY;
            break;
        case FIVEUP:
            this.changeAnim("5UP");
            currentState = DISPLAY;
            break;
        case DISPLAY:
            if (position.y > finalPositionY) {
                position.y -= moveSpeed * dt;
            } else {
                position.y = finalPositionY;
            }
            break;
        default:
            console.log("Error! Unknown state in miniGameExtraLife");
        }
    };
    this.render = function () {
        if (currentState == DISPLAY) {
            this.displayAnim(position.x, position.y);
        }
    };
    // pass in a tile of type sm3.Spinner.TILE and it will set the extra life sprite;
    this.winWithTile = function(tileType) {
        //you can only win once
        if (currentState == DISPLAY) {
            return;
        }
        switch (tileType) {
        case sm3.Spinner.TILE.MUSHROOM:
            currentState = TWOUP;
        break;
        case sm3.Spinner.TILE.FLOWER:
            currentState = THREEUP;
        break;
        case sm3.Spinner.TILE.STAR:
            currentState = FIVEUP;
        break;
        }
    };
    
};
