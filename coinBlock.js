sm3.CoinBlock = function (initialPosition, level, type) {
    "use strict";
    var that = this;
    var frameSize = {width:64,height:64};
    var position = initialPosition;
    this.getPosition = function () {
        return position;
    };
    this.getType = function () {
        return sm3.GameLevel.ENTITYTYPE.COINBLOCK;
    };
    this.getInteractsWithList = function () {
        return null;
    };
    this.interactsWithStaticGeometry = function () {return false;};

    var bbSize = {width:64, height:64};
    var bbOffset = {x:0, y:0};
    var bb = new sm3.BoundingBox(position, frameSize, bbSize, bbOffset);
    this.getBoundingBox = function () {
        return bb;
    };
    sm3.Entity.call(this, "./images/CoinsBlocksPowerUps.png", 200, frameSize);

    this.addAnim(new sm3.Anim("Question",
                              [{x:0, y:0},
                               {x:frameSize.width, y:0},
                               {x:frameSize.width * 2, y:0},
                               {x:frameSize.width * 3, y:0}],
                              [0,1,2,3])
                );
    this.addAnim(new sm3.Anim("SpawnCoin",
                              [{x:frameSize.width * 6, y:0},
                               {x:frameSize.width * 7, y:0},
                               {x:frameSize.width * 8, y:0},
                               {x:frameSize.width * 9, y:0},
                               {x:frameSize.width * 10, y:0}],
                              [0,1,2,3,4])
                );
    this.addAnim(new sm3.Anim("SpawnMushroom",
                              [{x:frameSize.width, y:frameSize.height * 2},
                               {x:frameSize.width * 2, y:frameSize.height * 2},
                               {x:frameSize.width * 3, y:frameSize.height * 2},
                               {x:frameSize.width * 4, y:frameSize.height * 2}],
                              [0,1,2,3])
                );
    this.addAnim(new sm3.Anim("SpawnLeaf",
                              [{x:frameSize.width * 7, y:frameSize.height}],
                              [0])
                );

    this.hit = function () {
        if (currentState != sm3.CoinBlock.STATE.QUESTION) {return;}
        if (type == sm3.CoinBlock.TYPE.COIN) {
            sm3.soundManager.play("smb3_coin");
            changeState(sm3.CoinBlock.STATE.SPAWNCOIN);
        } else if (type == sm3.CoinBlock.TYPE.LEAF) {
            if (level.getMario().getPowerLevel() == sm3.SmallMario.POWERLEVEL.SMALL) {
                sm3.soundManager.play("smb3_mushroom_appears");
                changeState(sm3.CoinBlock.STATE.SPAWNMUSHROOM);
            } else {
                sm3.soundManager.play("smb3_mushroom_appears");
                changeState(sm3.CoinBlock.STATE.SPAWNLEAF);
            }
        }
    };

    // the target is the place a spawned object should animate to
    var startPosition = {x:0, y:0};
    var targetPosition = {x:0, y:0};
    var targetTime = 0;
    var currentState = 0;
    var spawnTimer = 0;
    this.update = function (dt) {
        switch (currentState) {
        case sm3.CoinBlock.STATE.QUESTION:
            break;
        case sm3.CoinBlock.STATE.SPAWNCOIN:
            spawnTimer += dt;
            position = interpolatePosition(spawnTimer, targetTime);
            if (spawnTimer > targetTime) {
                level.destroy(this);
            }
            break;
        case sm3.CoinBlock.STATE.SPAWNMUSHROOM:
            spawnTimer += dt;
            if (spawnTimer > targetTime) {
                level.registerEntity(new sm3.Mushroom(position,
                                                      level,
                                                      sm3.Mushroom.TYPE.SUPERMUSHROOM,
                                                      false));
                level.destroy(this);
            }
            break;
        case sm3.CoinBlock.STATE.SPAWNLEAF:
            spawnTimer += dt;
            position = interpolatePosition(spawnTimer, targetTime);
            if (spawnTimer > targetTime) {
                console.log("TODO spawnLeaf");
                //level.registerEntity(new sm3.Leaf());
                level.destroy(this);
            }
            break;
        default:
            console.log("Error in coinBlock - unknown state");
        }
        this.animate(dt);
    };

    this.render = function (cameraOffset) {
        this.displayAnim(position.x - cameraOffset.x, position.y - cameraOffset.y);
    };

    var changeState = function (newState) {
        currentState = newState;
        switch (newState) {
        case sm3.CoinBlock.STATE.QUESTION:
            that.changeAnim("Question");
            break;
        case sm3.CoinBlock.STATE.SPAWNCOIN:

            // TODO add a coin to the HUD

            that.changeAnim("SpawnCoin");
            startPosition = {x:position.x, y:position.y - frameSize.height};
            targetPosition = {x:position.x, y:position.y - frameSize.height * 4};
            targetTime = 600;
            that.setFrameDelay(100);
            break;
        case sm3.CoinBlock.STATE.SPAWNMUSHROOM:
            targetTime = 2000;
            that.setFrameDelay(targetTime * 0.25);
            position = {x:initialPosition.x, y:initialPosition.y - frameSize.height};
            that.changeAnim("SpawnMushroom");
            break;
        case sm3.CoinBlock.STATE.SPAWNLEAF:
            that.changeAnim("SpawnLeaf");
            startPosition = {x:position.x, y:position.y - frameSize.height};
            targetPosition = {x:position.x, y:position.y - frameSize.height * 2};
            targetTime = 300;
            that.setFrameDelay(0);
            break;
        default:
            console.log("Error in coinBlock - unknown state");
        }
    };
    changeState(sm3.CoinBlock.STATE.QUESTION);

    var interpolatePosition = function (time, targetTime) {
        var interpCoeff = time / targetTime;
        var partialPosition = sm3.utils.vectorSub(targetPosition, startPosition);
        partialPosition = sm3.utils.vectorMul(partialPosition, interpCoeff);
        return sm3.utils.vectorAdd(startPosition, partialPosition);
    };
};
sm3.CoinBlock.TYPE = {COIN : 0,
                      LEAF : 1};
sm3.CoinBlock.STATE = {QUESTION:0,
                       SPAWNCOIN:1,
                       SPAWNMUSHROOM:2,
                       SPAWNLEAF:3};