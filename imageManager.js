(function () {
    "use strict";
    sm3.imageManager = (function () {
        function ImageManager () {
            var images = {};
            this.getImage = function (path) {
                if (images[path]) {
                    return images[path];
                } else {
                    return null;
                }
            };
            this.storeImage = function (path, image) {
                images[path] = image;
            };
            this.purgeImages = function () {
                images = {};
            };
        }
        return new ImageManager();
    })();
})();