var data = require('../data');

exports.parseTemplate = function(obj, iterations) {
    
    /* ======================== */
    /* Parameter Type error handling */
    /* ======================= */

    if (typeof(obj) !== ('object' || null || undefined)){
	throw(new Error('First parameter expected to be an object, was actually a(n) '+typeof(obj)+'.'));
	return false;
    } else if (typeof(iterations) !== ('number' || null || undefined)) {
	throw(new Error('Second parameter expected to be a number, was actually a(n) '+typeof(iterations)+'.'));
	return false;
    }

    /* ======================== 

     Since JavaScript arrays are pass-by-reference, I have two for-loops.

     The first uses JSON.parse and JSON.stringify to isolate the cloned
     array from the original, thus removing any pass-by-reference conflicts.

     The second for-loop runs the 'recurse' function on each index of the newly
     isolated array, thus ensuring that any property edits remain within the 
     specified object.

     ======================= */

    var holdArr = [];
    var finalArr = [];

    for (var i = 1; i <= iterations; i++) {
	holdArr.push(JSON.parse(JSON.stringify(obj)));
    }

    for (var j = 0; j < holdArr.length; j++ ) {
    	recurse(holdArr[j][0], j);
    }
    
    /* ======================== 
     
     The 'recurse' function provides parsing support to a theoretically infinite
     level of embedded objects/arrays (or at least to the deepest level allowed by 
     system limitations).

     Its 'obj' property could be anything that falls under JavaScript's 'Object' 
     data-type, which is pretty much everything. But it filters based on three 
     criteria:

     --> Is it an Array?

     --> Is it an Object that's NOT an Array? (Checked because all Arrays are Objects,
     but not all Objects are Arrays)

     --> Is it a 'string'?

     If any of these conditions aren't met, the function silently fails. See below for 
     behaviors specific to each criterion.

     ======================= */


    function recurse(obj, iteration) {

	/*
	 If the 'obj' is an Array, 'recurse' runs itself on each
	 index of the array, making sure to pass in the 'iteration'
	 parameter. This is necessary because each additional call to
	 recurse() will create its own scope, inaccessible to any parent
	 scope/function.
	 */	
    	if (obj instanceof Array) {
    	    for (var i = 0; i < obj.length; i++) {
    		recurse(obj[i], iteration);
    	    }
    	}

	/*
	 If the 'obj' is an Object that's NOT an Array, 'recurse' runs
	 itself on each property in the Object, again passing in the
	 'iteration' parameter. The purpose is to find any key whose value
	 is a 'string'.
	 */
	else if (obj instanceof Object && !(obj instanceof Array)) {
    	    for (var key in obj) {
    		var x = recurse(obj[key], iteration);
    		if(x) {
    		    console.log('Shifted value: ', x);
    		    obj[key] = x;		    		   		    
    		}
    		if (x && x.indexOf('year') !== -1 ) {
		    finalArr.push(obj);
    		}
    	    }
    	}

	/*
	 Once a 'string' is found, this block checks it for the indicated tags:
	 '<$' and '&>'. If the tags are found, it parses out the contained 
	 value, increments it with the 'iteration' parameter, and returns it.

	 This returned value will be caught by the above block, which then sets the
	 calling key - the key that was active when the 'recurse' function was called -
	 equal to the returned value.

	 If the returned value contains the word 'year', the last key[value] property
	 expected by 'recurse', then the parent object, which was passed in by the 
	 first of the three code blocks, is pushed to the 'finalArr' variable.
	 */
	else if (typeof(obj) === 'string') {
    	    if (obj.indexOf('<$') !== -1 && obj.indexOf('$>') !== -1) {
    		var splitStr = obj.split('$');
    		var item = splitStr[1];
    		item+=iteration;
    		splitStr[1] = item;
    		var y = splitStr.join('$');
    		return y;
    	    }
    	}
    }

    /*
     Once you get here, you'll have parsed every possible Array, Object, and key[value]
     pair in the originally passed-in object, and have incremented the targeted values
     the number of times indicated by the 'iteration' parameter.
     */
    return finalArr;
    
};
