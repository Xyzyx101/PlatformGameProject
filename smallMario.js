/*  This is the mario representation in a regular level.
 @param position - an object in the form {x:pixels, y:pixels}. */
sm3.SmallMario = function (initialPosition) {
    "use strict";
    var frameSize = {width:64,height:64};
    this.getFrameSize = function () {
        return frameSize;
    };
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    sm3.Entity.call(this, "./images/smallMario.png", 100, frameSize);
    this.addAnim(new sm3.Anim("Stopped",
                              [{x:0, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Run",
                              [{x:0, y:0},
                               {x:frameSize.width, y:0}],
                              [0,0,1,1])
                );
    this.addAnim(new sm3.Anim("Jump",
                              [{x:frameSize.width * 2, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("ChangeDirection",
                              [{x:frameSize.width * 3, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("PreFly",
                              [{x:frameSize.width * 4, y:0},
                               {x:frameSize.width * 5, y:0},
                               {x:frameSize.width * 6, y:0}]
                              [1,0,1,2,0])
                );
    this.addAnim(new sm3.Anim("Slide",
                              [{x:frameSize.width * 7, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Tube",
                              [{x:frameSize.width * 8, y:0}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Climb",
                              [{x:0, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Die",
                              [{x:frameSize.width, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("Swim",
                              [{x:frameSize.width * 2, y:frameSize.height},
                               {x:frameSize.width * 3, y:frameSize.height},
                               {x:frameSize.width * 4, y:frameSize.height}],
                              [2,2,2,2,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1])
                );
    this.addAnim(new sm3.Anim("Fly",
                              [{x:frameSize.width * 5, y:frameSize.height}],
                              [0])
                );
    this.addAnim(new sm3.Anim("CarryShell",
                              [{x:frameSize.width * 6, y:frameSize.height},
                               {x:frameSize.width * 7, y:frameSize.height}],
                              [0,0,1,1])
                );

    this.changeAnim("Stopped");

    var moveSpeed = 0.3;

    var MOVING = 0;
    var STOPPED = 1;
    var currentState = STOPPED;

    var newPixelPosition;
    this.update = function (dt) {
        switch(currentState) {
        case MOVING:

        case STOPPED:

            break;
        }
        this.animate(dt);
    };
    this.render = function () {
        this.displayAnim(position.x, position.y);
    };
    var collisionWidth = 60;
    var collisionHeight = 60;
    var collisionOffset = {x:2, y:4}; //collision is centered in x but at he bottom in y
    this.getCollisionBox = function () {

    };

};
sm3.SmallMario.CHARACTERSTATE = {
    SMALL:0,
    SUPER:1,
    RACOON:2
};
sm3.SmallMario.STATE = {
    STOPPED:0,
    RUNNING:1,
    JUMPING:2
};