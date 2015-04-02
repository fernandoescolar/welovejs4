///<reference path='Engine.ts'/>
///<reference path='Shooter.ts'/>
class MyShooterScenario extends ShooterScenario {
    constructor(canvas: HTMLCanvasElement) {
        super(canvas, new Pad());

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

    createBackgroundLayer(imgName: string, speed: number): Engine.Sprite {
        var animation = new Engine.ContinuousImageAnimation(imgName, this.resources.images.get(imgName));
        var sprite = new Engine.Sprite(imgName, animation);
        sprite.position.x = 0;
        sprite.position.y = 0;
        sprite.size.width = 950;
        sprite.size.height = 600;
        animation.speed = speed;

        return sprite;
    }

    createBackground(speed: number): Engine.Sprite {
        var bg = this.createBackgroundLayer('background', speed);
        this.things.push(bg);

        return this.createBackgroundLayer('background-paralax', speed + 20);
    }

    createScore(): Engine.TextAnimation {
        var animation = new Engine.TextAnimation("score", "", "#fff", "30px Futura, Helvetica, sans-serif");
        var score = new Engine.Sprite("score", animation);
        score.position.x = 10;
        score.position.y = 25;

        this.things.push(score);
        return animation;
    }

    createPlayer(x?: number, y?: number): Player {
        var animation = new Engine.ImageSheetAnimation('player', this.resources.images.get('player'), 4, true, true);
        var player = new Player(this.pad, animation);
        player.position.x = x || Math.random() * 900;
        player.position.y = y || Math.random() * 550;
        player.size.width = 64;
        player.size.height = 29;
        animation.speed = 10;

        return player;
    }

    createEnemy(): Engine.Sprite {
        var animation = new Engine.ImageSheetAnimation('enemy', this.resources.images.get('enemy'), 6, true, true);
        var sprite = new Engine.Sprite('enemy-' + this.enemyCounter, animation);
        sprite.size.width = 40;
        sprite.size.height = 30;
        animation.speed = Math.random() * 50 + 40;

        return sprite;
    }

    createShot(): Shot {
        var animation = new Engine.ImageSheetAnimation('shot', this.resources.images.get('shot'), 4, true, true);
        var shot = new Shot(950, animation);
        shot.position.x = this.player.position.x + 60;
        shot.position.y = this.player.position.y + 7;
        shot.size.width = 16;
        shot.size.height = 16;
        return shot;
    }

    createExplosion(): Engine.Sprite {
        var animation = new Engine.ImageSheetAnimation('explosion', this.resources.images.get('explosion'), 64, false, true);
        var sprite = new Engine.Sprite('explosion', animation);
        sprite.size.width = 60;
        sprite.size.height = 60;
        animation.speed = 80;

        return sprite;
    }
} 