///<reference path='Engine.ts'/>

class ShooterScenario extends Engine.Scenario { 
    private pad: Pad;
    private player: Engine.ISolidScalableMovableThing;
    private shots: Array<Engine.ISolidScalableMovableThing>;
    private enemies: Array<Engine.ISolidScalableMovableThing>;
    private explosions: Array<Engine.ISolidScalableMovableThing>;
    private enemyCounter: number;

    constructor(canvas: HTMLCanvasElement) {
        super(canvas);

        this.pad = new Pad();
        this.pad.onfire = () => { this.shoot(); };

        this.resources.loadImage('background', 'images/farback.gif');
        this.resources.loadImage('background-paralax', 'images/starfield.png');
        this.resources.loadImage('player', 'images/Ship.64x29.png');
        this.resources.loadImage('enemy', 'images/enemy.40x30.png');
        this.resources.loadImage('shot', 'images/shot.png');
        this.resources.loadImage('explosion', 'images/explosion.png');

        this.resources.loadAudio('background-music', 'sound/spankmonkey.mp3');
        this.resources.loadAudio('laser', 'sound/laser.mp3');
        this.resources.loadAudio('explosion', 'sound/explosion.mp3');

        this.resources.preload(() => { this.start(60); });
    }

    start(framesPerSecond: number) : void { 
        super.start(framesPerSecond);

        this.things = [];
        this.shots = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyCounter = 0;

        this.createBackground('background', 30);
        this.createBackground('background-paralax', 50);
        this.player = this.createPlayer(10, 10);
        
        this.resources.playAudio('background-music');

        setTimeout(() => { this.createEnemy(); }, Math.random() * 2000);
    }

    createBackground(imgName: string, speed: number): void {
        var animation = new Engine.ContinuousImageAnimation(imgName, this.resources.images.get(imgName));
        var sprite = new Engine.Sprite(imgName, animation);
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.size.width = 950 ;
        sprite.size.height = 600;
        animation.speed = speed;

        this.things.push(sprite);
    }

    createPlayer(x?: number, y?: number): Engine.ISprite { 
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
    }

    createEnemy() {
        setTimeout(() => { this.createEnemy(); }, Math.random() * 3000);

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
    }

    shoot(): void {
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
    }

    explote(x: number, y: number) {
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
    }

    update(): void;
    update(ticks: number): void;
    update(ticks?: any): void {
        this.updateGame();
        super.update(ticks);
    }

    updateGame(): void {

        this.updateShots();
        this.updateEnemies();
        this.updateExplosions();
        this.updateCollisions();
        this.updatePlayer();
    }

    updateShots(): void {
        var toDelete: Array<Engine.ISolidScalableMovableThing> = [];

        this.shots.forEach(shot => {
            shot.move(new Engine.Point(shot.position.x + 30, shot.position.y));
            if (shot.position.x >= 950) {
                toDelete.push(shot);
            }
        });

        toDelete.forEach(shot => {
            var index: number = this.shots.indexOf(shot);
            var indez: number = this.things.indexOf(shot);
            this.shots.splice(index, 1);
            this.things.splice(indez, 1);
        });
    }

    updateExplosions(): void {
        var toDelete: Array<Engine.ISolidScalableMovableThing> = [];

        this.explosions.forEach(explosion => {
            var sprite = <Engine.Sprite>explosion;
            var animation = <Engine.ImageSheetAnimation>sprite.currentAnimation;
            if (animation.hasEnd) {
                toDelete.push(explosion);
            }
        });

        toDelete.forEach(explosion => {
            var index: number = this.explosions.indexOf(explosion);
            var indez: number = this.things.indexOf(explosion);
            this.explosions.splice(index, 1);
            this.things.splice(indez, 1);
        });
    }

    updateEnemies(): void {
        var toDelete: Array<Engine.ISolidScalableMovableThing> = [];
        this.enemies.forEach(enemy => {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 40, enemy.position.y));
            if (enemy.position.x <= -20) {
                toDelete.push(enemy);
            }
        });

        toDelete.forEach(enemy => {
            var index: number = this.enemies.indexOf(enemy);
            var indez: number = this.things.indexOf(enemy);
            this.enemies.splice(index, 1);
            this.things.splice(indez, 1);
        });
    }

    updateCollisions(): void {
        this.shots.forEach(shot => {
            this.enemies.forEach(enemy => {
                if (shot.collision(enemy)) {
                    var sindex: number = this.shots.indexOf(shot);
                    var sindez: number = this.things.indexOf(shot);
                    this.shots.splice(sindex, 1);
                    this.things.splice(sindez, 1);

                    var eindex: number = this.enemies.indexOf(enemy);
                    var eindez: number = this.things.indexOf(enemy);
                    this.enemies.splice(eindex, 1);
                    this.things.splice(eindez, 1);

                    this.explote(enemy.position.x - 10, enemy.position.y - 10);
                }
            });
        });
    }

    updatePlayer() : void {
        var x: number = this.player.position.x;
        var y: number = this.player.position.y;
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
    }
}

class Pad {
    public up: boolean;
    public down: boolean;
    public left: boolean;
    public rigth: boolean;
    public space: boolean;
    public onfire: () => void;

    constructor() {
        document.addEventListener('keydown', (ev: KeyboardEvent) => { this.onKeyDown(ev); }, true);
        document.addEventListener('keyup', (ev: KeyboardEvent) => { this.onKeyUp(ev); }, true);

        this.up = false;
        this.down = false;
        this.left = false;
        this.rigth = false;
        this.space = false;
    }

    onKeyDown(ev: KeyboardEvent) {
        ev.preventDefault();

        if (ev.keyCode == 38) {
            this.up = true;
        }
        else if (ev.keyCode == 40) {
            this.down = true;
        }
        else if (ev.keyCode == 39) {
            this.rigth = true;
        }
        else if (ev.keyCode == 37) {
            this.left = true;
        }
        else if (ev.keyCode == 32) {
            if (!this.space) {
                if (this.onfire) {
                    this.onfire();
                }
            }
            this.space = true;
        }

        return false;
    }

    onKeyUp(ev: KeyboardEvent) {
        ev.preventDefault();

        if (ev.keyCode == 38) {
            this.up = false;
        }
        else if (ev.keyCode == 40) {
            this.down = false;
        }
        else if (ev.keyCode == 39) {
            this.rigth = false;
        }
        else if (ev.keyCode == 37) {
            this.left = false;
        }
        else if (ev.keyCode == 32) {
            this.space = false;
        }

        return false;
    }

}