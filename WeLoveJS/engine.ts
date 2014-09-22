module Engine {
    export interface IPoint {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IThing {
        id: string;
        position: IPoint;
        size: ISize;

        update(ticks: number): void;
        draw(graphics: CanvasRenderingContext2D): void;
    }

    export interface ISolidThing extends IThing {
        collision(obj: IThing): boolean;
    }

    export interface IAnimatedThing extends IThing {
        speed: number;
        move(position: IPoint): void;
        scale(size: ISize): void;
    }

    export interface ISolidAnimatedThing extends ISolidThing, IAnimatedThing {
    }

    export interface IScenario {
        things: IThing[];

        start(framesPerSecond: number): void;
        stop(): void;
    }

    class Utilities {
        static collisionDetection(a: IThing, b: IThing): boolean {
            return a.position.x <= (b.position.x + b.size.width)
                && b.position.x <= (a.position.x + a.size.width)
                && a.position.y <= (b.position.y + b.size.height)
                && b.position.y <= (a.position.y + a.size.height);
        }
    }

    export class Point implements IPoint {

        public x: number;
        public y: number;

        constructor();
        constructor(x: number, y: number);
        constructor(x?: any, y?: any) {
            this.x = x || 0;
            this.y = y || 0;
        }
    }

    export class Size implements ISize {
        constructor(public width: number, public height: number) {
        }
    }

    export class Thing implements IThing {
        public id: string;
        public position: IPoint;
        public size: ISize;

        constructor(id: string, position: IPoint, size: ISize);
        constructor(id: string);
        constructor(id: string, position?: any, size?: any) {
            this.id = id;
            this.position = position || new Point(0, 0);
            this.size = size || new Size(0, 0);
        }

        update(ticks: number) {

        }

        draw(graphics: any): void {

        }
    }

    export class SolidThing extends Thing implements ISolidThing {
        collision(obj: IThing): boolean {
            return Utilities.collisionDetection(this, obj);
        }
    }

    export class AnimatedThing extends Thing implements IAnimatedThing {

        public speed: number;
        private targetPosition: IPoint;
        private targetSize: ISize;

        move(position: IPoint): void {
            this.targetPosition = position;
        }

        scale(size: ISize): void {
            this.targetSize = size;
        }

        update(ticks: number) {
            super.update(ticks);

            var delta = this.speed / ticks;
            if (this.targetPosition) {
                this.position.x = this.calculateStep(this.position.x, this.targetPosition.x, delta);
                this.position.y = this.calculateStep(this.position.y, this.targetPosition.y, delta);
            }
            if (this.targetSize) {
                this.size.width = this.calculateStep(this.size.width, this.targetSize.width, delta);
                this.size.height = this.calculateStep(this.size.height, this.targetSize.height, delta);
            }
        }

        calculateStep(from: number, to: number, delta: number): number {
            if (from == to)
                return from;
            else if (from < to)
                return Math.min(from + delta, to);
            else
                return Math.max(from - delta, to);
        }
    }

    export class SolidAnimatedThing extends AnimatedThing implements ISolidAnimatedThing {
        collision(obj: IThing): boolean {
            return Utilities.collisionDetection(this, obj);
        }
    }

    export class Scenario implements IScenario {

        public things: IThing[];
        private graphics: CanvasRenderingContext2D;
        private lastTime: number;
        private interval: number;

        constructor(canvas: HTMLCanvasElement) {
            this.graphics = canvas.getContext('2d');
            this.things = [];
        }

        start(framesPerSecond: number): void {
            if (this.interval)
                this.stop();

            this.lastTime = Date.now();
            this.interval = setInterval(() => this.update(), 1000 / framesPerSecond);
        }

        stop(): void {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }

        update(): void;
        update(ticks: number): void;
        update(ticks?: any): void {
            if (!ticks) {
                var now = Date.now();
                var m = now - this.lastTime;
                m = m <= 0 ? 1 : m;
                this.lastTime = now;

                this.update(m);
            }
            else {

                this.graphics.fillStyle = '#fff';
                this.graphics.fillRect(0, 0, 950, 500);

                this.things.forEach(thing => {
                    thing.update(ticks);
                    thing.draw(this.graphics);
                });
            }
        }
    }
}