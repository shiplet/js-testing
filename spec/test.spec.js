var data = require('../data');

exports.parseTemplate = function(obj, iterations) {
    /* ======================== */
    /* Parameter type error handling */
    /* ======================= */

    if (typeof(obj) !== ('object' || null || undefined)){
	throw(new Error('First parameter expected to be an object, was actually a(n) '+typeof(obj)+'.'));
	return false;
    } else if (typeof(iterations) !== ('number' || null || undefined)) {
	throw(new Error('Second parameter expected to be a number, was actually a(n) '+typeof(iterations)+'.'));
	return false;
    }

    var testArr = [];
    var finalArr = [];

    for (var i = 1; i <= iterations; i++) {
	var x = recurse(obj, i);
	finalArr.push(x);
    }

    function recurse(obj, iteration) {
	if (obj instanceof Array) {
	    for (var i = 0; i < obj.length; i++) {
		var w = recurse(obj[i], iteration);
		if (w) {
		    return(obj);
		}
	    }
	} else if (obj instanceof Object && !(obj instanceof Array)) {
	    for (var key in obj) {
		var x = recurse(obj[key], iteration);
		if(x) {
		    return true;
		}
	    }
	} else if (typeof(obj) === 'string') {
	    if (obj.indexOf('<$') !== -1 && obj.indexOf('$>') !== -1) {
		var splitStr = obj.split('$');
		var item = splitStr[1];
		item+=iteration;
		splitStr[1] = item;
		var y = splitStr.join('$');
		return obj = y;
	    }
	}
    }

    return finalArr;
};
