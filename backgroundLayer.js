(function () {
"use strict";
    sm3.BackgroundLayer = function (src) {
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
           
        this.render = function () {
            sm3.ctx.drawImage(image, 0, 0);
        };
        
    };
})();