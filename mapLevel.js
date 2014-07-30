 /*  This is the level representation on the world map.
    @param level - a number.
    @param position - an object in the form {x:pixels, y:pixels}.
    @param newOpenSided - is object containing booleans for which sides are open.  This is used
    to block the played from passing incomplete levels. {left:false,right:false,top:false,bottom:false}
 */
(function () {
    sm3.MapLevel = function (level, position, newOpenSides) {
        "use strict";
        var frameSize = {width:70,height:64};
        sm3.Entity.call(this, "./images/mapTiles.png", 0, frameSize);
        var tileMapColumn = 0;
        switch(level) {
        //FIXME
        case sm3.World01Map.LEVELS.LEVEL01:
            tileMapColumn = 0;
            break;
        case sm3.World01Map.LEVELS.LEVEL02:
            tileMapColumn = 1;
            break;
        case sm3.World01Map.LEVELS.LEVEL03:
            tileMapColumn = 2;
            break;
        case sm3.World01Map.LEVELS.LEVEL04:
            tileMapColumn = 3;
            break;
        case sm3.World01Map.LEVELS.LEVEL05:
            tileMapColumn = 4;
            break;
        case sm3.World01Map.LEVELS.LEVEL06:
            tileMapColumn = 5;
            break;
        default:
            console.log("Unknown level in MapLevels entity");
        }
        this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * tileMapColumn, y:0}],[0]));
        this.addAnim(new sm3.Anim("Flipped",[{x:frameSize * tileMapColumn, y:frameSize.y}],[0]));
        this.addAnim(new sm3.Anim("CompleteNormal",[{x:0, y:frameSize.y * 2}],[0]));
        this.addAnim(new sm3.Anim("CompleteFlipped",[{x:0, y:frameSize.y * 2}],[0]));

        var openSides = newOpenSides;

        // All of the level tiles flip between normal and flipped when you look at you inventory
        var NORMAL = 0;
        var FLIPPED = 1;
        var COMPLETENORMAL = 2;
        var COMPLETEFLIPPED = 3;
        var currentState = NORMAL;
        this.changeState = function (newState) {
            switch(currentState) {
            case NORMAL:
                this.changeAnim("Normal");
                break;
            case FLIPPED:
                this.changeAnim("Flipped");
                break;
            case COMPLETENORMAL:
                this.changeAnim("CompleteNormal");
                break;
            case COMPLETEFLIPPED:
                this.changeAnim("CompleteFlipped");
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