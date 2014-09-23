///<reference path='Engine.ts'/>

class HarlemScenario extends Engine.Scenario { 
    start(framesPerSecond: number) : void { 
        super.start(framesPerSecond);

        this.createLittleShaker('images/dart.png', 10, 10);
         this.createLittleShaker('images/coffeescript_logo.png', 150, 90);
        setTimeout(() => this.createAllLittleShakers(), 15000);
    }

    createAllLittleShakers() : void { 
        for (var i = 0; i < 100; i++) {
            this.createLittleShaker('images/typescript.png');
        }
    }

    createLittleShaker(imgSource: string, x?: number, y?: number): void { 
        var shaker = new HarlemLittleShaker('shaked-dart-' + this.things.length, imgSource);
        shaker.position.x = x || Math.random() * 400;
        shaker.position.y = y || Math.random() * 150;
        shaker.size.width = 42;
        shaker.size.height = 42;
        shaker.speed = Math.random() * 80 + 20;

        this.things.push(shaker);
    }
}

class HarlemLittleShaker extends Engine.ScalableThing { 

    private image: HTMLImageElement;
    private isGrowing: boolean;

    constructor(id: string, imageSource: string) { 
        super(id);

        this.image = <HTMLImageElement>document.createElement("img");
        this.image.src = imageSource;
        this.speed = 10;
        this.isGrowing = false;
    }

    update(context: Engine.IUpdateContext) { 
        super.update(context);

        if (this.isGrowing && this.size.width >= 60) { 
            this.isGrowing = false;
            this.scale(new Engine.Size(42, 42));
        }

        if (!this.isGrowing && this.size.width <= 42) { 
            this.isGrowing = true;
            this.scale(new Engine.Size(60, 60));
        }
    }

    draw(graphics: CanvasRenderingContext2D) { 
        super.draw(graphics);

        graphics.drawImage(this.image, 0, 0, 42, 42, this.position.x, this.position.y, this.size.width, this.size.height);
    }
}