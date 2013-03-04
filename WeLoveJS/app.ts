///<reference path='definitions/require.d.ts'/>
///<reference path='HarlemShake.ts'/>

import Harlem = module('HarlemShake');

require([], () => {
    var canvas = <HTMLCanvasElement>document.getElementById('content');
    var harlem = new Harlem.HarlemScenario(canvas);

   

    harlem.start(60);
});