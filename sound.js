(function () {
    "use strict";
    sm3.soundManager = (function () {
        function SoundManager () {
            var sounds = {};
            var testAudio = new Audio();

            var supportedFormat;
            if(testAudio.canPlayType("audio/ogg").match(/maybe|probably/i)) {
                supportedFormat = ".ogg";
            } else if (testAudio.canPlayType("audio/mp3").match(/maybe|probably/i)){
                supportedFormat = ".mp3";
            } else {
                supportedFormat = null;
                console.log("Error! Audio not supported");
            }
            this.loadAudio = function(soundFile, volume) {
                if (supportedFormat) {
                    var src = "./sounds/" + soundFile + supportedFormat;
                    var newSound = new sm3.Sound(src, volume);
                    sounds[soundFile] = newSound;
                    sm3.game.addSoundResource(newSound);
                }
            };

            this.play = function(soundFile) {
                sounds[soundFile].play();
            };
        }
        return new SoundManager();
    })();
    sm3.Sound = function (src, volume) {
        var mySound = new Audio();
        mySound.src = src;
        mySound.volume = volume;
        mySound.preload = "auto";
        this.isLoaded = false;
        var loadHandler = function () {
            this.isLoaded = true;
        };
        this.play = function () {
            mySound.play();
        };
        // loadHandler.bind(this) should make loadHandler run in the context
        // of this function rather than the context of image.
        mySound.addEventListener("canplaythrough", loadHandler.bind(this), false);

    };
})();