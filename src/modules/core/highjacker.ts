/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Highjacker {
        import IPublisher = Core.Publishers.IPublisher;
        import Session = Models.Session;
        import BrowserVersion = Models.BrowserVersion;
        export interface IHighjackedInfo {};
        export interface IHighjacker {
            registerPublisher(publisher:IPublisher);
        }

        export interface ISessionHighjackerConfig {}

        export class SessionHighjacker implements IHighjacker {
            public publisher:IPublisher;
            
            registerPublisher(publisher:IPublisher) {
                this.publisher = publisher;
            }

            /**
            * This will handle onload event.
            * It will push to webserver all information in cookie
            * (don't have time to handle if )
            */
            sessionEvent() {
                $(document).ready(() => {
                    let session: Session = new Session();
                    session.browser = new BrowserVersion(bowser.name, bowser.version);
                    // session.location (better fill this up on server-side cause of browser compatibility)
                    // see: https://github.com/sebpiq/rhizome/issues/106
                    session.os =  window.navigator["oscpu"] || window.navigator.platform;
                    session.createdAt = Date.now();
                    if(this.publisher !== undefined) {
                        this.publisher.publish(session);
                    }
                });
            }

            constructor() {}
        }
    }
}