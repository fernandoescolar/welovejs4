///<reference path='Engine.ts'/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var HarlemScenario = (function (_super) {
    __extends(HarlemScenario, _super);
    function HarlemScenario() {
        _super.apply(this, arguments);
    }
    HarlemScenario.prototype.start = function (framesPerSecond) {
        var _this = this;
        _super.prototype.start.call(this, framesPerSecond);

        this.createLittleShaker('images/dart.png', 10, 10);
        this.createLittleShaker('images/coffeescript_logo.png', 150, 90);
        setTimeout(function () {
            return _this.createAllLittleShakers();
        }, 15000);
    };

    HarlemScenario.prototype.createAllLittleShakers = function () {
        for (var i = 0; i < 100; i++) {
            this.createLittleShaker('images/typescript.png');
        }
    };

    HarlemScenario.prototype.createLittleShaker = function (imgSource, x, y) {
        var shaker = new HarlemLittleShaker('shaked-dart-' + this.things.length, imgSource);
        shaker.position.x = x || Math.random() * 400;
        shaker.position.y = y || Math.random() * 150;
        shaker.size.width = 42;
        shaker.size.height = 42;
        shaker.speed = Math.random() * 30 + 10;

        this.things.push(shaker);
    };
    return HarlemScenario;
})(Engine.Scenario);

var HarlemLittleShaker = (function (_super) {
    __extends(HarlemLittleShaker, _super);
    function HarlemLittleShaker(id, imageSource) {
        _super.call(this, id);

        this.image = document.createElement("img");
        this.image.src = imageSource;
        this.speed = 10;
        this.isGrowing = false;
    }
    HarlemLittleShaker.prototype.update = function (ticks) {
        _super.prototype.update.call(this, ticks);

        if (this.isGrowing && this.size.width >= 60) {
            this.isGrowing = false;
            this.scale(new Engine.Size(42, 42));
        }

        if (!this.isGrowing && this.size.width <= 42) {
            this.isGrowing = true;
            this.scale(new Engine.Size(60, 60));
        }
    };

    HarlemLittleShaker.prototype.draw = function (graphics) {
        _super.prototype.draw.call(this, graphics);

        graphics.drawImage(this.image, 0, 0, 42, 42, this.position.x, this.position.y, this.size.width, this.size.height);
    };
    return HarlemLittleShaker;
})(Engine.AnimatedThing);
//# sourceMappingURL=HarlemShake.js.map
