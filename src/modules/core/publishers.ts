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

        export class SessionPublisher implements IPublisher {
            private pubUrl:string;

            publish(pubInfo:IPubInfo) {

            }

            constructor(public pubConf: IPublisherConfig) {
                this.pubUrl = pubConf.pubUrl;
            }
        }
    }
}