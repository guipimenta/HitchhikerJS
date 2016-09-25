/// <reference path="../../hitchhikerjs.ts" />
var Bootstrap;
(function (Bootstrap_1) {
    function Bootstrap() {
        console.log("Bootstraping...");
        // on bootstrap we need:
        //     1. initialize our plugins (called highjackers)
        //     2. get, from a serverside event, the client ip (and probably location)
    }
    Bootstrap_1.Bootstrap = Bootstrap;
})(Bootstrap || (Bootstrap = {}));
