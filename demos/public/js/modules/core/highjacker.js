/// <reference path="../../hitchhikerjs.ts" />
var Core;
(function (Core) {
    var Highjacker;
    (function (Highjacker) {
        var Session = Models.Session;
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
                    session.browser = bowser.name;
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
        $(window).bind('beforeunload', function () {
            return 'Are you sure you want to leave?';
        });
    })(Highjacker = Core.Highjacker || (Core.Highjacker = {}));
})(Core || (Core = {}));
