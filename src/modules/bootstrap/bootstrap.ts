/// <reference path="../../hitchhikerjs.ts" />

module Bootstrap {
    import SessionPublisher = Core.Publishers.SessionPublisher;
    import SessionHighjacker = Core.Highjacker.SessionHighjacker;
    import CookieHighjacker = Core.Highjacker.getCookieField;
    import ServerConfiguration = Core.Configuration.ServerConfiguration;
    import SessionStorageService = Core.Storage.SessionStorageService;
    import TransitStorageService = Core.Storage.TransitStorageService;

	export function BasicBootstrap(config:ServerConfiguration) {
	    let sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.sessionTrackUrl
        });
        let transitPublisher = new Core.Publishers.DefaultPublisher({
            pubUrl: config.transitTrackUrl
        });

        let userid = "";
        if(config.userid.isCookie === false || config.userid.isCookie === undefined) {
            userid = config.userid.value;
        } else {
            userid = CookieHighjacker(config.userid.value);
        }
        let sessionStorage = SessionStorageService.getInstance(userid);
        if(sessionStorage.getPreviosSession() === null) {
            // initializes session
            let sessionHighjacker = new Core.Highjacker.SessionHighjacker(sessionStorage.Key, sessionStorage);
            console.log("Highjacker created!");
            sessionHighjacker.registerPublisher(sessionPublisher);
            console.log("Registering Publisher created!");
            sessionHighjacker.sessionEvent();
        }

        let transitHighjacker = new Core.Highjacker.TransitHighjacker(sessionStorage.Key);
        transitHighjacker.registerPublisher(transitPublisher);
        transitHighjacker.start();
    }
}