(function () {
    "use strict";
    sm3.TitleScreen = function () {
        sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/titleScreenBackground.png"));
        sm3.game.registerEntity(new StartMenu());
        sm3.game.registerEntity(new FlashingTitle());
    };

    function StartMenu () {
        sm3.Entity.call(this, "./images/mainMenu.png", 0, {width:400,height:120});
        this.addAnim(new sm3.Anim("Start",[{x:0,y:0}],[0]));
        this.addAnim(new sm3.Anim("Match",[{x:400,y:0}],[0]));
        this.changeAnim("Start");
        var START = 0;
        var MATCH = 1;
        var currentState = START;
        this.update = function () {
            switch(currentState) {
            case START:
                if (sm3.input.getPressed(sm3.DOWN) || sm3.input.getPressed(sm3.SELECT)) {
                    this.changeAnim("Match");
                    currentState = MATCH;
                }
                if (sm3.input.getPressed(sm3.JUMP) || sm3.input.getPressed(sm3.START)) {
                    sm3.game.loadLevel(sm3.game.WORLD01MAP);
                }
                break;
            case MATCH:
                if (sm3.input.getPressed(sm3.UP) || sm3.input.getPressed(sm3.SELECT)) {
                    this.changeAnim("Start");
                    currentState = START;
                }
                if (sm3.input.getPressed(sm3.JUMP) || sm3.input.getPressed(sm3.START)) {
                    sm3.game.loadLevel(sm3.game.SPINMINIGAME);
                }
                break;
            }
        };
        this.render = function () {
            this.displayAnim(300, 500);
        };
    }

    function FlashingTitle () {
        sm3.Entity.call(this, "./images/flashingTitle3.png", 120, {width:170,height:140});
        this.addAnim(new sm3.Anim("Flash",
                              [{x:0,y:0},
                               {x:170,y:0},
                               {x:340,y:0},
                               {x:510,y:0}],
                              [0,1,2,3,2,1])
                    );
        this.changeAnim("Flash");
        this.update = function (dt) {
            this.animate(dt);
        };
        this.render = function () {
            this.displayAnim(450, 350);
        };
    }
})();
