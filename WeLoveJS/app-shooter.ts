///<reference path='definitions/require.d.ts'/>
///<reference path='Shooter.ts'/>

require(['Engine', 'Shooter', 'MyShooter'], () => {
    var canvas = <HTMLCanvasElement>document.getElementById('content');
    canvas.height = 500;
    canvas.width = 950;

    var shooter = new MyShooterScenario(canvas);
});