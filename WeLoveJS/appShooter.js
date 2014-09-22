///<reference path='definitions/require.d.ts'/>
///<reference path='Shooter.ts'/>
require(['Engine', 'Shooter'], function () {
    var canvas = document.getElementById('content');
    var harlem = new ShooterScenario(canvas);

    harlem.start(60);
});
