var DDK = DDK || {};
DDK.VERSION = "2.0.0";

DDK.queryString = {
	removeBlankValues: function(queryString) {
		var pairs = queryString.split("&"),
			pair = [],
			pairsCount = pairs.length,
			i,
			out = "";
		
		for (i = 0; i < pairsCount; i += 1) {
			pair = pairs[i].split("=");
			if (pair[0] && pair[1]) {
				out += "&" + pair[0] + "=" + pair[1];
			}
		}
		
		return out;
	},
	fromOptions: function(controlName, options) {
		return _.map(options, function(option) {
			return "&" + controlName + "_" + option + "=" + encodeURIComponent(K(controlName + "_" + option));
		}).join("");
	},
	toObject: function(optionsQueryString, prefix) {
		var options = optionsQueryString.split("&"),
			pair,
			key,
			value,
			option,
			i,
			optionsCount = options.length,
			out = {};
		
		for (i = 0; i < optionsCount; i += 1) {
			pair = options[i].split("=");
			key = pair[0];
			value = pair[1];
			if (key && value) {
				option = key.slice(key.indexOf("_") + 1);
				out[option] = decodeURIComponent(value.replace(/\x2B/g, " "));	
			}
		}
		
		return out;
	}
};
