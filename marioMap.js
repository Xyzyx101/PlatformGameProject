/*  This is the level representation on the world map.
    @param position - an object in the form {x:pixels, y:pixels}.
*/
sm3.MarioMap = function (position, state) {
    "use strict";
    var frameSize = {width:70,height:64};
    sm3.Entity.call(this, "./images/mapTiles.png", 350, frameSize);
    this.addAnim(new sm3.Anim("Small",
                [{x:0, y:frameSize.height * 4},
                {x:0, y:frameSize.height * 5}],
                [0,1])
    );
    this.addAnim(new sm3.Anim("Super",
                [{x:frameSize.width, y:frameSize.height * 4},
                {x:frameSize.width, y:frameSize.height * 5}],
                [0,1])
    );
    this.addAnim(new sm3.Anim("Racoon",
                [{x:frameSize.width * 2, y:frameSize.height * 4},
                {x:frameSize.width * 2, y:frameSize.height * 5}],
                [0,1])                  
    );
    this.changeAnim("Small");
    var MOVING = 0;
    var STOPPED = 1;
    this.update = function (dt) {
        switch(currentState) {
        case MOVING:
        
            break;
        case STOPPED:
        
            break;
        }
        this.animate(dt);
    };
    this.render = function () {
        this.displayAnim(position.x, position.y);
    };
    this.moveTo = function (newTargetPosition) {
        targetPosition = newTargetPosition;
    };
};
sm3.MarioMap.STATE = {SMALL:0, SUPER:1, RACOON:2};
