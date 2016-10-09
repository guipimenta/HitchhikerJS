/// <reference path="../../hitchhikerjs.ts" />

module Models {
    export class BrowserVersion {
        name: string;
        version: number | string;
        constructor(name:string, version:number | string) {
            this.name = name;
            this.version = version;
        }
    } 

    /**
     * Defines if is mobile or tablet
     * From Device and Browser we can infer the platform
     */
    export interface Device {
        tablet: boolean;
        mobile: boolean;
    }

    /**
    * This represents a user session
    * Must hold information about user over the website
    */
    export class Session {
        userTrackingId: string; // Should it be set by the server-side
        cookieId: number;       // SessionId is more straightforward
        browser: BrowserVersion;// Browser IP
        os: string;             // Operational System
        device: Device;         // Samsung, nokia, iPhone etc
        // ip: string;             // We definetly need the IP, but I don`t know if store as a string is the perfet solution
        isRobot: boolean;       // We need to try to mark Robot sessions...
        createdAt: number;      // let's just send unix timestamp?
    }
    
    export interface Transit {
        transitId: string;
        duration: number;   //We need to track the duration of a transit, not sure how to make this happen
        sessionId: string;
        createdAt: number;  // unix timestamp
        lastLoad: number;   // last storage load timestamp
        hits: Hit[];
    } 
    
    //Track the user Hit
    export interface Hit {
        hitID: number;
        transitId: number;
        clickId: number;    //Start on 1 if is the first click at the website for the given transit, go on ascending order
        referrerUrl: string;
        traffifChannelId: number;
        refTag: string;     //We can send a parameter to track custom sources
        toPage: string;
        fromPage: string;
        pageType: string;   //We will need to define Page Types, for example: checkout, gateway, detail page, etc
        productId: string;  //If the hit is on a product we need to store it`s ID
        category: string;   //If the hit is on a browse category, store the category
        isLeave: boolean    //True if this is the last Click for the given Transit
    }
    
    //Track the search queries that happened at the website
    export interface Search {
        searchId: number;
        transitId:number;
        query: string;
    }
}
