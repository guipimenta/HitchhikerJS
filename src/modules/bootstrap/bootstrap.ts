/// <reference path="../../hitchhikerjs.ts" />

module Bootstrap {
    import SessionPublisher = Core.Publishers.SessionPublisher;
    import SessionHighjacker = Core.Highjacker.SessionHighjacker;
    import ServerConfiguration = Core.Configuration.ServerConfiguration;
	export function BasicBootstrap(config:ServerConfiguration) {
	    var sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.trackingUrl
        });
        var sessionHighjacker = new Core.Highjacker.SessionHighjacker();
        console.log("Highjacker created!");
        sessionHighjacker.registerPublisher(sessionPublisher);
        console.log("Registering Publisher created!");
        sessionHighjacker.sessionEvent();
    }
}