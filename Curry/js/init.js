// Check http://demos.flesler.com/Curry/js/Curry.js for the curry() function
// These are some examples of currying application
// They were also executed so you can try them on a console

// General
var compose = curry(function( f, g, x, y ){
	return g( x, f(y) );
});	
var delegate = curry(function( f, v ){
	f(v);
});

// Math
var sum = curry(function( x, y ){
	return x + y;
});
var inc = sum(1);
var dec = sum(-1);

var prod = curry(function( x, y ){
	return x * y;
});
var negate = prod(-1);		
var sub = compose(negate, sum);
var inv = function( x ){
	return 1/x;
};
var div = compose(inv, prod);

// DOM		
var attr = curry(function( elem, key, value ){
	elem[key] = value;
});
var setCookie = attr(document,'cookie');
setCookie('foo=bar;');

// Arrays
var each = curry(function( f, list ){
	for( var i=0; i < list.length; i++ )
		f( list[i], i );
});
var map = curry(function( f, list ){
	var copy = [];
	each(function(e, i){
		copy[i] = f(e);
	}, list );
	return copy;
});
var reduce = curry(function( f, accum, list ){
	each(function( e ){
		return accum = f( accum, e );
	}, list );
	return accum;
});

// f.e: incAll( [1,2,3] ) --> [2,3,4]
var incAll = map( inc );
var decAll = map( dec );
var doubleAll = map( prod(2) );
var alertList = each( alert );
var sumList = reduce( sum, 0 );
var concat = reduce( sum, '' );
var length = reduce( inc, 0 );