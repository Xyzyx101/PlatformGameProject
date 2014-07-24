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
        this.addAnim(new sm3.Anim("Blue",[{x:frameSize.width * tileMapColumn, y:0}],[0]));
        this.addAnim(new sm3.Anim("Pink",[{x:frameSize * tileMapColumn, y:frameSize.y}],[0]));
        this.addAnim(new sm3.Anim("CompleteBlue",[{x:frameSize * 6, y:0}],[0]));
        this.addAnim(new sm3.Anim("Pink",[{x:frameSize * 6, y:frameSize.y}],[0]));
            
        var openSides = newOpenSides;
        
        var BLUE = 0;
        var PINK = 1;
        var COMPLETEBLUE = 2;
        var COMPLETEPINK = 3;
        var currentState = BLUE;
        this.changeState = function (newState) {
            switch(currentState) {
            case BLUE:
                this.changeAnim("Blue");
                break;
            case PINK:
                this.changeAnim("Pink");
                break;
            case COMPLETEBLUE:
                this.changeAnim("CompleteBlue");
                break;
            case COMPLETEPINK:
                this.changeAnim("CompletePink");
                break;
            default:
                console.log("Error! Unknown state in MapLevel entity");
            }
        };
        this.changeState(BLUE);
        this.update = function (dt) {};
        this.render = function () {
            this.displayAnim(position.x, position.y);
        };
        this.getOpenSides = function () {
            return openSides;
        };
    };
})();