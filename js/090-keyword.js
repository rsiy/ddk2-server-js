/* 
// experimenting with ~- ~ html escaped eval

function evalKeywordValue(value, evaledKeys) {
var potentialKeys, 
matchedKey, 
regexValidKey = /^[a-z_][a-z0-9_]*$/;

// if value is not a string, throw exception
value = value.toString();
if (typeof value !== "string") { throw "K.eval error: keyword value does not coerce to a string"; }

// if evaledKeys is not an array, create an empty array
if (!_.isArray(evaledKeys)) { evaledKeys = []; }

// if value is an empty string, stop
if (value === "") { return value; }

// split the value on the tilde character
potentialKeys = value.split(DDK.char.tilde);

// if the potentialKeys array length is less than or equal to 2, stop
if (potentialKeys.length <= 2) { return value; }

// reject the first and last potentialKeys, which cannot start/end with tildes
potentialKeys = potentialKeys.slice(1, -1);

// map potentialKey array to object with details on html-escaping
potentialKeys = _.map(potentialKeys, function (potentialKey) {
var escape = (potentialKey.charAt(0) === "-");
return { escape: escape, key: (escape ? potentialKey.slice(1) : potentialKey) }
});

// filter the potentialKeys array for valid keys, ignoring - character at start
potentialKeys = _.filter(potentialKeys, function (potentialKey) {
return regexValidKey.test(potentialKey.key);
});

// if the potentialKeys array length is 0, stop
if (!potentialKeys.length) { return value; }

// sort the potentialKeys array based on alphabetical order, ignoring - character at start
potentialKeys.sort(function(a, b) {
return a.key > b.key;
});

// find the first potentialKey that has a value in the keyword hash
matchedKey = _.find(potentialKeys, function (potentialKey) {
return K(potentialKey.key) != null; // test for not null or undefined
});

// if there is no matched key, stop
if (!matchedKey) { return value; }

// check the recursion depth
// filter the evaled keys array for the matchedKey
// throw exception if matchedKey is found more than 5 times
if (_.filter(evaledKeys, function (key) { return key === matchedKey.key; }).length > 5) {
throw "K.eval error: recursive keyword `" + matchedKey.key + "`";
}

// execute a global replace for the matchedKey.key (with tildes and dash) on the value string
value = value.replace(new RegExp(DDK.char.tilde + (matchedKey.escape ? "\\-" : "") + matchedKey.key + DDK.char.tilde, "g"), matchedKey.escape ? _.escape(K(matchedKey.key)) : K(matchedKey.key));

// add the matchedKey to the evaledKeys array
evaledKeys.push(matchedKey.key);

// return a call to evalKeywordValue on the remaining value, passing in the evaledKeys array
return evalKeywordValue(value, evaledKeys);
}
*/

function evalKeywordValue(value, evaledKeys) {
	var potentialKeys, 
		matchedKey, 
		regexValidKey = /^[a-z_][a-z0-9_]*$/;
	
	// if value is not a string, throw exception
	value = value.toString();
	if (typeof value !== "string") { throw "K.eval error: keyword value does not coerce to a string"; }
	
	// if evaledKeys is not an array, create an empty array
	if (!_.isArray(evaledKeys)) { evaledKeys = []; }
	
	// if value is an empty string, stop
	if (value === "") { return value; }
	
	// split the value on the tilde character
	potentialKeys = value.split(DDK.char.tilde);
	
	// if the potentialKeys array length is less than or equal to 2, stop
	if (potentialKeys.length <= 2) { return value; }
	
	// reject the first and last potentialKeys, which cannot start/end with tildes
	potentialKeys = potentialKeys.slice(1, -1);
	
	// filter the potentialKeys array for valid keys
	potentialKeys = _.filter(potentialKeys, function (potentialKey) {
		return regexValidKey.test(potentialKey);
	});
	
	// if the potentialKeys array length is 0, stop
	if (!potentialKeys.length) { return value; }
	
	// sort the potentialKeys array based on alphabetical order
	potentialKeys.sort();
	
	// find the first potentialKey that has a value in the keyword hash
	matchedKey = _.find(potentialKeys, function (potentialKey) {
		return K(potentialKey) != null; // test for not null or undefined
	});
	
	// if there is no matched key, stop
	if (!matchedKey) { return value; }
	
	// check the recursion depth
	// filter the evaled keys array for the matchedKey
	// throw exception if matchedKey is found more than 5 times
	if (_.filter(evaledKeys, function (key) { return key === matchedKey; }).length > 5) {
		throw "K.eval error: recursive keyword `" + matchedKey + "`";
	}
	
	_.each(potentialKeys, function (potentialKey) {
		if (_.indexOf(evaledKeys, potentialKey) > -1) {
			
		}
	});
	
	
	// execute a global replace for the matchedKey (with tildes) on the value string
	value = value.replace(new RegExp(DDK.char.tilde + matchedKey + DDK.char.tilde, "g"), K(matchedKey));
	
	// add the matchedKey to the evaledKeys array
	evaledKeys.push(matchedKey);
	
	// return a call to evalKeywordValue on the remaining value, passing in the evaledKeys array
	return evalKeywordValue(value, evaledKeys);
}

var K = function(key, value, prefix) {
	// K(key [, value] [, prefix])
	
	// Basic Getter/Setter
	
	// K(key) : return value associated with key in hash
	// typeof key === "string" && key.indexOf("=") == -1 && !value && !prefix
	if (typeof key === "string" && key.indexOf("=") == -1 && typeof value === "undefined" && typeof prefix === "undefined") {
		return keywordOrDefault(key, "");
	}
	
	// K(key, value) : execute keyword update of key value pair in hash
	// typeof key === "string" && key.indexOf("=") == -1 && typeof value === "string" && !prefix
	else if (typeof key === "string" && key.indexOf("=") == -1 && typeof prefix === "undefined") {
		keywordUpdate(key, value);	
	}
	
	
	// Array Getters
	
	// K([key1, key2, ..., keyN]) : return array of values associated with keys in hash
	// _.isArray(key) === true && !value && !prefix
	else if (_.isArray(key) && typeof value === "undefined" && typeof prefix === "undefined") {
		var values = [],
			len = key.length
			;
		
		for (var i = 0; i < len; i++) {
			values[i] = keywordOrDefault(key[i], "");
		}
		
		return values;
	}
	
	// K([key1, key2, ..., keyN], prefix) : return array of values associated with keys in hash, with keys prepended by prefix
	// _.isArray(key) === true && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;
	else if (_.isArray(key) && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		var values = [],
			len = key.length
			;
		
		for (var i = 0; i < len; i++) {
			values[i] = keywordOrDefault(prefix + key[i], "");
		}
		
		return values;			
	}
	
	
	// Array Setters
	
	// K([key1, key2, ..., keyN], [value1, value2, ..., valueN]) : execute keyword updates on all key value pairs in key and value arrays
	// _.isArray(key) && _.isArray(value) && !prefix
	else if (_.isArray(key) && _.isArray(value) && typeof prefix === "undefined") {
		var len = key.length;
		
		for (var i = 0; i < len; i++) {
			keywordUpdate(key[i], value[i])	
				}	
	}
	
	// K([key1, key2, ..., keyN], [value1, value2, ..., valueN], prefix) : execute keyword updates on all key value pairs in key and value arrays, with keys prepended by prefix
	// _.isArray(key) && _.isArray(value) && typeof prefix === "string"
	else if (_.isArray(key) && _.isArray(value) && typeof prefix === "string") {
		var len = key.length;
		
		for (var i = 0; i < len; i++) {
			keywordUpdate(prefix + key[i], value[i])	
				}
	}		
	
	
	// URL Getters
	
	// ... there are no URL Getters ... use .toURL() to return a URL
	
	// URL Setters (note: URL Setters can begin with & or with the first key value, but not with ?)
	
	// K("&key1=value1&key2=value2&...&keyN=valueN") : execute keyword updates on all key value pairs in URL
	// typeof key === "string" && key.indexOf("=") > -1 && !value && !prefix
	else if (typeof key === "string" && key.indexOf("=") > -1 && typeof value === "undefined" && typeof prefix === "undefined") {
		
		var _key = (key.charAt(0) === '?' ? key.substring(1) : key),
			pairs = _key.split('&'),
			i;
		
		for (i = 0; i < pairs.length; i += 1) {
			var pair = pairs[i].split('=');
			if (pair[0]) {
				keywordUpdate(pair[0], decodeURIComponent(pair[1].replace(/\+/g,' ')));
			}
		}	
	}
	
	// K("&key1=value1&key2=value2&...&keyN=valueN", prefix) : execute keyword updates on all key value pairs in URL, with keys prepended by prefix
	// typeof key === "string" && key.indexOf("=") > -1 && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;		
	else if (typeof key === "string" && key.indexOf("=") > -1 && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		var _key = (key.charAt(0) === '?' ? key.substring(1) : key),
			pairs = _key.split('&'),
			i;
		
		for (i = 0; i < pairs.length; i += 1) {
			var pair = pairs[i].split('=');
			if (pair[0]) {
				keywordUpdate(prefix + pair[0], decodeURIComponent(pair[1].replace(/\+/g,' ')));
			}
		}	
	}
	
	
	// Object Getters
	
	// ... there are no Object Getters ... use .toObject to return an Object
	
	
	// Object Setters
	
	// K({key1: value1, key2: value2, ..., keyN: valueN}) : execute keyword updates on all key value pairs in object
	// _.isObject(key) && !key.from && !value && !prefix
	else if (_.isObject(key) && !key.from && typeof value === "undefined" && typeof prefix === "undefined") {
		for (var i in key) {
			keywordUpdate(i, key[i]);	
		}	
	}
	
	// K({key1: value1, key2: value2, ..., keyN: valueN}, prefix) : execute keyword updates on all key value pairs in object
	// _.isObject(key) && typeof value === "string" && !prefix
	// prefix = value;
	// value = undefined;		
	else if (_.isObject(key) && typeof value === "string" && typeof prefix === "undefined") {
		prefix = value;
		value = undefined;
		
		for (var i in key) {
			keywordUpdate(prefix + i, key[i]);	
		}
	}		
	
	
	// Advanced Operations
	
	// K({options...} : executes bulk keyword operation as defined by options object, which requires "from" parameter.
	// _.isObject(key) === true && key.from && !value && !prefix
	
	
	// Else
	
	// unrecognized K function signature: K(typeof key, typeof value, typeof prefix)
	
};

_.extend(K, {
	// .flush(prefix)
	flush: function(prefix) {
		var prefixes = [].concat(prefix),
			prefixCount = prefixes.length,
			i;
		
		for (i = 0; i < prefixCount; i += 1) {
			keywordFlush(prefixes[i]);
		}
	},
	
	// .toURL(prefix)
	toURL: function(prefix) {
		var prefixes = [].concat(prefix),
			prefixCount = prefixes.length,
			i,
			out = "";
		
		for (i = 0; i < prefixCount; i += 1) {
			out += keywordsToURL(prefixes[i]);
		}
		
		return out;
	},
	
	// .toObject(prefix)
	// this .toObject function will strip all prefixes up to and including the first underscore character in the key
	// for a more sensible prefix stripping, use toObject2
	toObject: function(prefix) {
		var prefixes = [].concat(prefix),
			prefixCount = prefixes.length,
			i,
			out = {};
		
		for (i = 0; i < prefixCount; i += 1) {
			_.extend(out, DDK.queryString.toObject(keywordsToURL(prefixes[i]), prefixes[i]));
		}
		
		return out;
	},
	
	// .toObject2(prefix)
	// will strip prefixes from the front of keys
	// will camelize remaining key names
	// will coerce value types
	toObject2: function(prefix) {
		var prefixes = [].concat(prefix),
			out = {};
		
		_.each(prefixes, function (prefix) {
			var queryString = keywordsToURL(prefix);
			
			_.each(_.filter(_.map(queryString.split("&"), function (pair) {
				// map query string to array pairs
				var parts = pair.split("=");
				return [_.string.camelize(parts[0].slice(prefix.length)), parts[1] ? _.string.coerce(decodeURIComponent(parts[1].replace(/\x2B/g, " "))) : null];
			}), function (pair) {
				// filter for key and value exists
				return pair[0] && (pair[1] != null);
			}), function (pair) {
				out[pair[0]] = pair[1];	
			});
		});
		
		return out;
	},
	
	//	// .eval(key)
	//	eval: function(key) {
	//		var value = keywordOrDefault(key, ""),
	//			valueParts = value.split(DDK.char.tilde);
	//		
	//		if (valueParts.length === 3) {
	//			valueParts[1] = keywordOrDefault(valueParts[1], DDK.char.tilde + valueParts[1] + DDK.char.tilde)
	//				value = valueParts.join("");
	//		}
	//		
	//		return value;
	//	},
	
	// .eval(key)
	eval: function (key) {
		return evalKeywordValue(K(key), [key]);
	},
	
	setDefault: function(key, value) {
		function setDefaultKeywordValue(_value, _key) {
			var initialValue = keywordOrDefault(_key, "");
			keywordUpdate(_key, initialValue || _value);
		}
		if (_.isObject(key)) {
			_.each(key, setDefaultKeywordValue);
		} else {
			setDefaultKeywordValue(value, key);
		}
	},
	
	// creates a keyword with a value of the current widget id
	// default keyword name is "widget_<widget_name>" where the widget name is lowercased
	// optionally provide a custom keyword name
	fromWidgetId: function(key) {
		K(key || ("widget_" + K("metric.widget_name").toLowerCase()), K("metric.id"));
	},
	
	// returns an object or a string created by parsing the value of the supplied keyword
	// useful for converting a rendered JSON dataset string back into a JavaScript object for use in server JavaScript
	toDatasetObject: function(key) {
		return _.string.parseJSON(DDK.unescape.brackets(K(key)));
	},
	
	isKeyword: function(key) {
		return _.string.toBoolean(containsKeyword(key));
	}
});
