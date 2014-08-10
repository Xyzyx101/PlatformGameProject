/* This is the mini game level you can play in toads house */
sm3.SpinMiniGame = function (returnToLevel) {
    "use strict";
    sm3.game.setBackgroundLayer(new sm3.BackgroundLayer("./images/spinGameIntroBackground.png"));

    var spinners = [];
    spinners[0] = sm3.game.registerEntity(new sm3.Spinner(sm3.Spinner.WHEEL.FIRST));
    spinners[1] = sm3.game.registerEntity(new sm3.Spinner(sm3.Spinner.WHEEL.SECOND));
    spinners[2] = sm3.game.registerEntity(new sm3.Spinner(sm3.Spinner.WHEEL.THIRD));

    var extraLife = sm3.game.registerEntity(new sm3.MiniGameExtraLife());

    var controller = sm3.game.registerEntity(new sm3.SpinController(spinners, extraLife));
    sm3.soundManager.loadAudio("smb3_1-up", 1);
    sm3.soundManager.loadAudio("smb3_nspade_match", 0.8);
    sm3.soundManager.loadAudio("smb3_bonus_game_no_match", 1);
    sm3.soundManager.loadAudio("smb3_enter_level", 1);
};
