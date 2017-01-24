/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Publishers {
        import IHighjacker = Core.Highjacker.IHighjacker;
        export interface IPublisherConfig {
            pubUrl: string;
        }

        export interface IPubInfo {}

        export interface IPublisher {
            publish(pubInfo:IPubInfo, callback?:Function);
        }

        export interface IDefaultPublisher extends IPublisher {}

        export class DefaultPublisher implements IDefaultPublisher {
            private pubUrl:string;

            publish(pubInfo:IPubInfo, callback?:Function) {
                if(callback == undefined) {
                    callback = () => {};
                }
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        payload:pubInfo
                    }
                }).then(() => {
                    callback();
                });
            }

            constructor(public pubConf: IPublisherConfig) {
                this.pubUrl = pubConf.pubUrl;
            }
        }

        export class SessionPublisher implements IPublisher {
            private pubUrl:string;

            publish(pubInfo:IPubInfo) {
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        sessionInfo:pubInfo
                    }
                });
            }

            constructor(public pubConf: IPublisherConfig) {
                this.pubUrl = pubConf.pubUrl;
            }
        }

        export class ButtonHitPublisher implements IPublisher {
            private SessionStorageKey = "hitchhiker.buttonhitpublisher";
            private pubUrl:string;
            
            publish(pubInfo:IPubInfo) {
                sessionStorage.setItem(this.SessionStorageKey, JSON.stringify(pubInfo));
            }

            publishAjax(pubInfo:IPubInfo) {
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        sessionInfo:pubInfo
                    }
                });
            }

            constructor(public pubConf: IPublisherConfig) {
                let pubInfo = JSON.parse(sessionStorage.getItem(this.SessionStorageKey));
                this.pubUrl = pubConf.pubUrl;
                if(pubInfo != undefined && pubInfo != null) {
                    pubInfo.toPage = window.location.href;
                    this.publishAjax(pubInfo);
                    sessionStorage.removeItem(this.SessionStorageKey);
                }
            }
        }
    }
}