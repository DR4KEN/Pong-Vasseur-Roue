var game = {

    groundWidth: 700,
    groundHeight: 400,
    netWidth: 6,
    groundColor: "#000000",
    netColor: "#FFFFFF",

    groundLayer: null,
    scoreLayer: null,
    playersBallLayer: null,
    victoryScreen: null,

    scorePosPlayer1: 300,
    scorePosPlayer2: 365,

    wallSound: null,
    playerSound: null,

    ball: {
        width: 10,
        height: 10,
        color: "#FFD700",
        posX: 350,
        posY: 200,
        directionX: 1,
        directionY: 1,
        speed: 3,

        move: function() {
            this.posX += this.directionX * this.speed;
            this.posY += this.directionY * this.speed;
        },

        collide: function(anotherItem) {
            if (!(this.posX >= anotherItem.posX + anotherItem.width || this.posX <= anotherItem.posX - this.width ||
                    this.posY >= anotherItem.posY + anotherItem.height || this.posY <= anotherItem.posY - this.height)) {
                return true;
            }
            return false;
        },

        bounce: function(soundToPlay) {
            if (this.posX > game.groundWidth || this.posX < 0) {
                this.directionX = -this.directionX;
                soundToPlay.play();
            }
            if (this.posY > game.groundHeight || this.posY < 0) {
                this.directionY = -this.directionY;
                soundToPlay.play();
            }
        }
    },

    playerOne: {
        width: 10,
        height: 50,
        color: "#FFFFFF",
        posX: 30,
        posY: 200,
        goUp: false,
        goDown: false,
        score: 0
    },

    playerTwo: {
        width: 10,
        height: 50,
        color: "#FFFFFF",
        posX: 650,
        posY: 200,
        goUp: false,
        goDown: false,
        score: 0
    },

    init: function() {
        this.groundLayer = game.display.createLayer("terrain", this.groundWidth, this.groundHeight, undefined, 0, "#000000", 0, 0);
        game.display.drawRectangleInLayer(this.groundLayer, this.netWidth, this.groundHeight, this.netColor, this.groundWidth / 2 - this.netWidth / 2, 0);

        this.scoreLayer = game.display.createLayer("score", this.groundWidth, this.groundHeight, undefined, 1, undefined, 0, 0);
        game.display.drawTextInLayer(this.scoreLayer, "SCORE", "10px Arial", "#FF0000", 10, 10);

        this.playersBallLayer = game.display.createLayer("joueursetballe", this.groundWidth, this.groundHeight, undefined, 2, undefined, 0, 0);
        game.display.drawTextInLayer(this.playersBallLayer, "JOUEURSETBALLE", "10px Arial", "#FF0000", 100, 100);

        this.displayScore(this.playerOne.score, this.playerTwo.score);
        this.displayBall(350, 200);
        this.displayPlayers();

        this.initKeyboard(game.control.onKeyDown, game.control.onKeyUp);
        this.initMouse(game.control.onMouseMove);

        this.wallSound = new Audio("./sound/exp.ogg");
        this.playerSound = new Audio("./sound/coq.ogg");

    },

    resetBallPosition: function() {
        this.ball.posX = 350;
        this.ball.posY = 200;
    },

    checkMaxScoreReached: function() {
        if (this.playerOne.score === 10) {
            alert("playerOne won !");
            this.victoryScreen = game.display.createLayer("victoryScreen", this.groundWidth, this.groundHeight, undefined, 1000, "#000000", 0, 0);
            game.display.drawImageInLayer(this.victoryScreen, this.groundWidth, this.groundHeight, 0, 0);
            this.ball.speed = 0;
        }
        if (this.playerTwo.score === 10) {
            alert("playerTwo won !");
            this.victoryScreen = game.display.createLayer("victoryScreen", this.groundWidth, this.groundHeight, undefined, 1000, "#000000", 0, 0);
            game.display.drawImageInLayer(this.victoryScreen, this.groundWidth, this.groundHeight, 0, 0);
            this.ball.speed = 0;
        }
    },

    collideBallWithWalls: function() {
        if ((this.ball.posX >= this.groundWidth)) {
            this.playerOne.score++;
            this.checkMaxScoreReached();
            this.scoreLayer.clear();
            this.displayScore(this.playerOne.score, this.playerTwo.score);
            this.resetBallPosition();
        }
        if ((this.ball.posX <= 0)) {
            this.playerTwo.score++;
            this.checkMaxScoreReached();
            this.scoreLayer.clear();
            this.displayScore(this.playerOne.score, this.playerTwo.score);
            this.resetBallPosition();
        }
    },

    collideBallWithPlayersAndAction: function() {
        if (this.ball.collide(game.playerOne)) {
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
        if (this.ball.collide(game.playerTwo)) {
            game.ball.directionX = -game.ball.directionX;
            this.playerSound.play();
        }
    },

    movePlayers: function() {
        if (game.control.controlSystem == "KEYBOARD") {
            // keyboard control
            if (game.playerOne.goUp) {
                game.playerOne.posY -= 5;
            } else if (game.playerOne.goDown) {
                game.playerOne.posY += 5;
            }
        } else if (game.control.controlSystem == "MOUSE") {
            // mouse control
            if (game.playerOne.goUp && game.playerOne.posY > game.control.mousePointer)
                game.playerOne.posY -= 5;
            else if (game.playerOne.goDown && game.playerOne.posY < game.control.mousePointer)
                game.playerOne.posY += 5;
        }
    },

    initMouse: function(onMouseMoveFunction) {
        window.onmousemove = onMouseMoveFunction;
    },

    displayScore: function(scorePlayer1, scorePlayer2) {
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer1, "60px Arial", "#FFFFFF", this.scorePosPlayer1, 55);
        game.display.drawTextInLayer(this.scoreLayer, scorePlayer2, "60px Arial", "#FFFFFF", this.scorePosPlayer2, 55);
    },

    displayBall: function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.ball.width, this.ball.height, this.ball.color, this.ball.posX, this.ball.posY);
    },

    moveBall: function() {
        this.ball.move();
        this.ball.bounce(this.wallSound);
        this.displayBall();
    },

    movePlayers: function() {
        if (game.playerOne.goUp && game.playerOne.posY > 0)
            game.playerOne.posY -= 5;
        else if (game.playerOne.goDown && game.playerOne.posY < game.groundHeight - game.playerOne.height)
            game.playerOne.posY += 5;
    },

    displayPlayers: function() {
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerOne.width, this.playerOne.height, this.playerOne.color, this.playerOne.posX, this.playerOne.posY);
        game.display.drawRectangleInLayer(this.playersBallLayer, this.playerTwo.width, this.playerTwo.height, this.playerTwo.color, this.playerTwo.posX, this.playerTwo.posY);
    },

    clearLayer: function(targetLayer) {
        targetLayer.clear();
    },

    initKeyboard: function(onKeyDownFunction, onKeyUpFunction) {
        window.onkeydown = onKeyDownFunction;
        window.onkeyup = onKeyUpFunction;
    }

};