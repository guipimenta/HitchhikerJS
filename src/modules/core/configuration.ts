/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Configuration {
        export interface ServerConfiguration {
            /**
             * Url to send session to
             * @type {string}
             */
            trackingUrl: string;
            
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

            static fromKey(key:string) {
                return new SessionKey(key.split("#")[0], Number(key.split("#")[1]));
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
    }
}
