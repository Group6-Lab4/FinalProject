/* 
 * @author Gigi
 * @desc this js contains general tools
 */



var Utils = {
	// Page flow functions
	getURLParam: function(sParam) {
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');

		for (var i = 0; i < sURLVariables.length; i++) {
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] === sParam)
			{
				return sParameterName[1];
			}
		}
	},
	getURLHash: function() {
		return window.location.hash.substring(1);
	}
};


