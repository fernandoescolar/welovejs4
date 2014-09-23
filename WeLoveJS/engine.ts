module Engine {
    export interface INamedCollection<T> {
        getLength(): number;
        get(key: string): T;
        add(key: string, element: T): void;
        remove(key: string): void;
        containsKey(key: string): boolean;
        clear(): void;
        forEach(callback: (key: string, value: T) => any): void;
    }

    export interface IPoint {
        x: number;
        y: number;
    }

    export interface ISize {
        width: number;
        height: number;
    }

    export interface IResources {
        images: INamedCollection<HTMLImageElement>;
        audios: INamedCollection<HTMLAudioElement>;

        loadImage(id: string, imageSource: string): void;
        loadAudio(id: string, audioSource: string): void;

        playAudio(id: string): void;

        preload(onPreloaded: () => void): void;
    }

    export interface IUpdateContext {
        ticks: number;
        fps: number;
        screen: ISize;
        resources: IResources;
    }

    export interface IThing {
        id: string;
        position: IPoint;
        size: ISize;

        update(context: IUpdateContext): void;
        draw(graphics: CanvasRenderingContext2D): void;
    }

    export interface ISolidThing extends IThing {
        collision(obj: IThing): boolean;
    }

    export interface IMovableThing extends IThing {
        speed: number;
        move(position: IPoint): void;
    }

    export interface IScalableThing extends IThing {
        speed: number;
        scale(size: ISize): void;
    }

    export interface IScalableMovableThing extends IScalableThing, IMovableThing{
    }

    export interface ISolidScalableMovableThing extends ISolidThing, IScalableMovableThing {
    }

    export interface IAnimation {
        id: string;
        frameIndex: number;
        frameCount: number;
        update(context: Engine.IUpdateContext): void;
        draw(graphics: CanvasRenderingContext2D, position: IPoint, size: ISize): void;
    }

    export interface IAnimationCollection extends INamedCollection<IAnimation> {
    }

    export interface ISprite extends ISolidScalableMovableThing {
        animations: IAnimationCollection;
        currentAnimationKey: string;
    }

    export interface IScenario {
        resources: IResources;
        things: Array<IThing>;

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

        static calculateStep(from: number, to: number, delta: number): number {
            if (from == to)
                return from;
            else if (from < to)
                return Math.min(from + delta, to);
            else
                return Math.max(from - delta, to);
        }

        static calculateDelta(ticks: number, speed: number) {
            return ticks / (100 - speed);
        }

        static moveThing(obj: IMovableThing, target: IPoint, delta: number) {
            obj.position.x = Utilities.calculateStep(obj.position.x, target.x, delta);
            obj.position.y = Utilities.calculateStep(obj.position.y, target.y, delta);
        }

        static scaleThing(obj: IScalableThing, target: ISize, delta: number) {
            obj.size.width = Utilities.calculateStep(obj.size.width, target.width, delta);
            obj.size.height = Utilities.calculateStep(obj.size.height, target.height, delta);
        }
    }

    export class NamedCollection<T> implements INamedCollection<T> {
        private items: { [key: string]: T };
        private count: number;

        constructor() {
            this.clear();
        }

        public get length() {
            return this.getLength();
        }

        public getLength(): number {
            return this.count;
        }

        public get(key: string): T {
            return this.items[key];
        }

        public add(key: string, element: T): void {
            if (!this.containsKey(key)) {
                this.count++;
            }

            this.items[key] = element;
        }

        public remove(key: string): void {
            if (this.containsKey(key)) {
                delete this.items[key];
                this.count--;
            }
        }

        public containsKey(key: string): boolean {
            return (typeof this.items[key]) !== 'undefined';
        }

        public clear(): void {
            this.items = {};
            this.count = 0;
        }

        public forEach(callback: (key: string, value: T) => any): void {
            for (var name in this.items) {
                if (this.items.hasOwnProperty(name)) {
                    var element: T = this.items[name];
                    var ret = callback(name, element);
                    if (ret === false) {
                        return;
                    }
                }
            }
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

    export class Resources implements IResources {
        public images: INamedCollection<HTMLImageElement>;
        public audios: INamedCollection<HTMLAudioElement>;

        private filesToLoad: number;
        private filesLoaded: number;

        constructor() {
            this.images = new NamedCollection<HTMLImageElement>();
            this.audios = new NamedCollection<HTMLAudioElement>();
            this.filesLoaded = 0;
            this.filesToLoad = 0;
        }

        public loadImage(id: string, imageSource: string): void {
            this.filesToLoad++;

            var image = <HTMLImageElement>document.createElement("img");
            var img = new Image();
            var self = this;
            img.onload = ev => { image.width = img.width; image.height = img.height; (<any>image).innerImage = img; self.filesLoaded++; };
            image.src = imageSource;
            img.src = imageSource;

            this.filesLoaded++;

            this.images.add(id, image);
        }

        public loadAudio(id: string, audioSource: string): void {
            this.filesToLoad++;

            var audio = <HTMLAudioElement>document.createElement("audio");
            var self = this;
            try {
                audio.src = audioSource;
                this.filesLoaded++;
            } catch (ex) { this.filesLoaded++; }

            this.audios.add(id, audio);
        }

        public playAudio(id: string): void {
            try {
                var audio = this.audios.get(id);
                audio.currentTime = 0;
                audio.play();
            } catch (ex) { }
        }

        public preload(onPreloaded: () => void): void {
            if (this.filesLoaded === this.filesToLoad) {
                onPreloaded();
            } else {
                setTimeout(() => { this.preload(onPreloaded); }, 200);
            }
        }
    }

    export class UpdateContext implements IUpdateContext {

        constructor(public ticks: number, public fps: number, public screen: ISize, public resources: IResources) {
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

        update(context: IUpdateContext) {

        }

        draw(graphics: any): void {

        }
    }

    export class SolidThing extends Thing implements ISolidThing {
        collision(obj: IThing): boolean {
            return Utilities.collisionDetection(this, obj);
        }
    }

    export class MovableThing extends Thing implements IMovableThing {

        public speed: number;
        private targetPosition: IPoint;

        move(position: IPoint): void {
            this.targetPosition = position;
        }

        update(context: IUpdateContext) {
            super.update(context);

            var delta = Utilities.calculateDelta(context.ticks, this.speed);
            if (this.targetPosition) {
                Utilities.moveThing(this, this.targetPosition, delta);
            }
        }
    }

    export class ScalableThing extends Thing implements IScalableThing {

        public speed: number;
        private targetSize: ISize;

        scale(size: ISize): void {
            this.targetSize = size;
        }

        update(context: IUpdateContext) {
            super.update(context);

            var delta = Utilities.calculateDelta(context.ticks, this.speed);
            if (this.targetSize) {
                Utilities.scaleThing(this, this.targetSize, delta);
            }
        }
    }

    export class ScalableMovableThing extends Thing implements IScalableMovableThing {

        public speed: number;
        private targetSize: ISize;
        private targetPosition: IPoint;

        move(position: IPoint): void {
            this.targetPosition = position;
        }

        scale(size: ISize): void {
            this.targetSize = size;
        }

        update(context: IUpdateContext) {
            super.update(context);

            var delta = Utilities.calculateDelta(context.ticks, this.speed);
            if (this.targetPosition) {
                Utilities.moveThing(this, this.targetPosition, delta);
            }
            if (this.targetSize) {
                Utilities.scaleThing(this, this.targetSize, delta);
            }
        }
    }

    export class SolidScalableMovableThing extends ScalableMovableThing implements ISolidScalableMovableThing {
        collision(obj: IThing): boolean {
            return Utilities.collisionDetection(this, obj);
        }
    }

    export class StaticImageAnimation implements IAnimation {
        public id: string;
        public frameIndex: number;
        public frameCount: number;

        private image: HTMLImageElement;

        constructor(id: string, image: HTMLImageElement) {
            this.id = id;
            this.image = image;
            this.frameIndex = 0;
            this.frameCount = 1;
        }

        public update(context: Engine.IUpdateContext): void {
        }

        public draw(graphics: CanvasRenderingContext2D, position: IPoint, size: ISize): void {
            this.internalDraw(graphics, this.image, position, size);
        }

        internalDraw(graphics: CanvasRenderingContext2D, image: HTMLImageElement, position: IPoint, size: ISize) {
            graphics.drawImage(image,
                0,
                0,
                image.width,
                image.height,
                position.x,
                position.y,
                size.width,
                size.height);
        }
    }

    export class ImageSheetAnimation extends StaticImageAnimation implements IAnimation {
        public loop: boolean;
        public isVertical: boolean
        public imageSize: ISize;
        public speed: number;
        public hasEnd: boolean;

        private ticks: number;

        constructor(id: string, image: HTMLImageElement, frameCount: number, loop?: boolean, isVertical?: boolean) {
            super(id, image);

            this.frameCount = frameCount;
            this.loop = (typeof loop === 'undefined') ? true : loop;
            this.isVertical = (typeof isVertical === 'undefined') ? true : isVertical;
            this.speed = 50;
            this.ticks = 0;
            this.hasEnd = false;

            var w: number = this.isVertical ? image.width : image.width / this.frameCount;
            var h: number = !this.isVertical ? image.height : image.height / this.frameCount;
            this.imageSize = new Size(w, h);
        }

        public update(context: Engine.IUpdateContext): void {
            super.update(context);
            this.ticks += context.ticks;
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

        internalDraw(graphics: CanvasRenderingContext2D, image: HTMLImageElement, position: IPoint, size: ISize) {
            var x: number = this.isVertical ? 0 : this.imageSize.width * this.frameIndex;
            var y: number = !this.isVertical ? 0 : this.imageSize.height * this.frameIndex;

            graphics.drawImage(image,
                x,
                y,
                this.imageSize.width,
                this.imageSize.height,
                position.x,
                position.y,
                size.width,
                size.height);
        }
    }

    export class ContinuousImageAnimation extends StaticImageAnimation implements IAnimation {
        public speed: number;
        public imageSize: ISize;

        private offset: number;

        constructor(id: string, image: HTMLImageElement) {
            super(id, image);
            this.speed = 50;
            this.offset = 0;
            var w: number = image.width;
            var h: number = image.height;
            this.imageSize = new Size(w, h);
        }

        public update(context: Engine.IUpdateContext): void {
            super.update(context);
            var delta = context.ticks / (100 - this.speed);
            this.offset += delta;
            if (this.offset > this.imageSize.width) {
                this.offset = 0;
            }
        }

        internalDraw(graphics: CanvasRenderingContext2D, image: HTMLImageElement, position: IPoint, size: ISize) {
            if ((this.imageSize.width - this.offset) < size.width) {
                var offsetA: number = this.imageSize.width - this.offset;
                var offsetB: number = this.imageSize.width - offsetA;
                graphics.drawImage(image,
                    this.offset,
                    0,
                    offsetA,
                    size.height,
                    position.x,
                    position.y,
                    offsetA,
                    size.height);

                graphics.drawImage(image,
                    0,
                    0,
                    offsetB,
                    size.height,
                    offsetA,
                    0,
                    offsetB,
                    size.height);
            }
            else {
                graphics.drawImage(image,
                    this.offset,
                    0,
                    size.width,
                    size.height,
                    position.x,
                    position.y,
                    size.width,
                    size.height);
            }
        }
    }

    export class AnimationCollection extends NamedCollection<IAnimation> implements IAnimationCollection {
    }

    export class Sprite extends SolidScalableMovableThing implements ISprite {

        public animations: IAnimationCollection;

        private currentKey: string;

        constructor(id: string, ...animations: Array<IAnimation>) {
            super(id);

            this.animations = new AnimationCollection();
            animations = animations || [];
            animations.forEach(animation => { this.animations.add(animation.id, animation); });

            if (animations.length >= 1) {
                this.currentKey = animations[0].id;
            }
        }

        public get currentAnimationKey(): string {
            return this.currentKey;
        }

        public set currentAnimationKey(key: string) {
            this.currentKey = key;
        }

        public get currentAnimation(): IAnimation {
            return this.animations.get(this.currentKey);
        }

        update(context: Engine.IUpdateContext) {
            super.update(context);

            var currentAnimation = this.currentAnimation;
            if (currentAnimation) {
                currentAnimation.update(context);
            }
        }

        draw(graphics: CanvasRenderingContext2D) {
            super.draw(graphics);

            var currentAnimation = this.currentAnimation;
            if (currentAnimation) {
                currentAnimation.draw(graphics, this.position, this.size);
            }
        }
    }

    export class Scenario implements IScenario {

        public resources: IResources;
        public things: Array<IThing>;
        private graphics: CanvasRenderingContext2D;
        private canvas: HTMLCanvasElement;
        private fps: number;
        private lastTime: number;
        private interval: number;

        constructor(canvas: HTMLCanvasElement) {
            this.canvas = canvas;
            this.graphics = canvas.getContext('2d');
            this.things = [];
            this.resources = new Resources();
        }

        start(framesPerSecond: number): void {
            if (this.interval)
                this.stop();

            this.fps = framesPerSecond;
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
                this.graphics.fillRect(0, 0, this.canvas.width, this.canvas.height);

                var context = new UpdateContext(ticks, this.fps, new Size(this.canvas.width, this.canvas.height), this.resources);
                this.updateElements(context);
            }
        }

        updateElements(context: IUpdateContext): void {
            this.things.forEach(thing => {
                thing.update(context);
                thing.draw(this.graphics);
            });
        }
    }
}