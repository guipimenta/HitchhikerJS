/// <reference path="../../hitchhikerjs.ts" />

module Bootstrap {
    import SessionPublisher = Core.Publishers.SessionPublisher;
    import SessionHighjacker = Core.Highjacker.SessionHighjacker;
    import CookieHighjacker = Core.Highjacker.getCookieField;
    import ServerConfiguration = Core.Configuration.ServerConfiguration;
    import SessionStorage = Core.Storage.SessionStorage;
	export function BasicBootstrap(config:ServerConfiguration) {
	    var sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.trackingUrl
        });
        let userid = "";
        if(config.userid.isCookie === false || config.userid.isCookie === undefined) {
            userid = config.userid.value;
        } else {
            userid = CookieHighjacker(config.userid.value);
        }
        let sessionStorage = new SessionStorage(userid);
        if(sessionStorage.getPreviosSession() === null) {
            var sessionHighjacker = new Core.Highjacker.SessionHighjacker(sessionStorage.Key, sessionStorage);
            console.log("Highjacker created!");
            sessionHighjacker.registerPublisher(sessionPublisher);
            console.log("Registering Publisher created!");
            sessionHighjacker.sessionEvent();
        }
    }
}