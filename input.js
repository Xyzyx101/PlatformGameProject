(function () {
    "use strict";
    sm3.input = (function () {
        function Input () {
            this.KEY = {'LEFT_ARROW':37,
                   'UP_ARROW':38,
                   'RIGHT_ARROW':39,
                   'DOWN_ARROW':40,
                   'CTRL':17,
                   'ALT':18,
                   'W':87,
                   'A':65,
                   'S':83,
                   'D':68,
                   'COMMA':188,
                   'PERIOD':190,
                   'OPEN_BRACKET':219,
                   'CLOSE_BRACKET':221
                };

            var keyPress = {};
            var keyHeld = {};
            var bindings = {};

            this.getPressed = function (action) {
                if (keyPress[action]) {
                    keyPress[action] = false;
                    return true;
                }
                return false;
            };
            this.getHeld = function (action) {
                if (keyHeld[action]) {
                    return true;
                }
                return false;
            };
            this.bindKey = function (key, action) {
                bindings[key] = action;
            };
            var keyDown = function (event) {
                var action = bindings[event.keyCode];
                // if (action) verifies the action exists and === 0 is just an edgecase where it is 0
                if (action || action === 0) {
                    keyPress[action] = true;
                    keyHeld[action] = true;
                }
                event.stopPropagation();
                event.preventDefault();
            };
            var keyUp = function (event) {
                var action = bindings[event.keyCode];
                if (action || action === 0) {
                    keyPress[action] = false;
                    keyHeld[action] = false;
                }
                event.stopPropagation();
                event.preventDefault();
            };
            window.addEventListener('keydown', keyDown.bind(this), false);
            window.addEventListener('keyup', keyUp.bind(this), false);
        }
        return new Input();
    })();
})();
