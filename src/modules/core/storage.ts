/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Storage {
        import SessionKey = Core.Configuration.SessionKey;
        import Session = Models.Session;
        export class SessionStorage {
            private static SessionStorageKey: string = "hitchhiker.session";
            public currentSession:Session;
            public Key:SessionKey = null;

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
                localStorage.setItem(SessionStorage.SessionStorageKey, JSON.stringify(this.currentSession));
            }

            constructor(userid:string) {
                let oldSession:Session = JSON.parse(localStorage.getItem(SessionStorage.SessionStorageKey));
                if(oldSession !== null) {
                    let sessionKey = SessionKey.fromKey(oldSession.userTrackingId);
                    if(!sessionKey.isValid()) {
                        this.Key = new SessionKey(sessionKey.username, Date.now());
                        this.currentSession = null;
                    } else {
                        this.currentSession = oldSession;
                    }
                } else {
                    this.Key = new SessionKey(userid, Date.now());
                    this.currentSession = null;
                }
            }
        }
    }
}