/// <reference path="../../hitchhikerjs.ts" />

module Models {
	import bb = Bootstrap.Bootstrap;
	/**
	* This represents a user session
	* Must hold information about user over the website
	*/
	export interface Session {
		userTrackingId: integer;
		name: string; 		//What is this field for? We can get the customer name by his ID
		cookieId: integer; 	//SessionId is more straightforward
		location: string; 	//This will be the country, state, city? 
		browser: string;
		os: string; 		//Operational System
		device: string;		// Samsung, nokia, iPhone etc
		ip: string;		//We definetly need the IP, but I don`t know if store as a string is the perfet solution
		isRobot: boolean; 	//We need to try to mark Robot sessions...
		createdAt: date;
	}
	
	export interface Transit {
		transitId: integer;
		duration: float; 	//We need to track the duration of a transit, not sure how to make this happen
		sessionId: integer;
		createdAt: date;
	} 
	
	//Track the user Hit
	export interface Hit{
		hitID: integer;
		transitId: integer;
		clickId: integer;	//Start on 1 if is the first click at the website for the given transit, go on ascending order
		referrerUrl: string;
		traffifChannelId: integer;
		refTag: string; 	//We can send a parameter to track custom sources
		toPage: string;
		fromPage: string;
		pageType: string; 	//We will need to define Page Types, for example: checkout, gateway, detail page, etc
		productId: string;	//If the hit is on a product we need to store it`s ID
		category: string;	//If the hit is on a browse category, store the category
		isLeave: boolean	//True if this is the last Click for the given Transit
	}
	
	//Track the search queries that happened at the website
	export interface Search{
		searchId: integer;
		transitId:integer;
		query: string;
	}
}
