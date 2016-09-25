/// <reference path="../../hitchhikerjs.ts" />

module Bootstrap {
    import SessionPublisher = Core.Publishers.SessionPublisher;
    import SessionHighjacker = Core.Highjacker.SessionHighjacker;
	export function Bootstrap() {
		console.log("Bootstraping...");
        // on bootstrap we need:
        //     1. initialize our plugins (called highjackers)
        //     2. get, from a serverside event, the client ip (and probably location)
	}
}