/*  This is the level representation on the world map.
    @param position - an object in the form {x:pixels, y:pixels}.
*/
sm3.DancingTree = function (position) {
    "use strict";
    var frameSize = {width:70,height:64};
    sm3.Entity.call(this, "./images/mapTiles.png", 500, frameSize);
       this.addAnim(new sm3.Anim("Dance",
                            [{x:0,y:frameSize.height * 3},
                            {x:frameSize.width, y:frameSize.height * 3},
                            {x:frameSize.width * 2,y:frameSize.height * 3}],
                            [0,1,0,2])
                );
    this.changeAnim("Dance");
    this.update = function (dt) {
        this.animate(dt);
    };
    this.render = function () {
        this.displayAnim(position.x, position.y);
    };
};