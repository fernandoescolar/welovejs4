define(["require", "exports", 'HarlemShake'], function(require, exports, __Harlem__) {
    var Harlem = __Harlem__;

    require([], function () {
        var canvas = document.getElementById('content');
        var harlem = new Harlem.HarlemScenario(canvas);
        harlem.start(60);
    });
})
//@ sourceMappingURL=app.js.map
