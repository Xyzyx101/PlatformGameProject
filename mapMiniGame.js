 /*  This is the level representation on the world map.
    @param level - a number constant from sm3.World01Map.LEVELS
    @param position - an object in the form {x:pixels, y:pixels}.
    @param newOpenSided - is object containing booleans for which sides are open.  This is used
    to block the player from passing incomplete levels. {left:false,right:false,top:false,bottom:false}
 */
(function () {
    sm3.MapMiniGame = function (level, position, newOpenSides) {
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
        var currentState = NORMAL;
        this.changeState = function (newState) {
            switch(currentState) {
            case NORMAL:
                this.changeAnim("Normal");
                break;
            case COMPLETE:
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
})();