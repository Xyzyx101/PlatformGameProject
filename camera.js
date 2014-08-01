/* The camera changes the part of the level that is in view.
 * This class is also used in a rough pass for the entity
 * update, rendering and collision because objects
 * off screen are ignored.
 */
sm3.Camera = function (mario, levelSize, groundLimit) {
    var screenWidth = sm3.ctx.canvas.width;
    var screenHeight = sm3.ctx.canvas.height;
    var cameraPos = {x:0, y:0};
    this.updateView = function () {
        cameraPos.x = mario.getPosition().x - (screenWidth - mario.getFrameSize().width) * 0.5;
        cameraPos.x = Math.max(cameraPos.x, 0);
        cameraPos.x = Math.min(cameraPos.x, levelSize.width - screenWidth);

        cameraPos.y = mario.getPosition().y - (screenHeight - mario.getFrameSize().height) * 0.5;
        cameraPos.y = Math.max(cameraPos.y, 0);
        cameraPos.y = Math.min(cameraPos.y, groundLimit - screenHeight, levelSize.height - screenHeight);
    };
    this.getCameraPos = function () {
        return cameraPos;
    };
};
