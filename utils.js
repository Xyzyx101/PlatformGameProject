/* This module is for lonely orphan utility functions with no home */

( function () {
    "use strict";
    sm3.utils = (function () {
        function Util () {
            this.vectorAdd = function (vecA, vecB) {
                return {x:vecA.x + vecB.x, y:vecA.y + vecB.y};
            };

            this.vectorMul = function (vector, scalar) {
                return {x:vector.x * scalar, y:vector.y * scalar};
            };

            this.magnitude = function (vector) {
                return Math.sqrt(vector.x * vector.x + vector.y * vector.y);
            };

            // pass in a vector {x:0,y:0} and get back normalized vector in the same form
            this.normalize = function (vector) {
                var magnitude = sm3.utils.magnitude(vector);
                return {x: vector.x / magnitude, y: vector.y / magnitude};
            };

            // pass in a vector and get the angle between the positive x-axis
            // and the vector.  returns values between -pi and pi
            this.getAngle = function (vector) {
                return Math.atan2(vector.y, vector.x);
            };
        }
        return new Util();
    })();
})();
