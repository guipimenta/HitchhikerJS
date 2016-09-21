/// <reference path="../../hitchhikerjs.ts" />

module Models {
	import bb = Bootstrap.Bootstrap;
	/**
	* This represents a user session
	* Must hold information about user over the website
	*/
	export interface Session {
		userTrackingId: string;
		name: string;
		cookieId: string;
		location: string;
	}
}
