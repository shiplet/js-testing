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

    var holdArr = [];
    var finalArr = [];

    for (var i = 1; i <= iterations; i++) {
	holdArr.push(obj);
    }

    for (var j = 0; j < holdArr.length; j++ ) {
	recurse(holdArr[j], j);
	console.log('Here');
    }

    function recurse(obj, iteration) {
    	if (obj instanceof Array) {
    	    for (var i = 0; i < obj.length; i++) {
    		recurse(obj[i], iteration);	
    	    }
    	} else if (obj instanceof Object && !(obj instanceof Array)) {
    	    for (var key in obj) {
    		var x = recurse(obj[key], iteration);
    		if(x) {
    		    console.log('Successful x-ing: ', x);
    		    obj[key] = x;		    		   		    
    		}
		if (x && x.indexOf('year') !== -1 ) {
		    //console.log(obj);
		}
    	    }
    	} else if (typeof(obj) === 'string') {
    	    if (obj.indexOf('<$') !== -1 && obj.indexOf('$>') !== -1) {
    		var splitStr = obj.split('$');
    		var item = splitStr[1];
    		item+=iteration;
    		splitStr[1] = item;
    		var y = splitStr.join('$');
    		return y;
    		//console.log(obj);
    	    }
    	}
    }
    
};
