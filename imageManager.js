(function () {
    "use strict";
    sm3.imageManager = (function () {
        function ImageManager () {
            var images = {};
            this.getImage = function (fullName) {
                if (images[fullName]) {
                    return images[fullName];
                } else {
                    return null;
                }
            };
            this.storeImage = function (fullName, image) {
                images[fullName] = image;
            };
            this.purgeImages = function () {
                images = {};
            };
        }
        return new ImageManager();
    })();
})();