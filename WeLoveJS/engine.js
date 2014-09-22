var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Engine;
(function (Engine) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.collisionDetection = function (a, b) {
            return a.position.x <= (b.position.x + b.size.width) && b.position.x <= (a.position.x + a.size.width) && a.position.y <= (b.position.y + b.size.height) && b.position.y <= (a.position.y + a.size.height);
        };
        return Utilities;
    })();

    var Point = (function () {
        function Point(x, y) {
            this.x = x || 0;
            this.y = y || 0;
        }
        return Point;
    })();
    Engine.Point = Point;

    var Size = (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        return Size;
    })();
    Engine.Size = Size;

    var Thing = (function () {
        function Thing(id, position, size) {
            this.id = id;
            this.position = position || new Point(0, 0);
            this.size = size || new Size(0, 0);
        }
        Thing.prototype.update = function (ticks) {
        };

        Thing.prototype.draw = function (graphics) {
        };
        return Thing;
    })();
    Engine.Thing = Thing;

    var SolidThing = (function (_super) {
        __extends(SolidThing, _super);
        function SolidThing() {
            _super.apply(this, arguments);
        }
        SolidThing.prototype.collision = function (obj) {
            return Utilities.collisionDetection(this, obj);
        };
        return SolidThing;
    })(Thing);
    Engine.SolidThing = SolidThing;

    var AnimatedThing = (function (_super) {
        __extends(AnimatedThing, _super);
        function AnimatedThing() {
            _super.apply(this, arguments);
        }
        AnimatedThing.prototype.move = function (position) {
            this.targetPosition = position;
        };

        AnimatedThing.prototype.scale = function (size) {
            this.targetSize = size;
        };

        AnimatedThing.prototype.update = function (ticks) {
            _super.prototype.update.call(this, ticks);

            var delta = this.speed / ticks;
            if (this.targetPosition) {
                this.position.x = this.calculateStep(this.position.x, this.targetPosition.x, delta);
                this.position.y = this.calculateStep(this.position.y, this.targetPosition.y, delta);
            }
            if (this.targetSize) {
                this.size.width = this.calculateStep(this.size.width, this.targetSize.width, delta);
                this.size.height = this.calculateStep(this.size.height, this.targetSize.height, delta);
            }
        };

        AnimatedThing.prototype.calculateStep = function (from, to, delta) {
            if (from == to)
                return from;
            else if (from < to)
                return Math.min(from + delta, to);
            else
                return Math.max(from - delta, to);
        };
        return AnimatedThing;
    })(Thing);
    Engine.AnimatedThing = AnimatedThing;

    var SolidAnimatedThing = (function (_super) {
        __extends(SolidAnimatedThing, _super);
        function SolidAnimatedThing() {
            _super.apply(this, arguments);
        }
        SolidAnimatedThing.prototype.collision = function (obj) {
            return Utilities.collisionDetection(this, obj);
        };
        return SolidAnimatedThing;
    })(AnimatedThing);
    Engine.SolidAnimatedThing = SolidAnimatedThing;

    var Scenario = (function () {
        function Scenario(canvas) {
            this.graphics = canvas.getContext('2d');
            this.things = [];
        }
        Scenario.prototype.start = function (framesPerSecond) {
            var _this = this;
            if (this.interval)
                this.stop();

            this.lastTime = Date.now();
            this.interval = setInterval(function () {
                return _this.update();
            }, 1000 / framesPerSecond);
        };

        Scenario.prototype.stop = function () {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        };

        Scenario.prototype.update = function (ticks) {
            var _this = this;
            if (!ticks) {
                var now = Date.now();
                var m = now - this.lastTime;
                m = m <= 0 ? 1 : m;
                this.lastTime = now;

                this.update(m);
            } else {
                this.graphics.fillStyle = '#fff';
                this.graphics.fillRect(0, 0, 950, 500);

                this.things.forEach(function (thing) {
                    thing.update(ticks);
                    thing.draw(_this.graphics);
                });
            }
        };
        return Scenario;
    })();
    Engine.Scenario = Scenario;
})(Engine || (Engine = {}));
//# sourceMappingURL=engine.js.map
