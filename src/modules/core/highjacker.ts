/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Highjacker {
        import IPublisher = Core.Publishers.IPublisher;
        import Session = Models.Session;
        import BrowserVersion = Models.BrowserVersion;
        import SessionKey = Core.Configuration.SessionKey;
        import SessionStorage = Core.Storage.SessionStorage;
        
        export interface IHighjackedInfo {};
        export interface IHighjacker {
            registerPublisher(publisher:IPublisher);
        }

        export interface ISessionHighjackerConfig {}

        export function getCookieField(field:string) {
            let cookies:string[] = document.cookie.split(';');
            for(let i in cookies) {
                let pairValue = cookies[i].trim().split("=");
                if(pairValue[0] === field) {
                    return pairValue[1];
                }
            }
        }

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
                    session.userTrackingId = this.sessionKey.getKey();
                    session.browser = new BrowserVersion(bowser.name, bowser.version);
                    // ip is better if we get from server-side
                    // see: https://github.com/sebpiq/rhizome/issues/106
                    session.os =  window.navigator["oscpu"] || window.navigator.platform;
                    session.device = {
                        tablet: bowser.tablet === true ? bowser.tablet : false,
                        mobile: bowser.mobile === true ? bowser.mobile : false 
                    };
                    session.createdAt = Date.now();
                    if(this.publisher !== undefined) {
                        this.publisher.publish(session);
                        this.sessionStorage.currentSession = session;
                        this.sessionStorage.storeSession();
                    }
                });
            }

            constructor(public sessionKey:SessionKey, public sessionStorage:SessionStorage) {}
        }
    }
}