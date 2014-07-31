/* This sets the static background layer. The layer can be either a static image or
 * if src is null nad a background color {r:0,g:0,b:0} is included it will fill the
 * background with a static color.
 */

(function () {
    "use strict";
    sm3.BackgroundLayer = function (src, backgroundColor) {
        var staticBackgroundColor = null;
        var canvasWidth = sm3.ctx.canvas.width;
        var canvasHeight = sm3.ctx.canvas.height;
        if (src) {
            var image;
            this.getImage = function () {
                return image;
            };
            if (sm3.imageManager.getImage(src)) {
                image = sm3.imageManager.getImage(src);
                this.isLoaded = true;
            } else {
                this.isLoaded = false;
                var loadHandler = function () {
                    this.isLoaded = true;
                };
                image = new Image();
                // loadHandler.bind(this) should make loadHandler run in the context
                // of this function rather than the context of image.
                image.addEventListener("load", loadHandler.bind(this), false);
                image.src = src;
                sm3.game.addResource(src, this);
            }
        } else {
            staticBackgroundColor = "rgb(" +
                backgroundColor.r + "," +
                backgroundColor.g + "," +
                backgroundColor.b + ")";
        }
        this.render = function () {
            if (src) {
                sm3.ctx.drawImage(image, 0, 0);
            } else {
                sm3.ctx.fillStyle = staticBackgroundColor;
                sm3.ctx.fillRect(0,0,canvasWidth,canvasHeight);
            }
        };

    };
})();