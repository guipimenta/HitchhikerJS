/// <reference path="../../hitchhikerjs.ts" />
var Models;
(function (Models) {
    var BrowserVersion = (function () {
        function BrowserVersion(name, version) {
            this.name = name;
            this.version = version;
        }
        return BrowserVersion;
    })();
    Models.BrowserVersion = BrowserVersion;
    /**
    * This represents a user session
    * Must hold information about user over the website
    */
    var Session = (function () {
        function Session() {
        }
        return Session;
    })();
    Models.Session = Session;
})(Models || (Models = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Publishers;
    (function (Publishers) {
        var SessionPublisher = (function () {
            function SessionPublisher(pubConf) {
                this.pubConf = pubConf;
                this.pubUrl = pubConf.pubUrl;
            }
            SessionPublisher.prototype.publish = function (pubInfo) {
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        sessionInfo: pubInfo
                    }
                });
            };
            return SessionPublisher;
        })();
        Publishers.SessionPublisher = SessionPublisher;
    })(Publishers = Core.Publishers || (Core.Publishers = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Highjacker;
    (function (Highjacker) {
        var Session = Models.Session;
        var BrowserVersion = Models.BrowserVersion;
        ;
        var SessionHighjacker = (function () {
            function SessionHighjacker() {
            }
            SessionHighjacker.prototype.registerPublisher = function (publisher) {
                this.publisher = publisher;
            };
            /**
            * This will handle onload event.
            * It will push to webserver all information in cookie
            * (don't have time to handle if )
            */
            SessionHighjacker.prototype.sessionEvent = function () {
                var _this = this;
                $(document).ready(function () {
                    var session = new Session();
                    session.browser = new BrowserVersion(bowser.name, bowser.version);
                    // session.location (better fill this up on server-side cause of browser compatibility)
                    // see: https://github.com/sebpiq/rhizome/issues/106
                    session.os = window.navigator["oscpu"] || window.navigator.platform;
                    session.createdAt = Date.now();
                    if (_this.publisher !== undefined) {
                        _this.publisher.publish(session);
                    }
                });
            };
            return SessionHighjacker;
        })();
        Highjacker.SessionHighjacker = SessionHighjacker;
    })(Highjacker = Core.Highjacker || (Core.Highjacker = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
;/// <reference path="../../hitchhikerjs.ts" />
var Bootstrap;
(function (Bootstrap) {
    function BasicBootstrap(config) {
        var sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.trackingUrl
        });
        var sessionHighjacker = new Core.Highjacker.SessionHighjacker();
        console.log("Highjacker created!");
        sessionHighjacker.registerPublisher(sessionPublisher);
        console.log("Registering Publisher created!");
        sessionHighjacker.sessionEvent();
    }
    Bootstrap.BasicBootstrap = BasicBootstrap;
})(Bootstrap || (Bootstrap = {}));
