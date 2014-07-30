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
        var tileMapColumn = null;
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
        case sm3.World01Map.LEVELS.TOADSHOUSE:
            this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * 7, y:0}],[0]));
            this.addAnim(new sm3.Anim("CompleteNormal",[{x:frameSize.width * 7, y:frameSize.height}],[0]));
            break;
        case sm3.World01Map.LEVELS.SPINMINIGAME:
            this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * 6, y:0}],[0]));
            this.addAnim(new sm3.Anim("CompleteNormal",[{x:frameSize.width * 6, y:frameSize.height}],[0]));
            break;
        default:
            console.log("Unknown level in MapLevels entity");
        }
        if (tileMapColumn !== null) {
            this.addAnim(new sm3.Anim("Normal",[{x:frameSize.width * tileMapColumn, y:0}],[0]));
            this.addAnim(new sm3.Anim("Flipped",[{x:frameSize.width * tileMapColumn, y:frameSize.height}],[0]));
            this.addAnim(new sm3.Anim("CompleteNormal",[{x:frameSize.width * tileMapColumn, y:frameSize.height}],[0]));
            this.addAnim(new sm3.Anim("CompleteFlipped",[{x:frameSize.width * tileMapColumn, y:frameSize.height}],[0]));
        }
            
        var openSides = newOpenSides;
        
        // All of the level tiles flip between normal and flipped when you look at you inventory
        this.changeState = function (newState) {
            currentState = newState;
            switch(newState) {
            case sm3.MapLevel.STATE.NORMAL:
                this.changeAnim("Normal");
                break;
            case sm3.MapLevel.STATE.FLIPPED:
                this.changeAnim("Flipped");
                break;
            case sm3.MapLevel.STATE.COMPLETENORMAL:
                this.changeAnim("CompleteNormal");
                break;
            case sm3.MapLevel.STATE.COMPLETEFLIPPED:
                this.changeAnim("CompleteFlipped");
                break;
            default:
                console.log("Error! Unknown state in MapLevel entity");
            }
        };
        
        var currentState = sm3.MapLevel.STATE.NORMAL;
        this.changeState(currentState);
        
        this.getState = function () {
            return currentState;
        }
        
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
    sm3.MapLevel.STATE = {
        NORMAL:0,
        FLIPPED:1,
        COMPLETENORMAL:2,
        COMPLETEFLIPPED:3};
})();