 
(function () {
    sm3.MapMiniGame = function (level, position, newOpenSides) {
        console.log("sm3.MapMiniGame is deprecated and should not be called");
        "use strict";
        var frameSize = {width:70,height:64};
        sm3.Entity.call(this, "./images/mapTiles.png", 0, frameSize);
        switch(level) {
        case sm3.World01Map.LEVELS.TOADSHOUSE:
            this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * 7, y:0}],[0]));
            this.addAnim(new sm3.Anim("Complete",[{x:frameSize.width * 7, y:frameSize.y * 1}],[0]));
            break;
        case sm3.World01Map.LEVELS.SPINMINIGAME:
            this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * 6, y:0}],[0]));
            this.addAnim(new sm3.Anim("Complete",[{x:frameSize.width * 6, y:frameSize.y * 1}],[0]));
            break;
        default:
            console.log("Unknown level in MapMiniGame entity");
        }

        var openSides = newOpenSides;

        var NORMAL = 0;
        var COMPLETE = 1;
        var currentState = sm3.MapMiniGame.STATE.NORMAL;
        this.changeState = function (newState) {
            switch(currentState) {
            case sm3.MapMiniGame.STATE.NORMAL:
                this.changeAnim("Normal");
                break;
            case sm3.MapMiniGame.STATE.COMPLETE:
                this.changeAnim("Complete");
                break;
            default:
                console.log("Error! Unknown state in MapLevel entity");
            }
        };
        this.changeState(NORMAL);
        this.update = function (dt) {};
        this.render = function () {
            this.displayAnim(position.x, position.y);
        };
        this.getOpenSides = function () {
            return openSides;
        };
        this.getType = function () {
            return level;
        };
    };
    sm3.MapMiniGame.STATE = {
        NORMAL:0,
        COMPLETE:1
    };
})();