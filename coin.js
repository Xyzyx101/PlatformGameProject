sm3.Coin = function (initialPosition, level) {
    "use strict";
    var that = this;
    var frameSize = {width:64,height:64};

    //DELETEME
    //var cameraOffest = {x:0, y:0};

    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    this.getType = function () {
        return sm3.GameLevel.ENTITYTYPE.COIN;
    };
    this.getInteractsWithList = function () {
        return null;
    };
    this.interactsWithStaticGeometry = function () {return false;};

    var bbSize = {width:48, height:48};
    var bbOffset = {x:8, y:8};
    var bb = new sm3.BoundingBox(position, frameSize, bbSize, bbOffset);
    this.getBoundingBox = function () {
        return bb;
    };

    sm3.Entity.call(this, "./images/CoinsBlocksPowerUps.png", 0, frameSize);

    this.addAnim(new sm3.Anim("Stopped",
                              [{x:frameSize.width * 5, y:0}],
                              [0])
                );
    this.changeAnim("Stopped");

    var touched = false;
    this.marioTouched = function () {
        touched = true;
    };

    this.update = function (dt) {
        if(touched) {
            // when the HUD works increase coin count here
            level.destroy(this);
        }
    };

    this.render = function (cameraOffset) {
        this.displayAnim(position.x - cameraOffset.x, position.y - cameraOffset.y);
    };
};
