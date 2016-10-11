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
            SessionKey.fromParts = function (userid, timestamp) {
                return new SessionKey(userid, timestamp);
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
        var TransitKey = (function () {
            function TransitKey(sessionKey) {
                this.sessionKey = sessionKey;
                this.transitId = Date.now(); // our transit id only needs it creation date
            }
            TransitKey.fromKey = function (transitKey) {
                var userid = transitKey.split('#')[0];
                var sessionTimestamp = Number(transitKey.split('#')[1]);
                var sessionKey = SessionKey.fromParts(userid, sessionTimestamp);
                var transit = new TransitKey(sessionKey);
                var transitId = Number(transitKey.split('#')[2]);
                transit.transitId = transitId;
                return transit;
            };
            TransitKey.prototype.getKey = function () {
                return this.sessionKey.getKey() + "#" + this.transitId;
            };
            /**
             * A session is only valid for 90 minutes (90 min * 60 seconds * 1000 ms)
             * @return {boolean}
             */
            TransitKey.prototype.isValid = function () {
                return (Date.now() - this.transitId) < 90 * 1000 * 60;
            };
            return TransitKey;
        })();
        Configuration.TransitKey = TransitKey;
    })(Configuration = Core.Configuration || (Core.Configuration = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Storage;
    (function (Storage) {
        var SessionKey = Core.Configuration.SessionKey;
        var TransitKey = Core.Configuration.TransitKey;
        var SessionStorageService = (function () {
            function SessionStorageService(userid) {
                this.Key = null;
                var oldSession = JSON.parse(localStorage.getItem(SessionStorageService.SessionStorageKey));
                if (oldSession !== null) {
                    var sessionKey = SessionKey.fromKey(oldSession.userTrackingId);
                    if (!sessionKey.isValid()) {
                        this.Key = new SessionKey(sessionKey.username, Date.now());
                        this.currentSession = null;
                    }
                    else {
                        this.Key = sessionKey;
                        this.currentSession = oldSession;
                    }
                }
                else {
                    this.Key = new SessionKey(userid, Date.now());
                    this.currentSession = null;
                }
            }
            SessionStorageService.getInstance = function (userid) {
                if (SessionStorageService.instance !== undefined) {
                    return SessionStorageService.instance;
                }
                else {
                    SessionStorageService.instance = new SessionStorageService(userid);
                    return SessionStorageService.instance;
                }
            };
            /**
             * Returns previous session if valid, or return null
             * @return {Session} previous session of user
             */
            SessionStorageService.prototype.getPreviosSession = function () {
                return this.currentSession;
            };
            /**
             * Stores into local storage current user session
             */
            SessionStorageService.prototype.storeSession = function () {
                localStorage.setItem(SessionStorageService.SessionStorageKey, JSON.stringify(this.currentSession));
            };
            SessionStorageService.SessionStorageKey = "hitchhiker.session";
            return SessionStorageService;
        })();
        Storage.SessionStorageService = SessionStorageService;
        var TransitStorageService = (function () {
            function TransitStorageService(sessionKey) {
                this.sessionKey = sessionKey;
                this.currentTransit = null;
                this.Key = null;
                var transit = this.getPrevious();
                if (transit !== undefined && transit !== null) {
                    var transitKey = TransitKey.fromKey(transit.transitId);
                    if (!transitKey.isValid()) {
                        // creates new transit with new key
                        this.currentTransit = this.createTransit(sessionKey.username);
                        this.publish = true;
                    }
                    else {
                        // updates old transit with the time delta
                        transit.duration += (Date.now() - transit.lastLoad);
                        this.currentTransit = transit;
                        this.publish = false;
                        this.Key = transitKey;
                    }
                }
                else {
                    // creates a fresh instance of transit
                    this.currentTransit = this.createTransit(sessionKey.username);
                    this.publish = true;
                }
            }
            TransitStorageService.getInstance = function (sessionKey) {
                if (TransitStorageService.instance !== undefined) {
                    return TransitStorageService.instance;
                }
                else {
                    TransitStorageService.instance = new TransitStorageService(sessionKey);
                    return TransitStorageService.instance;
                }
            };
            TransitStorageService.prototype.storeTransit = function () {
                localStorage.setItem(TransitStorageService.TransitStorageKey, JSON.stringify(this.currentTransit));
            };
            TransitStorageService.prototype.getPrevious = function () {
                return JSON.parse(localStorage.getItem(TransitStorageService.TransitStorageKey));
            };
            TransitStorageService.prototype.createTransit = function (userid) {
                this.Key = new TransitKey(SessionStorageService.getInstance(userid).Key);
                return {
                    sessionId: SessionStorageService.getInstance(userid).currentSession.userTrackingId,
                    transitId: this.Key.getKey(),
                    duration: 0,
                    createdAt: Date.now(),
                    lastLoad: Date.now(),
                    hits: []
                };
            };
            TransitStorageService.TransitStorageKey = "hitchhiker.transit";
            return TransitStorageService;
        })();
        Storage.TransitStorageService = TransitStorageService;
    })(Storage = Core.Storage || (Core.Storage = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Publishers;
    (function (Publishers) {
        var DefaultPublisher = (function () {
            function DefaultPublisher(pubConf) {
                this.pubConf = pubConf;
                this.pubUrl = pubConf.pubUrl;
            }
            DefaultPublisher.prototype.publish = function (pubInfo, callback) {
                if (callback == undefined) {
                    callback = function () { };
                }
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        payload: pubInfo
                    }
                }).then(function () {
                    callback();
                });
            };
            return DefaultPublisher;
        })();
        Publishers.DefaultPublisher = DefaultPublisher;
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
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Core;
(function (Core) {
    var Highjacker;
    (function (Highjacker) {
        var Session = Models.Session;
        var BrowserVersion = Models.BrowserVersion;
        var TransitStorageService = Core.Storage.TransitStorageService;
        ;
        var IHighjacker = (function () {
            function IHighjacker() {
            }
            IHighjacker.prototype.then = function () { };
            ;
            IHighjacker.prototype.registerPublisher = function (publisher) {
                this.publisher = publisher;
            };
            return IHighjacker;
        })();
        Highjacker.IHighjacker = IHighjacker;
        /**
        * This function reaches out for cookie and find the cookie value for
        * the username (that can be encripted, it doesn't matter)
        */
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
        var SessionHighjacker = (function (_super) {
            __extends(SessionHighjacker, _super);
            function SessionHighjacker(sessionKey, sessionStorageService) {
                _super.call(this);
                this.sessionKey = sessionKey;
                this.sessionStorageService = sessionStorageService;
            }
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
                        _this.sessionStorageService.currentSession = session;
                        _this.sessionStorageService.storeSession();
                    }
                });
            };
            return SessionHighjacker;
        })(IHighjacker);
        Highjacker.SessionHighjacker = SessionHighjacker;
        var TransitHighjacker = (function (_super) {
            __extends(TransitHighjacker, _super);
            function TransitHighjacker(sessionKey) {
                _super.call(this);
                this.sessionKey = sessionKey;
            }
            TransitHighjacker.prototype.start = function () {
                var _this = this;
                $(document).ready(function () {
                    if (TransitStorageService.getInstance(_this.sessionKey).publish) {
                        var currentTransit = TransitStorageService.getInstance(_this.sessionKey).currentTransit;
                        _this.publisher.publish(currentTransit);
                        TransitStorageService.getInstance(_this.sessionKey).storeTransit();
                    }
                });
            };
            return TransitHighjacker;
        })(IHighjacker);
        Highjacker.TransitHighjacker = TransitHighjacker;
        var HitHighjacker = (function (_super) {
            __extends(HitHighjacker, _super);
            function HitHighjacker(transitKey) {
                _super.call(this);
                this.transitKey = transitKey;
                this.hit = false;
            }
            HitHighjacker.prototype.start = function () {
                var _this = this;
                $('a').click(function (e) {
                    if (!_this.hit) {
                        e.preventDefault();
                        var toLink = e.target.attributes.href.value;
                        var fromLink = window.location.toString();
                        var hit = {
                            hitId: _this.transitKey.getKey() + "#" + Date.now(),
                            transitId: _this.transitKey.getKey(),
                            toPage: toLink,
                            fromPage: fromLink
                        };
                        _this.e = e;
                        _this.publisher.publish(hit, function () {
                            _this.hit = true;
                            _this.e.target["click"]();
                        });
                    }
                });
            };
            HitHighjacker.prototype.then = function () {
                console.log("finito");
            };
            return HitHighjacker;
        })(IHighjacker);
        Highjacker.HitHighjacker = HitHighjacker;
    })(Highjacker = Core.Highjacker || (Core.Highjacker = {}));
})(Core || (Core = {}));
;/// <reference path="../../hitchhikerjs.ts" />
var Bootstrap;
(function (Bootstrap) {
    var CookieHighjacker = Core.Highjacker.getCookieField;
    var SessionStorageService = Core.Storage.SessionStorageService;
    var TransitStorageService = Core.Storage.TransitStorageService;
    function BasicBootstrap(config) {
        var sessionPublisher = new Core.Publishers.SessionPublisher({
            pubUrl: config.sessionTrackUrl
        });
        var transitPublisher = new Core.Publishers.DefaultPublisher({
            pubUrl: config.transitTrackUrl
        });
        var hitPublisher = new Core.Publishers.DefaultPublisher({
            pubUrl: config.hitTrackUrl
        });
        var userid = "";
        if (config.userid.isCookie === false || config.userid.isCookie === undefined) {
            userid = config.userid.value;
        }
        else {
            userid = CookieHighjacker(config.userid.value);
        }
        var sessionStorage = SessionStorageService.getInstance(userid);
        if (sessionStorage.getPreviosSession() === null) {
            // initializes session
            var sessionHighjacker = new Core.Highjacker.SessionHighjacker(sessionStorage.Key, sessionStorage);
            console.log("Highjacker created!");
            sessionHighjacker.registerPublisher(sessionPublisher);
            console.log("Registering Publisher created!");
            sessionHighjacker.sessionEvent();
        }
        var transitHighjacker = new Core.Highjacker.TransitHighjacker(sessionStorage.Key);
        transitHighjacker.registerPublisher(transitPublisher);
        transitHighjacker.start();
        var hitHighjacker = new Core.Highjacker.HitHighjacker(TransitStorageService.getInstance(this.sessionKey).Key);
        hitHighjacker.registerPublisher(hitPublisher);
        hitHighjacker.start();
    }
    Bootstrap.BasicBootstrap = BasicBootstrap;
})(Bootstrap || (Bootstrap = {}));
