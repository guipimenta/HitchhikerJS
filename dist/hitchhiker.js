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
    var Configuration;
    (function (Configuration) {
        var SessionKey = (function () {
            function SessionKey(username, timestamp) {
                this.username = username;
                this.timestamp = timestamp;
            }
            SessionKey.fromKey = function (key) {
                return new SessionKey(key.split("#")[0], Number(key.split("#")[1]));
            };
            SessionKey.prototype.getKey = function () {
                return this.username + "#" + this.timestamp.toString();
            };
            SessionKey.prototype.isValid = function () {
                var today = new Date(Date.now());
                var keyDate = new Date(this.timestamp);
                return keyDate.getFullYear() == today.getFullYear() &&
                    keyDate.getMonth() == today.getMonth() &&
                    keyDate.getDay() == today.getDay();
            };
            return SessionKey;
        })();
        Configuration.SessionKey = SessionKey;
    })(Configuration = Core.Configuration || (Core.Configuration = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Storage;
    (function (Storage) {
        var SessionKey = Core.Configuration.SessionKey;
        var SessionStorage = (function () {
            function SessionStorage(userid) {
                this.Key = null;
                var oldSession = JSON.parse(localStorage.getItem(SessionStorage.SessionStorageKey));
                if (oldSession !== null) {
                    var sessionKey = SessionKey.fromKey(oldSession.userTrackingId);
                    if (!sessionKey.isValid()) {
                        this.Key = new SessionKey(sessionKey.username, Date.now());
                        this.currentSession = null;
                    }
                    else {
                        this.currentSession = oldSession;
                    }
                }
                else {
                    this.Key = new SessionKey(userid, Date.now());
                    this.currentSession = null;
                }
            }
            /**
             * Returns previous session if valid, or return null
             * @return {Session} previous session of user
             */
            SessionStorage.prototype.getPreviosSession = function () {
                return this.currentSession;
            };
            /**
             * Stores into local storage current user session
             */
            SessionStorage.prototype.storeSession = function () {
                localStorage.setItem(SessionStorage.SessionStorageKey, JSON.stringify(this.currentSession));
            };
            SessionStorage.SessionStorageKey = "hitchhiker.session";
            return SessionStorage;
        })();
        Storage.SessionStorage = SessionStorage;
    })(Storage = Core.Storage || (Core.Storage = {}));
})(Core || (Core = {}));
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
        function getCookieField(field) {
            var cookies = document.cookie.split(';');
            for (var i in cookies) {
                var pairValue = cookies[i].trim().split("=");
                if (pairValue[0] === field) {
                    return pairValue[1];
                }
            }
        }
        Highjacker.getCookieField = getCookieField;
        var SessionHighjacker = (function () {
            function SessionHighjacker(sessionKey, sessionStorage) {
                this.sessionKey = sessionKey;
                this.sessionStorage = sessionStorage;
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
                    session.userTrackingId = _this.sessionKey.getKey();
                    session.browser = new BrowserVersion(bowser.name, bowser.version);
                    // ip is better if we get from server-side
                    // see: https://github.com/sebpiq/rhizome/issues/106
                    session.os = window.navigator["oscpu"] || window.navigator.platform;
                    session.device = {
                        tablet: bowser.tablet === true ? bowser.tablet : false,
                        mobile: bowser.mobile === true ? bowser.mobile : false
                    };
                    session.createdAt = Date.now();
                    if (_this.publisher !== undefined) {
                        _this.publisher.publish(session);
                        _this.sessionStorage.currentSession = session;
                        _this.sessionStorage.storeSession();
                    }
                });
            };
            return SessionHighjacker;
        })();
        Highjacker.SessionHighjacker = SessionHighjacker;
    })(Highjacker = Core.Highjacker || (Core.Highjacker = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Bootstrap;
(function (Bootstrap) {
    var CookieHighjacker = Core.Highjacker.getCookieField;
    var SessionStorage = Core.Storage.SessionStorage;
    function BasicBootstrap(config) {
        var sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.trackingUrl
        });
        var userid = "";
        if (config.userid.isCookie === false || config.userid.isCookie === undefined) {
            userid = config.userid.value;
        }
        else {
            userid = CookieHighjacker(config.userid.value);
        }
        var sessionStorage = new SessionStorage(userid);
        if (sessionStorage.getPreviosSession() === null) {
            var sessionHighjacker = new Core.Highjacker.SessionHighjacker(sessionStorage.Key, sessionStorage);
            console.log("Highjacker created!");
            sessionHighjacker.registerPublisher(sessionPublisher);
            console.log("Registering Publisher created!");
            sessionHighjacker.sessionEvent();
        }
    }
    Bootstrap.BasicBootstrap = BasicBootstrap;
})(Bootstrap || (Bootstrap = {}));
