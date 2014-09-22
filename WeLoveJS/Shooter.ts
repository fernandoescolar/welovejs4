///<reference path='Engine.ts'/>

class ShooterScenario extends Engine.Scenario { 
    private player: Engine.ISolidAnimatedThing;
    private shoots: Engine.ISolidAnimatedThing[];
    private enemies: Engine.ISolidAnimatedThing[];
    private explosions: Engine.ISolidAnimatedThing[];
    private exSound: HTMLAudioElement;
    private shSound: HTMLAudioElement;

    start(framesPerSecond: number) : void { 
        super.start(framesPerSecond);

        this.shSound = <HTMLAudioElement>document.getElementById('laser');
        this.exSound = <HTMLAudioElement>document.getElementById('explosion');

        this.shoots = [];
        this.enemies = [];
        this.explosions = [];
        this.createBackground('images/farback.gif', 950, 600, 30);
        this.createBackground('images/starfield.png', 950, 600, 50);
        this.player = this.createPlayer('images/Ship.64x29.png', 10, 10, 64, 29);

        document.addEventListener('keydown', (ev: KeyboardEvent) => { this.getKey(ev); }, true);
        setTimeout(() => { this.createEnemy('images/enemy.40x30.png', Math.random() * 900, 40, 30); }, Math.random() * 2000);
    }

    getKey(ev: KeyboardEvent) {
        if (ev.keyCode == 38) {
            this.player.move(new Engine.Point(this.player.position.x, this.player.position.y - 30));
        }
        else if (ev.keyCode == 40) {
            this.player.move(new Engine.Point(this.player.position.x, this.player.position.y + 30));
        }
        else if (ev.keyCode == 39) {
            this.player.move(new Engine.Point(this.player.position.x + 30, this.player.position.y));
        }
        else if (ev.keyCode == 37) {
            this.player.move(new Engine.Point(this.player.position.x - 30, this.player.position.y));
        }
        else if (ev.keyCode == 32) {
            this.shot();
        }

        return false;
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
        sprite.speed = 90;

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
        sprite.speed = 50;

        this.enemies.push(sprite);
        this.things.push(sprite);
        return sprite;
    }

    shot() : void {
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
        this.exSound.currentTime = 0;
        this.exSound.play();
    }

    update(): void;
    update(ticks: number): void;
    update(ticks?: any): void {
        this.updateGame();
        super.update(ticks);
    }

    updateGame(): void {
        var toDelete: Engine.ISolidAnimatedThing[] = [];

        this.shoots.forEach(shoot => {
            shoot.move(new Engine.Point(shoot.position.x + 30, shoot.position.y));
            if (shoot.position.x >= 950) {
                toDelete.push(shoot);
            }
        });

        toDelete.forEach(shoot => {
            var index: number = this.shoots.indexOf(shoot);
            var indez: number = this.things.indexOf(shoot);
            this.shoots.splice(index, 1);
            this.things.splice(indez, 1);
        });

        toDelete = [];
        this.enemies.forEach(enemy => {
            enemy.move(new Engine.Point(enemy.position.x - Math.random() * 25, enemy.position.y));
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

        this.shoots.forEach(shoot => {
            this.enemies.forEach(enemy => {
                if (shoot.collision(enemy)) {
                    var sindex: number = this.shoots.indexOf(shoot);
                    var sindez: number = this.things.indexOf(shoot);
                    this.shoots.splice(sindex, 1);
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