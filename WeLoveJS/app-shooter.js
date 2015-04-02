///<reference path='definitions/require.d.ts'/>
///<reference path='Shooter.ts'/>
require(['Engine', 'Shooter', 'MyShooter'], function () {
    var canvas = document.getElementById('content');
    canvas.height = 500;
    canvas.width = 950;

    var shooter = new MyShooterScenario(canvas);
});
//# sourceMappingURL=app-shooter.js.map
