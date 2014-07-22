//create Super Mario 3 global object
window.sm3 = window.sm3 || {};
sm3.UP = 0;
sm3.LEFT = 1;
sm3.DOWN = 2;
sm3.RIGHT = 3;
sm3.JUMP = 4;
sm3.ACTION = 5;
sm3.SELECT = 6;
sm3.START = 7;	

$(document).ready(
    function() {
        "use strict";

        var gameElement = $("#game");
        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", "1024px");
        canvas.setAttribute("height", "768px");
        gameElement.append(canvas);
        //canvas.addEventListener("mousedown", mousedownHandler, false);
        sm3.ctx = canvas.getContext("2d");

        //var input = new sm3.Input();
        sm3.input.bindKey(sm3.input.KEY.W, sm3.UP);
        sm3.input.bindKey(sm3.input.KEY.A, sm3.LEFT);
        sm3.input.bindKey(sm3.input.KEY.S, sm3.DOWN);
        sm3.input.bindKey(sm3.input.KEY.D, sm3.RIGHT);
        sm3.input.bindKey(sm3.input.KEY.COMMA, sm3.ACTION);
        sm3.input.bindKey(sm3.input.KEY.PERIOD, sm3.JUMP);
        sm3.input.bindKey(sm3.input.KEY.OPEN_BRACKET, sm3.SELECT);
        sm3.input.bindKey(sm3.input.KEY.CLOSE_BRACKET, sm3.START);

        sm3.game.loadLevel(sm3.game.TITLESCREEN);
    });
