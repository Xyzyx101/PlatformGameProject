(function () {
    "use strict";
    sm3.Entity = function (src, newFrameDelay, newFrameSize) {
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

        var currentFrame = 0;
        var frameDelay = newFrameDelay; // frame delay in milliseconds. 0 will not animate
        var animations = []; // should contain anim objects
        var frameSize = newFrameSize;
        var animFrameChangeCount = 0;
        var currentAnim = {};
        this.addAnim = function (anim) {
            animations.push(anim);
        };
        this.update = function () {
            console.log("Update should be overwritten in the child class");
        };
        this.render = function () {
            console.log("Render should be overwritten in the child class");
        };
        this.animate = function (dt) {
            animFrameChangeCount += dt;
            while (animFrameChangeCount > frameDelay) {
                animFrameChangeCount -= frameDelay;
                currentFrame++;
                if (currentFrame >= currentAnim.playOrder.length) {
                    currentFrame = 0;
                }
            }
        };
        this.changeAnim = function (newAnim) {
            currentFrame = 0;
            animFrameChangeCount = 0;
            var index = 0;
            var found = false;
            do {
                if (animations[index].name == newAnim) {
                    found = true;
                    break;
                }
                index++;
            } while (index < animations.length);
            if (found === true) {
                currentAnim = animations[index];
            } else {
                console.log("Error " + newAnim + " not found!");
            }
        };
        this.displayAnim = function (dx, dy) {
            var myFrame = currentAnim.playOrder[currentFrame];
            var sx = currentAnim.frames[myFrame].x;
            var sy = currentAnim.frames[myFrame].y;
            sm3.ctx.drawImage(image,
                              sx,
                              sy,
                              frameSize.width,
                              frameSize.height,
                              dx,
                              dy,
                              frameSize.width,
                              frameSize.height);
        };
    };

    /* A single animation.  Which animation is playing will change based on an entities state machine.
     @name - animation name
     @frames - [{x:0,y:0},{x:0,y:0},{x:0,y:0}] - array of position vectors from the source image
     @playOrder - [0,1,2,3,2,1,0] - animation frame sequence */
    sm3.Anim = function (name, frames, playOrder) {
        this.name = name;
        this.frames = frames;
        this.playOrder = playOrder;
    };
})();