///<reference path='Engine.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ShooterScenario = (function (_super) {
    __extends(ShooterScenario, _super);
    function ShooterScenario(canvas) {
        var _this = this;
        _super.call(this, canvas);

        this.pad = new Pad();
        this.pad.onfire = function () {
            _this.shoot();
        };

        this.resources.loadImage('background', 'images/farback.gif');
        this.resources.loadImage('background-paralax', 'images/starfield.png');
        this.resources.loadImage('player', 'images/Ship.64x29.png');
        this.resources.loadImage('enemy', 'images/enemy.40x30.png');
        this.resources.loadImage('shot', 'images/shot.png');
        this.resources.loadImage('explosion', 'images/explosion.png');

        this.resources.loadAudio('background-music', 'sound/spankmonkey.mp3');
        this.resources.loadAudio('laser', 'sound/laser.mp3');
        this.resources.loadAudio('explosion', 'sound/explosion.mp3');

        this.resources.preload(function () {
            _this.start(60);
        });
    }
    ShooterScenario.prototype.start = function (framesPerSecond) {
        var _this = this;
        _super.prototype.start.call(this, framesPerSecond);

        this.things = [];
        this.shots = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyCounter = 0;

        this.createBackground('background', 30);
        this.createBackground('background-paralax', 50);
        this.player = this.createPlayer(10, 10);

        this.resources.playAudio('background-music');

        setTimeout(function () {
            _this.createEnemy();
        }, Math.random() * 2000);
    };

    ShooterScenario.prototype.createBackground = function (imgName, speed) {
        var animation = new Engine.ContinuousImageAnimation(imgName, this.resources.images.get(imgName));
        var sprite = new Engine.Sprite(imgName, animation);
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.size.width = 950;
        sprite.size.height = 600;
        animation.speed = speed;

        this.things.push(sprite);
    };

    ShooterScenario.prototype.createPlayer = function (x, y) {
        var animation = new Engine.ImageSheetAnimation('player', this.resources.images.get('player'), 4, true, true);
        var sprite = new Engine.Sprite('player', animation);
        sprite.position.x = x || Math.random() * 900;
        sprite.position.y = y || Math.random() * 550;
        sprite.size.width = 64;
        sprite.size.height = 29;
        sprite.speed = 95;
        animation.speed = 10;

        this.things.push(sprite);
        return sprite;
    };

    ShooterScenario.prototype.createEnemy = function () {
        var _this = this;
        setTimeout(function () {
            _this.createEnemy();
        }, Math.random() * 3000);

        var animation = new Engine.ImageSheetAnimation('enemy', this.resources.images.get('enemy'), 6, true, true);
        var sprite = new Engine.Sprite('enemy-' + this.enemyCounter, animation);
        sprite.position.x = 950 + Math.random() * 40;
        sprite.position.y = Math.random() * 500;
        sprite.size.width = 40;
        sprite.size.height = 30;
        sprite.speed = Math.random() * 50 + 40;
        animation.speed = sprite.speed;

        this.enemies.push(sprite);
        this.things.push(sprite);
        return sprite;
    };

    ShooterScenario.prototype.shoot = function () {
        var animation = new Engine.ImageSheetAnimation('shot', this.resources.images.get('shot'), 4, true, true);
        var sprite = new Engine.Sprite('shot', animation);
        sprite.position.x = this.player.position.x + 60;
        sprite.position.y = this.player.position.y + 7;
        sprite.size.width = 16;
        sprite.size.height = 16;
        sprite.speed = 100;

        this.shots.push(sprite);
        this.things.push(sprite);

        this.resources.playAudio('laser');
    };

    ShooterScenario.prototype.explote = function (x, y) {
        var animation = new Engine.ImageSheetAnimation('explosion', this.resources.images.get('explosion'), 64, false, true);
        var sprite = new Engine.Sprite('explosion', animation);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.size.width = 60;
        sprite.size.height = 60;
        animation.speed = 80;

        this.explosions.push(sprite);
        this.things.push(sprite);

        this.resources.playAudio('explosion');
    };

    ShooterScenario.prototype.update = function (ticks) {
        this.updateGame();
        _super.prototype.update.call(this, ticks);
    };

    ShooterScenario.prototype.updateGame = function () {
        this.updateShots();
        this.updateEnemies();
        this.updateExplosions();
        this.updateCollisions();
        this.updatePlayer();
    };

    ShooterScenario.prototype.updateShots = function () {
        var _this = this;
        var toDelete = [];

        this.shots.forEach(function (shot) {
            shot.move(new Engine.Point(shot.position.x + 30, shot.position.y));
            if (shot.position.x >= 950) {
                toDelete.push(shot);
            }
        });

        toDelete.forEach(function (shot) {
            var index = _this.shots.indexOf(shot);
            var indez = _this.things.indexOf(shot);
            _this.shots.splice(index, 1);
            _this.things.splice(indez, 1);
        });
    };

    ShooterScenario.prototype.updateExplosions = function () {
        var _this = this;
        var toDelete = [];

        this.explosions.forEach(function (explosion) {
            var sprite = explosion;
            var animation = sprite.currentAnimation;
            if (animation.hasEnd) {
                toDelete.push(explosion);
            }
        });

        toDelete.forEach(function (explosion) {
            var index = _this.explosions.indexOf(explosion);
            var indez = _this.things.indexOf(explosion);
            _this.explosions.splice(index, 1);
            _this.things.splice(indez, 1);
        });
    };

    ShooterScenario.prototype.updateEnemies = function () {
        var _this = this;
        var toDelete = [];
        this.enemies.forEach(function (enemy) {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 40, enemy.position.y));
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
    };

    ShooterScenario.prototype.updateCollisions = function () {
        var _this = this;
        this.shots.forEach(function (shot) {
            _this.enemies.forEach(function (enemy) {
                if (shot.collision(enemy)) {
                    var sindex = _this.shots.indexOf(shot);
                    var sindez = _this.things.indexOf(shot);
                    _this.shots.splice(sindex, 1);
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

    ShooterScenario.prototype.updatePlayer = function () {
        var x = this.player.position.x;
        var y = this.player.position.y;
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

        this.player.move(new Engine.Point(x, y));
    };
    return ShooterScenario;
})(Engine.Scenario);

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
