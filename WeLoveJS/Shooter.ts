///<reference path='Engine.ts'/>

class ShooterScenario extends Engine.Scenario { 
    private pad: Pad;
    private player: Engine.ISolidAnimatedThing;
    private shots: Engine.ISolidAnimatedThing[];
    private enemies: Engine.ISolidAnimatedThing[];
    private explosions: Engine.ISolidAnimatedThing[];
    private exSound: HTMLAudioElement;
    private shSound: HTMLAudioElement;

    start(framesPerSecond: number) : void { 
        super.start(framesPerSecond);

        this.pad = new Pad();
        this.pad.onfire = () => { this.shot(); };

        this.shSound = <HTMLAudioElement>document.getElementById('laser');
        this.exSound = <HTMLAudioElement>document.getElementById('explosion');

        this.shots = [];
        this.enemies = [];
        this.explosions = [];
        this.createBackground('images/farback.gif', 950, 600, 30);
        this.createBackground('images/starfield.png', 950, 600, 50);
        this.player = this.createPlayer('images/Ship.64x29.png', 10, 10, 64, 29);

        
        setTimeout(() => { this.createEnemy('images/enemy.40x30.png', Math.random() * 900, 40, 30); }, Math.random() * 2000);
    }

    createBackground(imgSource: string, w: number, h: number, s: number): Engine.IThing {
        var background = new Background('background', imgSource);
        background.position.x = 0;
        background.position.y = 0;
        background.size.width = w ;
        background.size.height = h;
        background.speed = s;

        this.things.push(background);
        return background;
    }

    createPlayer(imgSource: string, x?: number, y?: number, w?: number, h?: number): Engine.ISolidAnimatedThing { 
        var sprite = new Sprite('player', imgSource, 4);
        sprite.position.x = x || Math.random() * 400;
        sprite.position.y = y || Math.random() * 150;
        sprite.size.width = w || 42;
        sprite.size.height = h || 42;
        sprite.speed = 95;

        this.things.push(sprite);
        return sprite;
    }

    createEnemy(imgSource: string, y: number, w: number, h: number) {
        setTimeout(() => { this.createEnemy('images/enemy.40x30.png', Math.random() * 550, 40, 30); }, Math.random() * 2000);

        var sprite = new Sprite('enemy', imgSource, 6);
        sprite.position.x = 950 + Math.random() * 40;
        sprite.position.y = y;
        sprite.size.width = w;
        sprite.size.height = h;
        sprite.speed = Math.random() * 50 + 40;

        this.enemies.push(sprite);
        this.things.push(sprite);
        return sprite;
    }

    shot() : void {
        var sprite = new Sprite('player', 'images/shot.png', 4);
        sprite.position.x = this.player.position.x + 60;
        sprite.position.y = this.player.position.y + 7;
        sprite.size.width = 16;
        sprite.size.height = 16;
        sprite.speed = 100;

        this.shots.push(sprite);
        this.things.push(sprite);

        try {
            this.shSound.currentTime = 0;
            this.shSound.play();
        }catch(ex) { }
    }

    explote(x: number, y: number) {
        var sprite = new Sprite('explosion', 'images/explosion.png', 64);
        sprite.position.x = x;
        sprite.position.y = y;
        sprite.size.width = 60;
        sprite.size.height = 60;
        sprite.speed = 80;
        sprite.loop = false;

        this.explosions.push(sprite);
        this.things.push(sprite);

        try {
            this.exSound.currentTime = 0;        
            this.exSound.play();
        } catch (ex) { }
    }

    update(): void;
    update(ticks: number): void;
    update(ticks?: any): void {
        this.updateGame();
        this.updatePlayer();
        super.update(ticks);
    }

    updateGame(): void {
        var toDelete: Engine.ISolidAnimatedThing[] = [];

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

        toDelete = [];
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

        toDelete = [];
        this.explosions.forEach(explosion => {
            var sprite = <Sprite>explosion;
            if (sprite.hasEnd) {
                toDelete.push(explosion);
            }
        });

        toDelete.forEach(explosion => {
            var index: number = this.explosions.indexOf(explosion);
            var indez: number = this.things.indexOf(explosion);
            this.explosions.splice(index, 1);
            this.things.splice(indez, 1);
        });

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
    updatePlayer() {
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

class Background extends Engine.Thing {
    private image: HTMLImageElement;
    public speed: number;

    constructor(id: string, imageSource: string) {
        super(id);

        this.image = <HTMLImageElement>document.createElement("img");
        this.image.src = imageSource;
        this.speed = 10;
    }

    update(ticks: number) {
        super.update(ticks);

        var delta = ticks / (100 - this.speed);
        this.position.x += delta;
        if (this.position.x > this.image.width) {
            this.position.x = 0;
        }
    }

    draw(graphics: CanvasRenderingContext2D) {
        super.draw(graphics);

        if ((this.image.width - this.position.x) < this.size.width) {
            var offsetA: number = this.image.width - this.position.x;
            var offsetB: number = this.size.width - offsetA; 
            graphics.drawImage(this.image,
                this.position.x,
                0,
                offsetA,
                this.size.height,
                0,
                0,
                offsetA,
                this.size.height);

            graphics.drawImage(this.image,
                0,
                0,
                offsetB,
                this.size.height,
                offsetA,
                0,
                offsetB,
                this.size.height);
        }
        else {
            graphics.drawImage(this.image,
                this.position.x,
                0,
                this.size.width,
                this.size.height,
                0,
                0,
                this.size.width,
                this.size.height);
        }
    }
}

class Sprite extends Engine.SolidAnimatedThing { 

    private image: HTMLImageElement;
    private frameIndex: number;
    private frameCount: number;
    private ticks: number;

    public loop: boolean;
    public hasEnd: boolean;

    constructor(id: string, imageSource: string, frameCount: number) { 
        super(id);

        this.image = <HTMLImageElement>document.createElement("img");
        this.image.src = imageSource;
        this.frameCount = frameCount;
        this.frameIndex = 0;
        this.speed = 10;
        this.loop = true;
        this.ticks = 0;
        this.hasEnd = false;
    }

    update(ticks: number) { 
        super.update(ticks);
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
    }

    draw(graphics: CanvasRenderingContext2D) { 
        super.draw(graphics);

        graphics.drawImage(this.image,
            0,
            this.frameIndex * this.size.height,
            this.size.width,
            this.size.height,
            this.position.x,
            this.position.y,
            this.size.width,
            this.size.height);
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