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

            this.vectorSub = function (vecA, vecB) {
                return {x:vecA.x - vecB.x, y:vecA.y - vecB.y};
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

            // Absolute subtract - decrease the magnitude of a by the magnitude of b keeping the sign
            // the return value will never flip sign but will be closer to 0 by b amount
            //  absSub(10, 8)   // result 2
            //  absSub(-10, 8)  // result -2
            //  absSub(-10, -8) // result -2
            //  absSub(8, 10)   // result 0
            this.absSub = function (a , b) {
                if (a === 0) return 0;
                if (Math.abs(b) > Math.abs(a)) return 0;
                var returnValue = 0;
                if (a > 0) {
                    return Math.max(a-Math.abs(b), 0);
                } else {
                    return Math.min(a+Math.abs(b), 0);
                }
            };
        }
        return new Util();
    })();
})();
