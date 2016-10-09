/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Publishers {
        export interface IPublisherConfig {
            pubUrl: string;
        }

        export interface IPubInfo {}

        export interface IPublisher {
            publish(pubInfo:IPubInfo);
        }

        export class DefaultPublisher implements IPublisher {
            private pubUrl:string;

            publish(pubInfo:IPubInfo) {
                $.ajax({
                    url: this.pubUrl,
                    method: "POST",
                    data: {
                        payload:pubInfo
                    }
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
    }
}