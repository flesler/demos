/**
 * Default arguments for functions.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 1/9/2008
 * @version 1.0.0
 * @author Ariel Flesler
 */
Function.prototype.defaults = function(){
	var fn = this,
		args = arguments;
	return function(){
		for( var i = arguments.length; i < args.length; i++ )
			arguments[i] = args[i];
		arguments.length = i;
		return fn.apply( this, arguments );
	};
};