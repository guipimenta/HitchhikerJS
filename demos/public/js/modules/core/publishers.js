/// <reference path="../../hitchhikerjs.ts" />
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
