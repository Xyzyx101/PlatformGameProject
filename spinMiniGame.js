/* This is the mini game level you can play in toads house */
sm3.SpinMiniGame = function () {
    "use strict";
    sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/spinGameIntroBackground.png"));

    var spinners = [];
    spinners[0] = sm3.game.createEntity(new sm3.Spinner());
    spinners[1] = sm3.game.createEntity(new sm3.Spinner());
    spinners[3] = sm3.game.createEntity(new sm3.Spinner());

    var controller = sm3.game.createEntity(new sm3.SpinController());
};
