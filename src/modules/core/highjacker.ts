/// <reference path="../../hitchhikerjs.ts" />

module Core {
    export namespace Highjacker {
        import IPublisher = Core.Publishers.IPublisher;
        import Session = Models.Session;
        export interface IHighjackedInfo {};
        export interface IHighjacker {
            registerPublisher(publisher:IPublisher);
        }

        export interface ISessionHighjackerConfig {

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
                $(window).load(() => {

                });
            }

            constructor() {

            }
        }

        $(window).bind('beforeunload', function(){
          return 'Are you sure you want to leave?';
        });
    }
}