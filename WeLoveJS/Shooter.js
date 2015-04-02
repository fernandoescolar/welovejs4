var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
///<reference path='Engine.ts'/>
var ShooterScenario = (function (_super) {
    __extends(ShooterScenario, _super);
    function ShooterScenario(canvas, pad) {
        var _this = this;
        _super.call(this, canvas);

        this.pad = pad;
        this.pad.onfire = function () {
            _this.shoot();
        };
    }
    ShooterScenario.prototype.start = function (framesPerSecond) {
        var _this = this;
        _super.prototype.start.call(this, framesPerSecond);

        this.things = [];
        this.shots = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyCounter = 0;
        this.removedEnemyCounter = 0;

        var bg = this.createBackground(30);
        if (bg)
            this.things.push(bg);

        this.score = this.createScore();
        this.player = this.createPlayer(20, 100);
        if (this.player)
            this.things.push(this.player);

        this.resources.playAudio('background-music');

        setTimeout(function () {
            _this.addEnemy();
        }, Math.random() * 2000);
    };

    ShooterScenario.prototype.createBackground = function (speed) {
        return null;
    };

    ShooterScenario.prototype.createScore = function () {
        return null;
    };

    ShooterScenario.prototype.createPlayer = function (x, y) {
        return null;
    };

    ShooterScenario.prototype.createEnemy = function () {
        return null;
    };

    ShooterScenario.prototype.createShot = function () {
        return null;
    };

    ShooterScenario.prototype.createExplosion = function () {
        return null;
    };

    ShooterScenario.prototype.addEnemy = function () {
        var _this = this;
        setTimeout(function () {
            _this.addEnemy();
        }, Math.random() * 3000);
        var enemy = this.createEnemy();
        if (enemy) {
            enemy.position.x = 950 + Math.random() * 40;
            enemy.position.y = Math.random() * 500;

            enemy.speed = Math.random() * 50 + 40;

            this.enemies.push(enemy);
            this.things.push(enemy);
        }
    };

    ShooterScenario.prototype.shoot = function () {
        var shot = this.createShot();
        if (shot) {
            this.shots.push(shot);
            this.things.push(shot);
        }

        this.resources.playAudio('laser');
    };

    ShooterScenario.prototype.explote = function (x, y) {
        var sprite = this.createExplosion();
        if (sprite) {
            sprite.position.x = x;
            sprite.position.y = y;

            this.explosions.push(sprite);
            this.things.push(sprite);
        }

        this.resources.playAudio('explosion');
    };

    ShooterScenario.prototype.deleteEnemy = function (enemy, index) {
        var indez = this.things.indexOf(enemy);
        this.enemies.splice(index, 1);
        this.things.splice(indez, 1);
    };

    ShooterScenario.prototype.deleteShot = function (shot, index) {
        var indez = this.things.indexOf(shot);
        this.shots.splice(index, 1);
        this.things.splice(indez, 1);
    };

    ShooterScenario.prototype.deleteExplosion = function (explosion, index) {
        var indez = this.things.indexOf(explosion);
        this.explosions.splice(index, 1);
        this.things.splice(indez, 1);
    };

    ShooterScenario.prototype.update = function (ticks) {
        this.updateGame();
        _super.prototype.update.call(this, ticks);
    };

    ShooterScenario.prototype.updateGame = function () {
        this.updateScore();
        this.updateShots();
        this.updateEnemies();
        this.updateExplosions();
        this.updateCollisions();
    };

    ShooterScenario.prototype.updateScore = function () {
        var score = this.removedEnemyCounter * 11 - Shot.counter;
        score = score < 0 ? 0 : score;
        this.score.text = "Score: " + score;
    };

    ShooterScenario.prototype.updateShots = function () {
        var _this = this;
        this.shots.forEach(function (shot, index) {
            if (shot.shouldDelete) {
                _this.deleteShot(shot, index);
            }
        });
    };

    ShooterScenario.prototype.updateExplosions = function () {
        var _this = this;
        this.explosions.forEach(function (explosion, index) {
            var sprite = explosion;
            var animation = sprite.currentAnimation;
            if (animation.hasEnd) {
                _this.deleteExplosion(explosion, index);
            }
        });
    };

    ShooterScenario.prototype.updateEnemies = function () {
        var _this = this;
        this.enemies.forEach(function (enemy, index) {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 40, enemy.position.y));
            if (enemy.position.x <= -20) {
                _this.deleteEnemy(enemy, index);
            }
        });
    };

    ShooterScenario.prototype.updateCollisions = function () {
        var _this = this;
        this.shots.forEach(function (shot, sindex) {
            _this.enemies.forEach(function (enemy, eindex) {
                if (shot.collision(enemy) && !shot.shouldDelete) {
                    shot.shouldDelete = true;
                    _this.deleteShot(shot, sindex);
                    _this.deleteEnemy(enemy, eindex);
                    _this.explote(enemy.position.x - 10, enemy.position.y - 10);
                    _this.removedEnemyCounter++;
                }
            });
        });
    };
    return ShooterScenario;
})(Engine.Scenario);

var Player = (function (_super) {
    __extends(Player, _super);
    function Player(pad, animation) {
        _super.call(this, "player", animation);

        this.pad = pad;
        this.speed = 95;
    }
    Player.prototype.update = function (context) {
        _super.prototype.update.call(this, context);
        this.updatePosition();
    };

    Player.prototype.updatePosition = function () {
        var x = this.position.x;
        var y = this.position.y;
        if (this.pad.up) {
            y -= 30;
        }

        if (this.pad.down) {
            y += 30;
        }

        if (this.pad.rigth) {
            x += 30;
        }

        if (this.pad.left) {
            x -= 30;
        }

        this.move(new Engine.Point(x, y));
    };
    return Player;
})(Engine.Sprite);

var Shot = (function (_super) {
    __extends(Shot, _super);
    function Shot(maxWidth, animation) {
        _super.call(this, "shoot-" + (Shot.counter++), animation);

        this.shouldDelete = false;
        this.speed = 100;
        this.maxWidth = maxWidth;
    }
    Shot.prototype.update = function (context) {
        this.updatePosition();
        _super.prototype.update.call(this, context);
    };

    Shot.prototype.updatePosition = function () {
        this.move(new Engine.Point(this.position.x + 30, this.position.y));
        if (this.position.x >= this.maxWidth) {
            this.shouldDelete = true;
        }
    };
    Shot.counter = 0;
    return Shot;
})(Engine.Sprite);

var Pad = (function () {
    function Pad() {
        var _this = this;
        document.addEventListener('keydown', function (ev) {
            _this.onKeyDown(ev);
        }, true);
        document.addEventListener('keyup', function (ev) {
            _this.onKeyUp(ev);
        }, true);

        this.up = false;
        this.down = false;
        this.left = false;
        this.rigth = false;
        this.space = false;
    }
    Pad.prototype.onKeyDown = function (ev) {
        ev.preventDefault();

        if (ev.keyCode == 38) {
            this.up = true;
        } else if (ev.keyCode == 40) {
            this.down = true;
        } else if (ev.keyCode == 39) {
            this.rigth = true;
        } else if (ev.keyCode == 37) {
            this.left = true;
        } else if (ev.keyCode == 32) {
            if (!this.space) {
                if (this.onfire) {
                    this.onfire();
                }
            }
            this.space = true;
        }

        return false;
    };

    Pad.prototype.onKeyUp = function (ev) {
        ev.preventDefault();

        if (ev.keyCode == 38) {
            this.up = false;
        } else if (ev.keyCode == 40) {
            this.down = false;
        } else if (ev.keyCode == 39) {
            this.rigth = false;
        } else if (ev.keyCode == 37) {
            this.left = false;
        } else if (ev.keyCode == 32) {
            this.space = false;
        }

        return false;
    };
    return Pad;
})();
//# sourceMappingURL=Shooter.js.map
