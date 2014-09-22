///<reference path='definitions/require.d.ts'/>
///<reference path='HarlemShake.ts'/>

require(['Engine', 'HarlemShake'], () => {
    var canvas = <HTMLCanvasElement>document.getElementById('content');
    var harlem = new HarlemScenario(canvas);

    harlem.start(60);
});