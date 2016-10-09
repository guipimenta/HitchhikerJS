/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Storage {
        import SessionKey = Core.Configuration.SessionKey;
        import TransitKey = Core.Configuration.TransitKey;
        import Session = Models.Session;
        import Transit = Models.Transit;

        export class SessionStorageService {
            private static SessionStorageKey: string = "hitchhiker.session";
            public currentSession:Session;
            public Key:SessionKey = null;
            private static instance:SessionStorageService;

            public static getInstance(userid:string) {
                if(SessionStorageService.instance !== undefined) {
                    return SessionStorageService.instance;
                } else {
                    SessionStorageService.instance = new SessionStorageService(userid);
                    return SessionStorageService.instance;
                }
            }

            /**
             * Returns previous session if valid, or return null
             * @return {Session} previous session of user
             */
            public getPreviosSession(): Session {
                return this.currentSession;
            }

            /**
             * Stores into local storage current user session
             */
            public storeSession() {
                localStorage.setItem(SessionStorageService.SessionStorageKey, JSON.stringify(this.currentSession));
            }

            constructor(userid:string) {
                let oldSession:Session = JSON.parse(localStorage.getItem(SessionStorageService.SessionStorageKey));
                if(oldSession !== null) {
                    let sessionKey = SessionKey.fromKey(oldSession.userTrackingId);
                    if(!sessionKey.isValid()) {
                        this.Key = new SessionKey(sessionKey.username, Date.now());
                        this.currentSession = null;
                    } else {
                        this.Key = sessionKey;
                        this.currentSession = oldSession;
                    }
                } else {
                    this.Key = new SessionKey(userid, Date.now());
                    this.currentSession = null;
                }
            }
        }

        export class TransitStorageService {
            private static TransitStorageKey: string = "hitchhiker.transit";
            public currentTransit:Transit = null;
            public Key:TransitKey = null;
            private static instance:TransitStorageService;
            public publish:boolean;

            public static getInstance(sessionKey:SessionKey) {
                if(TransitStorageService.instance !== undefined) {
                    return TransitStorageService.instance;
                } else {
                    TransitStorageService.instance = new TransitStorageService(sessionKey);
                    return TransitStorageService.instance;
                }
            }

            public storeTransit() {
                localStorage.setItem(TransitStorageService.TransitStorageKey, JSON.stringify(this.currentTransit));
            }

            public getPrevious():Transit {
                return JSON.parse(localStorage.getItem(TransitStorageService.TransitStorageKey));
            }

            public createTransit(userid:string):Transit {
                this.Key = new TransitKey(SessionStorageService.getInstance(userid).Key);
                return {
                            sessionId: SessionStorageService.getInstance(userid).currentSession.userTrackingId,
                            transitId: this.Key.getKey(),
                            duration: 0,                        
                            createdAt: Date.now(),
                            lastLoad: Date.now(),
                            hits:[]
                        };
            }


            constructor(public sessionKey:SessionKey) {
                let transit:Transit = this.getPrevious();
                if(transit !== undefined && transit !== null) {
                    let transitKey:TransitKey = TransitKey.fromKey(transit.transitId);
                    if(!transitKey.isValid()) {
                        // creates new transit with new key
                        this.currentTransit = this.createTransit(sessionKey.username);
                        this.publish = true;
                    } else {
                        // updates old transit with the time delta
                        transit.duration += (Date.now() - transit.lastLoad);
                        this.currentTransit = transit;    
                        this.publish = false;
                    }
                } else {
                    // creates a fresh instance of transit
                    this.currentTransit = this.createTransit(sessionKey.username);
                    this.publish = true;   
                }
            }
        }
    }
}