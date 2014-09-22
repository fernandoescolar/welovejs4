///<reference path='Engine.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShooterScenario = (function (_super) {
    __extends(ShooterScenario, _super);
    function ShooterScenario() {
        _super.apply(this, arguments);
    }
    ShooterScenario.prototype.start = function (framesPerSecond) {
        var _this = this;
        _super.prototype.start.call(this, framesPerSecond);

        this.shSound = document.getElementById('laser');
        this.exSound = document.getElementById('explosion');

        this.shoots = [];
        this.enemies = [];
        this.explosions = [];
        this.createBackground('images/farback.gif', 950, 600, 30);
        this.createBackground('images/starfield.png', 950, 600, 50);
        this.player = this.createPlayer('images/Ship.64x29.png', 10, 10, 64, 29);

        document.addEventListener('keydown', function (ev) {
            _this.getKey(ev);
        }, true);
        setTimeout(function () {
            _this.createEnemy('images/enemy.40x30.png', Math.random() * 900, 40, 30);
        }, Math.random() * 2000);
    };

    ShooterScenario.prototype.getKey = function (ev) {
        if (ev.keyCode == 38) {
            this.player.move(new Engine.Point(this.player.position.x, this.player.position.y - 30));
        } else if (ev.keyCode == 40) {
            this.player.move(new Engine.Point(this.player.position.x, this.player.position.y + 30));
        } else if (ev.keyCode == 39) {
            this.player.move(new Engine.Point(this.player.position.x + 30, this.player.position.y));
        } else if (ev.keyCode == 37) {
            this.player.move(new Engine.Point(this.player.position.x - 30, this.player.position.y));
        } else if (ev.keyCode == 32) {
            this.shot();
        }

        return false;
    };

    ShooterScenario.prototype.createBackground = function (imgSource, w, h, s) {
        var background = new Background('background', imgSource);
        background.position.x = 0;
        background.position.y = 0;
        background.size.width = w;
        background.size.height = h;
        background.speed = s;

        this.things.push(background);
        return background;
    };

    ShooterScenario.prototype.createPlayer = function (imgSource, x, y, w, h) {
        var sprite = new Sprite('player', imgSource, 4);
        sprite.position.x = x || Math.random() * 400;
        sprite.position.y = y || Math.random() * 150;
        sprite.size.width = w || 42;
        sprite.size.height = h || 42;
        sprite.speed = 90;

        this.things.push(sprite);
        return sprite;
    };

    ShooterScenario.prototype.createEnemy = function (imgSource, y, w, h) {
        var _this = this;
        setTimeout(function () {
            _this.createEnemy('images/enemy.40x30.png', Math.random() * 550, 40, 30);
        }, Math.random() * 2000);

        var sprite = new Sprite('enemy', imgSource, 6);
        sprite.position.x = 950 + Math.random() * 40;
        sprite.position.y = y;
        sprite.size.width = w;
        sprite.size.height = h;
        sprite.speed = 50;

        this.enemies.push(sprite);
        this.things.push(sprite);
        return sprite;
    };

    ShooterScenario.prototype.shot = function () {
        var sprite = new Sprite('player', 'images/shot.png', 4);
        sprite.position.x = this.player.position.x + 30;
        sprite.position.y = this.player.position.y + 3;
        sprite.size.width = 16;
        sprite.size.height = 16;
        sprite.speed = 100;

        this.shoots.push(sprite);
        this.things.push(sprite);
        this.shSound.currentTime = 0;
        this.shSound.play();
    };

    ShooterScenario.prototype.explote = function (x, y) {
        var sprite = new Sprite('explosion', 'images/explosion.png', 64);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.size.width = 60;
        sprite.size.height = 60;
        sprite.speed = 80;
        sprite.loop = false;

        this.explosions.push(sprite);
        this.things.push(sprite);
        this.exSound.currentTime = 0;
        this.exSound.play();
    };

    ShooterScenario.prototype.update = function (ticks) {
        this.updateGame();
        _super.prototype.update.call(this, ticks);
    };

    ShooterScenario.prototype.updateGame = function () {
        var _this = this;
        var toDelete = [];

        this.shoots.forEach(function (shoot) {
            shoot.move(new Engine.Point(shoot.position.x + 30, shoot.position.y));
            if (shoot.position.x >= 950) {
                toDelete.push(shoot);
            }
        });

        toDelete.forEach(function (shoot) {
            var index = _this.shoots.indexOf(shoot);
            var indez = _this.things.indexOf(shoot);
            _this.shoots.splice(index, 1);
            _this.things.splice(indez, 1);
        });

        toDelete = [];
        this.enemies.forEach(function (enemy) {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 25, enemy.position.y));
            if (enemy.position.x <= -20) {
                toDelete.push(enemy);
            }
        });

        toDelete.forEach(function (enemy) {
            var index = _this.enemies.indexOf(enemy);
            var indez = _this.things.indexOf(enemy);
            _this.enemies.splice(index, 1);
            _this.things.splice(indez, 1);
        });

        toDelete = [];
        this.explosions.forEach(function (explosion) {
            var sprite = explosion;
            if (sprite.hasEnd) {
                toDelete.push(explosion);
            }
        });

        toDelete.forEach(function (explosion) {
            var index = _this.explosions.indexOf(explosion);
            var indez = _this.things.indexOf(explosion);
            _this.explosions.splice(index, 1);
            _this.things.splice(indez, 1);
        });

        this.shoots.forEach(function (shoot) {
            _this.enemies.forEach(function (enemy) {
                if (shoot.collision(enemy)) {
                    var sindex = _this.shoots.indexOf(shoot);
                    var sindez = _this.things.indexOf(shoot);
                    _this.shoots.splice(sindex, 1);
                    _this.things.splice(sindez, 1);

                    var eindex = _this.enemies.indexOf(enemy);
                    var eindez = _this.things.indexOf(enemy);
                    _this.enemies.splice(eindex, 1);
                    _this.things.splice(eindez, 1);

                    _this.explote(enemy.position.x - 10, enemy.position.y - 10);
                }
            });
        });
    };
    return ShooterScenario;
})(Engine.Scenario);

var Background = (function (_super) {
    __extends(Background, _super);
    function Background(id, imageSource) {
        _super.call(this, id);

        this.image = document.createElement("img");
        this.image.src = imageSource;
        this.speed = 10;
    }
    Background.prototype.update = function (ticks) {
        _super.prototype.update.call(this, ticks);

        var delta = ticks / (100 - this.speed);
        this.position.x += delta;
        if (this.position.x > this.image.width) {
            this.position.x = 0;
        }
    };

    Background.prototype.draw = function (graphics) {
        _super.prototype.draw.call(this, graphics);

        if ((this.image.width - this.position.x) < this.size.width) {
            var offsetA = this.image.width - this.position.x;
            var offsetB = this.size.width - offsetA;
            graphics.drawImage(this.image, this.position.x, 0, offsetA, this.size.height, 0, 0, offsetA, this.size.height);

            graphics.drawImage(this.image, 0, 0, offsetB, this.size.height, offsetA, 0, offsetB, this.size.height);
        } else {
            graphics.drawImage(this.image, this.position.x, 0, this.size.width, this.size.height, 0, 0, this.size.width, this.size.height);
        }
    };
    return Background;
})(Engine.Thing);

var Sprite = (function (_super) {
    __extends(Sprite, _super);
    function Sprite(id, imageSource, frameCount) {
        _super.call(this, id);

        this.image = document.createElement("img");
        this.image.src = imageSource;
        this.frameCount = frameCount;
        this.frameIndex = 0;
        this.speed = 10;
        this.loop = true;
        this.ticks = 0;
        this.hasEnd = false;
    }
    Sprite.prototype.update = function (ticks) {
        _super.prototype.update.call(this, ticks);
        this.ticks += ticks;
        if (this.ticks / (100 - this.speed) >= 1) {
            this.ticks = 0;
            if (this.frameIndex < this.frameCount - 1) {
                this.frameIndex += 1;
            } else if (this.loop) {
                this.frameIndex = 0;
            } else {
                this.hasEnd = true;
            }
        }
    };

    Sprite.prototype.draw = function (graphics) {
        _super.prototype.draw.call(this, graphics);

        graphics.drawImage(this.image, 0, this.frameIndex * this.size.height, this.size.width, this.size.height, this.position.x, this.position.y, this.size.width, this.size.height);
    };
    return Sprite;
})(Engine.SolidAnimatedThing);
//# sourceMappingURL=Shooter.js.map
