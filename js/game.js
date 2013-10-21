var cardPredix = 'images/cards2/', cardExt = '.png';

var mapIdToNameOfCards = {
    1: '2_of_clubs',
    2: '2_of_diamonds',
    3: '2_of_hearts',
    4: '2_of_spades',
    5: '3_of_clubs',
    6: '3_of_diamonds',
    7: '3_of_hearts',
    8: '3_of_spades',
    9: '4_of_clubs',
    10: '4_of_diamonds',
    11: '4_of_hearts',
    12: '4_of_spades',
    13: '5_of_clubs',
    14: '5_of_diamonds',
    15: '5_of_hearts',
    16: '5_of_spades',

    17: '6_of_clubs',
    18: '6_of_diamonds',
    19: '6_of_hearts',
    20: '6_of_spades',
    21: '7_of_clubs',
    22: '7_of_diamonds',
    23: '7_of_hearts',
    24: '7_of_spades',
    25: '8_of_clubs',
    26: '8_of_diamonds',
    27: '8_of_hearts',
    28: '8_of_spades',
    29: '9_of_clubs',
    30: '9_of_diamonds',
    31: '9_of_hearts',
    32: '9_of_spades',
    33: '10_of_clubs',
    34: '10_of_diamonds',
    35: '10_of_hearts',
    36: '10_of_spades',

    37: 'jack_of_clubs',
    38: 'jack_of_diamonds',
    39: 'jack_of_hearts',
    40: 'jack_of_spades',

    41: 'queen_of_clubs',
    42: 'queen_of_diamonds',
    43: 'queen_of_hearts',
    44: 'queen_of_spades',

    45: 'king_of_clubs',
    46: 'king_of_diamonds',
    47: 'king_of_hearts',
    48: 'king_of_spades',

    49: 'ace_of_clubs',
    50: 'ace_of_diamonds',
    51: 'ace_of_hearts',
    52: 'ace_of_spades'

};

function getCardPath(n) {
    var cardpath = cardPredix + mapIdToNameOfCards[n] + cardExt;
    return cardpath;
}

var Card = (function () {
    function Card(n) {
        this.id = n;
        this.img = new Image();
        this.img.src = getCardPath(n);
    };

    Card.prototype.equals = function (c) {
        return (this.id == c.id);
    }

    Card.prototype.draw = function (position) {
        ctx.drawImage(this.img, position.x, position.y, cardWidth, cardHeigh);
    };

    Card.prototype.drawEnd = function (position) {
        ctx.drawImage(this.img, position.x, position.y, cardWidth * (1 + aosscale), cardHeigh * (1 + aosscale));
    };
    return Card;
})();

function createPack() {
    var pck = [];
    for (var i = 1; i <= 52; i++) {
        pck.push(new Card(i));
    }
    return pck;
}

function drawRoundRect(ctx, x, y, width, height, radius) {
    radius || (radius = 5);

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

var Pack = (function () {
    function Pack() {
        this.pack = createPack();
        this.img = new Image();

        this.img.src = 'images/cardback.png';

    };

    Pack.prototype.shuffle = function (force) {
        if (force == undefined) force = 10;
        var tempCard, k1, k2;
        for (var i = 0; i < force * this.size(); i++) {
            k1 = Math.floor(Math.random() * this.size());
            k2 = Math.floor(Math.random() * this.size());

            tempCard = this.pack[k1];
            this.pack[k1] = this.pack[k2];
            this.pack[k2] = tempCard;
        }

    };

    Pack.prototype.print = function () {
        console.log(this.pack);
    }

    Pack.prototype.size = function () {
        return this.pack.length;
    }

    Pack.prototype.pop = function () {
        return this.pack.pop();
    }

    Pack.prototype.isEmpty = function () {
        return (this.pack.length == 0);
    }

    Pack.prototype.draw = function (position) {
        drawRoundRect(ctx, position.x, position.y, cardWidth, cardHeigh, 6);
        ctx.fillStyle = "rgb(255,255,255)";
        ctx.fill();

        ctx.drawImage(this.img, position.x, position.y, cardWidth, cardHeigh);

        ctx.font = "32px Calibri";
        ctx.textAlign = "left";
        ctx.fillStyle = "#f00";
        ctx.fillText(this.pack.length, position.x + 42, position.y - 16);

    };
    return Pack;
})();

var Player = (function () {
    function Player(n, pos) {
        this.id = n
        this.cards = [];
        this.position = pos;
    };


    Player.prototype.push = function (c) {
        this.cards.push(c);
    }

    Player.prototype.contains = function (c) {
        for (var i = 0; i < this.cards.length; i++) {
            if (this.cards[i].equals(c))return true;
        }
        return false;
    }

    Player.prototype.fatalContains = function () {
        for (var i = 0; i < this.cards.length; i++) {

            if (this.cards[i].id == 52) return true;
        }
        return false;
    }

    Player.prototype.draw = function () {
        //var position = this.position;
        if (this.cards.length > 0) {
            this.cards[this.cards.length - 1].draw(this.position);
        } else {
            drawRoundRect(ctx, this.position.x, this.position.y, cardWidth, cardHeigh, 6);
            ctx.fillStyle = "rgb(255,255,255)";
            ctx.fill();
        }
    };

    Player.prototype.drawEnd = function () {
        var newPos = new Vector2d(this.position.x - cardWidth * aosscale * 0.5, this.position.y - cardHeigh * aosscale * 0.5);
        this.cards[this.cards.length - 1].drawEnd(newPos);

        var pp = newPos;

        ctx.font = "32px Calibri";
        ctx.textAlign = "left";
        ctx.fillStyle = "#f00";
        ctx.fillText("обманул!", pp.x + 24, pp.y + cardHeigh * (1 + aosscale) + 32);
    }


    return Player;
})();

var AoSGame = (function () {
    function AoSGame(n, c) {
        this.center = c;

        this.players = this.createPlayers(n);
        this.currentPlayer = 0;
        this.pack = new Pack();
        this.pack.shuffle(10);
        this.gameover = false;
        this.lastCard;
    };

    AoSGame.prototype.createPlayers = function (n) {
        var plrs = [];
        var x = 128;
        for (var i = 0; i < n; i++) {
            plrs.push(new Player(i, new Vector2d(x, this.center.y + cardHeigh + 128)));
            x += cardWidth + cardsGap;
        }
        return plrs;
    };

    AoSGame.prototype.packClicked = function (p) {
        return (p.x > this.center.x && p.x < this.center.x + cardWidth && p.y > this.center.y && p.y < this.center.y + cardHeigh);
    };

    AoSGame.prototype.packClicked = function (p) {
        return (p.x > this.center.x && p.x < this.center.x + cardWidth && p.y > this.center.y && p.y < this.center.y + cardHeigh);
    };

    AoSGame.prototype.moveCardToPlayer = function () {
        var topCard = this.pack.pop();
        this.lastCard = topCard;
        this.players[this.currentPlayer].push(topCard);
    };

    AoSGame.prototype.nextPlayer = function () {
        this.currentPlayer++;
        if (this.currentPlayer == this.players.length)this.currentPlayer = 0;
    };

    AoSGame.prototype.isOver = function () {
        return (this.lastCard.id == 52);
    };

    AoSGame.prototype.draw = function () {
        clearScreen();
        this.pack.draw(this.center);

        //draw players

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].draw();

        }


    };

    AoSGame.prototype.tick = function (p) {
        if (this.gameover)return;
        var clickFlag = this.packClicked(p);
        if (clickFlag) {
            this.moveCardToPlayer();
            //var pn = this.isOver();
            //console.log(this.lastCard.id);
            if (this.isOver()) {
                this.endGame();
                return;
            }
            this.nextPlayer();
        }

        this.draw();
    };

    AoSGame.prototype.endGame = function () {
        this.gameover = true;
        this.draw();
        this.drawEnd();
    };

    AoSGame.prototype.drawEnd = function () {
        this.players[this.currentPlayer].drawEnd();
    }

    return AoSGame;
})();

var Vector2d = (function () {
    function Vector2d(x, y) {
        this.x = x;
        this.y = y;
    }

    Vector2d.prototype.copy = function () {
        return new Vector2d(this.x, this.y);
    };
    Vector2d.prototype.len = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2d.prototype.is_null = function () {
        return this.x == 0 && this.y == 0;
    };
    Vector2d.prototype.add_vector = function (v) {
        return new Vector2d(this.x + v.x, this.y + v.y);
    };
    Vector2d.prototype.add_vector2 = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    Vector2d.prototype.mul_scalar = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector2d.prototype.mul = function (n) {
        return new Vector2d(this.x * n, this.y * n);
    };
    Vector2d.prototype.mul2 = function (n) {
        this.x *= n;
        this.y *= n;
    };
    Vector2d.prototype.d = function (v) {
        return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2));
    };
    Vector2d.prototype.dima = function (v) {
        return v.add_vector(this.mul(-1));
    };
    Vector2d.prototype.normalize = function () {
        if (!this.is_null()) {
            var len = this.len();
            this.x /= len;
            this.y /= len;
        }
    };
    return Vector2d;
})();

function clearScreen() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
}

var $window = $(window),
    ctx,
    canvasWidth = $window.width() - 4,
    canvasHeight = $window.height() - 4,
    cardHeigh = 128 * 1.5,
    cardWidth = 128,
    aosgame,
    cardsGap = 64;
aosscale = 0.4;

//======================
function initGame() {
    aosgame = new AoSGame(4, new Vector2d(256, 100));
}

function startGame() {
    aosgame.draw();
}


var isClick = false;


function handleClick(p) {
    //alert("23");
    if (isClick)return;
    isClick = true;
    aosgame.tick(p);

    //вычисление куда попал клик
    //отработка колоды, обновление карт
    //визуализация событий
    //отрисовка

    isClick = false;
}


function handleKeyUp() {
    //xfilter.cy(-2);
}
function handleKeyDown() {
    //xfilter.cy(2);
}
function handleKeyRight() {
    //xfilter.cdir(-2);
}
function handleKeyLeft() {
    //xfilter.cdir(2);
}
function handleKeySpace() {
    //xfilter.cdir(0);
}

function handleKeyM() {
    //colorbonus = !colorbonus;
}

function handleEsc() {
    //show_menu("Пауза");
}

// function showMenu(information, ctx, width, height, game) {
//     var menu = new TitleScreen("Balloon Sucker", information);
//     menu.draw(ctx, width, height);

//     $(document).one('click', function () {
//         if (game.isOver()) {
//             game.init();
//         }
//         game.start();
//     });
// }

function toVector2d(e, c) {
    return new Vector2d(e.pageX - c.left, e.pageY - c.top);
}


// Application start.
$window.load(function () {
    var $canvas = $('#pole').focus(),
        canvas = $canvas[0],
        canvasPosition = $canvas.offset(),
        pixelRatio = window.devicePixelRatio || 1;

    canvas.width = canvasWidth * pixelRatio;
    canvas.height = canvasHeight * pixelRatio;

    $canvas.css({ width: canvasWidth, height: canvasHeight });

    var ctx1 = canvas.getContext('2d');
    ctx1.scale(pixelRatio, pixelRatio);

    ctx = ctx1;
    initGame();
    startGame();
    $(document)
        // .on('mousedown', function (e) {
        //     handleDown(toVector2d(e, canvasPosition));
        // })
        // .on('mousemove', function (e) {
        //     handleMove(toVector2d(e, canvasPosition));
        // })
        // .on('mouseup', handleUp);
        .on('click', function (e) {
            //alert("123");
            handleClick(toVector2d(e, canvasPosition));
        });


    KeyboardController({
        27: handleEsc,
        37: handleKeyLeft,
        38: handleKeyUp,
        39: handleKeyRight,
        40: handleKeyDown,
        32: handleKeySpace,
        77: handleKeyM
    }, 100);

});
