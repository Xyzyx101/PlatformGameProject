/*  This is the level representation on the world map.
 @param position - an object in the form {x:pixels, y:pixels}.
 */
sm3.MapObject = function (type, position) {
    "use strict";
    var frameSize = {width:70,height:64};
    if (type == sm3.World01Map.LEVELS.TREE) {
        sm3.Entity.call(this, "./images/mapTiles.png", 500, frameSize);
        this.addAnim(new sm3.Anim("Dance",
                                  [{x:0,y:frameSize.height * 3},
                                   {x:frameSize.width, y:frameSize.height * 3},
                                   {x:frameSize.width * 2,y:frameSize.height * 3}],
                                  [0,1,0,2])
                    );
        this.changeAnim("Dance");
    }
    this.update = function (dt) {
         if (type == sm3.World01Map.LEVELS.TREE) {
             this.animate(dt);
         }
    };
    this.render = function () {
        if (type == sm3.World01Map.LEVELS.TREE) {
            this.displayAnim(position.x, position.y);
        }
    };
    this.getType = function () {
        return type;
    };

    // This is used when a player presses the enter level button on an object that is not a level
    this.getState = function () {
        return null;
    };
};