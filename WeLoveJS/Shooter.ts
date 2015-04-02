///<reference path='Engine.ts'/>
class ShooterScenario extends Engine.Scenario { 
    private score: Engine.TextAnimation;
    private removedEnemyCounter: number;

    public pad: IPad;
    public player: Player;
    public shots: Array<Shot>;
    public enemies: Array<Engine.ISprite>;
    public explosions: Array<Engine.ISprite>;
    public enemyCounter: number;

    constructor(canvas: HTMLCanvasElement, pad: IPad) {
        super(canvas);

        this.pad = pad;
        this.pad.onfire = () => { this.shoot(); };
    }

    start(framesPerSecond: number) : void { 
        super.start(framesPerSecond);

        this.things = [];
        this.shots = [];
        this.enemies = [];
        this.explosions = [];
        this.enemyCounter = 0;
        this.removedEnemyCounter = 0;

        var bg = this.createBackground(30);
        if (bg) this.things.push(bg);

        this.score = this.createScore();
        this.player = this.createPlayer(20, 100);
        if (this.player) this.things.push(this.player);

        this.resources.playAudio('background-music');

        setTimeout(() => { this.addEnemy(); }, Math.random() * 2000);
    }

    createBackground(speed: number): Engine.Sprite {
        return null;
    }

    createScore(): Engine.TextAnimation {
        return null;
    }

    createPlayer(x?: number, y?: number): Player { 
        return null;
    }

    createEnemy(): Engine.Sprite {
        return null;
    }

    createShot() : Shot {
        return null;
    }

    createExplosion(): Engine.Sprite {
        return null;
    }

    addEnemy() {
        setTimeout(() => { this.addEnemy(); }, Math.random() * 3000);
        var enemy = this.createEnemy();
        if (enemy) {
            enemy.position.x = 950 + Math.random() * 40;
            enemy.position.y = Math.random() * 500;
            
            enemy.speed = Math.random() * 50 + 40;

            this.enemies.push(enemy);
            this.things.push(enemy);
        }
    }

    shoot(): void {
        var shot = this.createShot();
        if (shot) {
            this.shots.push(shot);
            this.things.push(shot);
        }

        this.resources.playAudio('laser');
    }

    explote(x: number, y: number) {
        var sprite = this.createExplosion();
        if (sprite) {
            sprite.position.x = x;
            sprite.position.y = y;

            this.explosions.push(sprite);
            this.things.push(sprite);
        }

        this.resources.playAudio('explosion');
    }

    deleteEnemy(enemy: Engine.ISprite, index: number) {
        var indez: number = this.things.indexOf(enemy);
        this.enemies.splice(index, 1);
        this.things.splice(indez, 1);
    }

    deleteShot(shot:Shot, index: number) {
        var indez: number = this.things.indexOf(shot);
        this.shots.splice(index, 1);
        this.things.splice(indez, 1);
    }

    deleteExplosion(explosion: Engine.ISprite, index: number) {
        var indez: number = this.things.indexOf(explosion);
        this.explosions.splice(index, 1);
        this.things.splice(indez, 1);
    }

    update(): void;
    update(ticks: number): void;
    update(ticks?: any): void {
        this.updateGame();
        super.update(ticks);
    }

    updateGame(): void {
        this.updateScore();
        this.updateShots();
        this.updateEnemies();
        this.updateExplosions();
        this.updateCollisions();
    }

    updateScore(): void {
        var score = this.removedEnemyCounter * 11 - Shot.counter;
        score = score < 0 ? 0 : score;
        this.score.text = "Score: " + score;
    }

    updateShots(): void {
        this.shots.forEach((shot, index) => {
            if (shot.shouldDelete) {
                this.deleteShot(shot, index);
            }
        });
    }

    updateExplosions(): void {
        this.explosions.forEach((explosion, index) => {
            var sprite = <Engine.Sprite>explosion;
            var animation = <Engine.ImageSheetAnimation>sprite.currentAnimation;
            if (animation.hasEnd) {
                this.deleteExplosion(explosion, index);
            }
        });
    }

    updateEnemies(): void {
        this.enemies.forEach((enemy, index) => {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 40, enemy.position.y));
            if (enemy.position.x <= -20) {
                this.deleteEnemy(enemy, index);
            }
        });
    }

    updateCollisions(): void {
        this.shots.forEach((shot, sindex) => {
            this.enemies.forEach((enemy, eindex) => {
                if (shot.collision(enemy) && !shot.shouldDelete) {
                    shot.shouldDelete = true;
                    this.deleteShot(shot, sindex);
                    this.deleteEnemy(enemy, eindex);
                    this.explote(enemy.position.x - 10, enemy.position.y - 10);
                    this.removedEnemyCounter++;
                }
            });
        });
    }
}

class Player extends Engine.Sprite {
    private pad: IPad;

    constructor(pad: IPad, animation: Engine.IAnimation) {
        super("player", animation);

        this.pad = pad;
        this.speed = 95;
    }

    public update(context: Engine.IUpdateContext) {
        super.update(context);
        this.updatePosition();
    }

    private updatePosition(): void {
        var x: number = this.position.x;
        var y: number = this.position.y;
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
    }
}

class Shot extends Engine.Sprite {
    public static counter: number = 0;

    public shouldDelete: boolean;
    private maxWidth: number;

    constructor(maxWidth: number, animation: Engine.IAnimation) {
        super("shoot-" + (Shot.counter++), animation);

        this.shouldDelete = false;
        this.speed = 100;
        this.maxWidth = maxWidth;
    }

    public update(context: Engine.IUpdateContext) {
        this.updatePosition();
        super.update(context);
    }

    private updatePosition(): void {
        this.move(new Engine.Point(this.position.x + 30, this.position.y));
        if (this.position.x >= this.maxWidth) {
            this.shouldDelete = true;
        }
        
    }
}

interface IPad {
    up: boolean;
    down: boolean;
    left: boolean;
    rigth: boolean;
    space: boolean;
    onfire: () => void;
}

class Pad implements IPad {
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