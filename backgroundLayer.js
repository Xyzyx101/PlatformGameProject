(function () {
    sm3.BackgroundLayer = function (src) {
        this.isLoaded = false;
        var loadHandler = function () {
             this.isLoaded = true;
        };
        var image = new Image();
        // loadHandler.bind(this) should make loadHandler run in the context
        // of this function rather than the context of image.
        image.addEventListener("load", loadHandler.bind(this), false);
        image.src = src;
        sm3.game.addResource(this);
        this.render = function () {
            sm3.ctx.drawImage(image, 0, 0);
        };
    };
})();