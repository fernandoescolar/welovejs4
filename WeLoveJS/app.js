///<reference path='definitions/require.d.ts'/>
///<reference path='HarlemShake.ts'/>
require(['Engine', 'HarlemShake'], function () {
    var canvas = document.getElementById('content');
    var harlem = new HarlemScenario(canvas);

    harlem.start(60);
});
//# sourceMappingURL=app.js.map
