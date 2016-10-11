/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Configuration {
        export interface ServerConfiguration {
            /**
             * Url to send session to
             * @type {string}
             */
            sessionTrackUrl: string;
            
            transitTrackUrl: string;

            hitTrackUrl: string;

            /**
             * Describes the userid. Can be on cookie, or can be the value as string.
             * @type {string}
             */
            userid: {
                isCookie: boolean,
                value: string
            }
        }

        export class SessionKey {
            constructor(public username:string, public timestamp:number) {}

            static fromKey(key:string):SessionKey {
                return new SessionKey(key.split("#")[0], Number(key.split("#")[1]));
            }

            static fromParts(userid:string, timestamp:number):SessionKey {
                return new SessionKey(userid, timestamp);
            }

            getKey():string {
                return this.username + "#" + this.timestamp.toString();
            }

            isValid():boolean {
                let today:Date = new Date(Date.now());
                let keyDate = new Date(this.timestamp);
                return keyDate.getFullYear() == today.getFullYear() &&
                       keyDate.getMonth() == today.getMonth() &&
                       keyDate.getDay() == today.getDay();
            }
        }

        export class TransitKey {
            transitId: number;

            constructor(public sessionKey:SessionKey){
                this.transitId = Date.now();    // our transit id only needs it creation date
            }

            public static fromKey(transitKey:string):TransitKey {
                let userid:string = transitKey.split('#')[0];
                let sessionTimestamp:number = Number(transitKey.split('#')[1]);
                let sessionKey:SessionKey = SessionKey.fromParts(userid, sessionTimestamp);
                let transit = new TransitKey(sessionKey);
                let transitId:number = Number(transitKey.split('#')[2]);
                transit.transitId = transitId;
                return transit;
            }

            public getKey():string {
                return  this.sessionKey.getKey() + "#" + this.transitId;
            }

            /**
             * A session is only valid for 90 minutes (90 min * 60 seconds * 1000 ms)
             * @return {boolean}
             */
            public isValid():boolean {
                return (Date.now() - this.transitId) < 90 * 1000 * 60;
            }
        }
    }
}
