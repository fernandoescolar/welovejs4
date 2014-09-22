///<reference path='definitions/require.d.ts'/>
///<reference path='Shooter.ts'/>
require(['Engine', 'Shooter'], function () {
    var canvas = document.getElementById('content');
    canvas.height = 500;
    canvas.width = 950;

    var shooter = new ShooterScenario(canvas);
    shooter.start(60);
});
//# sourceMappingURL=app-shooter.js.map