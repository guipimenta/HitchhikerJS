/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Highjacker {
        import IPublisher = Core.Publishers.IPublisher;
        import IDefaultPublisher = Core.Publishers.IDefaultPublisher;
        import Session = Models.Session;
        import Transit = Models.Transit;
        import Hit = Models.Hit;
        import BrowserVersion = Models.BrowserVersion;
        import SessionKey = Core.Configuration.SessionKey;
        import TransitKey = Core.Configuration.TransitKey;
        import SessionStorageService = Core.Storage.SessionStorageService;
        import TransitStorageService = Core.Storage.TransitStorageService;
        
        export interface IHighjackedInfo {};
        export class IHighjacker {
            public publisher:IPublisher;

            then(){};

            registerPublisher(publisher:IPublisher) {
                this.publisher = publisher;
            }
        }

        export interface ISessionHighjackerConfig {}

        /**
        * This function reaches out for cookie and find the cookie value for
        * the username (that can be encripted, it doesn't matter)
        */
        export function getCookieField(field:string) {
            let cookies:string[] = document.cookie.split(';');
            for(let i in cookies) {
                let pairValue = cookies[i].trim().split("=");
                if(pairValue[0] === field) {
                    return pairValue[1];
                }
            }
        }

        export class SessionHighjacker extends IHighjacker {
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
                        this.sessionStorageService.currentSession = session;
                        this.sessionStorageService.storeSession();
                    }
                });
            }

            constructor(public sessionKey:SessionKey, public sessionStorageService:SessionStorageService) {
                super();
            }
        }
        
        export class TransitHighjacker extends IHighjacker {
            public start() {
                $(document).ready(() => {
                    if(TransitStorageService.getInstance(this.sessionKey).publish) {
                        let currentTransit:Transit = TransitStorageService.getInstance(this.sessionKey).currentTransit;
                        this.publisher.publish(currentTransit);   
                        TransitStorageService.getInstance(this.sessionKey).storeTransit();
                    }
                });
            }

            constructor(public sessionKey:SessionKey) {
                super();
            }
        }

        export class HitHighjacker extends IHighjacker {
            public hit:boolean = false;
            public e:JQueryEventObject;
            public start() {
                $('a').click((e:JQueryEventObject) => {
                    if(!this.hit) {
                        e.preventDefault();
                        let toLink:string = (<any> e.target.attributes).href.value;
                        let fromLink:string =  window.location.toString();
                        let hit = {
                            hitId: this.transitKey.getKey() + "#" + Date.now(),
                            transitId: this.transitKey.getKey(),
                            toPage: toLink,
                            fromPage: fromLink
                        };
                        this.e = e;
                        this.publisher.publish(hit, () => {
                            this.hit = true;
                            this.e.target["click"]();
                        });
                    }
                });
            }

            constructor(public transitKey:TransitKey) {
                super();
            }
        }

        export class HitButtonHighjacker extends IHighjacker {
            public hit:boolean = false;
            public e:JQueryEventObject;
            public start() {
                $(':button').click((e:JQueryEventObject) => {
                    if(!this.hit) {
                        e.preventDefault();
                        let fromLink:string = window.location.toString();
                        let hit = {
                            hitId:     this.transitKey.getKey() + "#" + Date.now(),
                            transitId: this.transitKey.getKey(),
                            fromPage: fromLink,
                            toPage: ""
                        };
                        this.e = e;
                        this.publisher.publish(hit, () => {
                            this.hit=true;
                            this.e.target["click"]();
                        });
                    }
                });
            }
            constructor(public transitKey:TransitKey) {
                super();
            }
        }
    }
}