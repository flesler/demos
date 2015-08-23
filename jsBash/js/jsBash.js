/**
 * jsBash - Bash-like synthax Interpreter for Javascript.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 3/25/2008
 * @version 1.0.0
 * @author Ariel Flesler
 */

parser.registerState( 'variable', '>, <', function(){
	this.seek(/\w/);
	this.seek(/\W/, true);
});
parser.registerState( 'lamba', '%', function(){
	while( 1 ){
		this.seek('%','\\'); //needs to be improved
		if( this.is('%') )
			break;
		else
			this.step();
	};
	this.step();
});
parser.registerState( 'flag', '-', function(){
	this.seek(/\W/, true);	
});
parser.registerState( 'keyword', 'window, document.body, document, true, false, null', function(){
	this.seek(/[^\w.]/, true);
});

var jsBash = {
	commands:{},
	env: null,
	parser:null,
	run:function( command, args, flags ){
		var ret, env = jsBash.env;
		
		//programatic (external) execution
		if( command ) 
			env.command = command;
		env.args = args || env.args || [ ];
		if( flags ) 
			env.flags = flags;
		
		ret = jsBash.commands[env.command] && jsBash.commands[env.command].apply(env,env.args);
			
		env.args = [ ];
		env.flags = {};
		return ret;
	},
	cleanEnv:function(){
		jsBash.env = { command:'', args:[], vars:{}, flags:{}, dump:'' };
	},
	each:function( obj, fn, scope ){
		if( 'length' in obj ){
			for( var i = 0; i < obj.length; i++ )
				fn.call( scope, obj[i], i );
		}else{
			for( var name in obj )
				fn.call( scope, obj[name], name );
		}
	},
	map:function( obj, fn, scope, ret ){
		var r;
		if( !ret )
			ret = 'length' in obj ? [ ] : { };
		jsBash.each( obj, function( v, k ){
			r = fn.call( scope, v, k );
			if( r !== undefined )
				ret[k] = r;
		});	
		return ret;
	},
	addCommand:function( names, fn ){
		if( names.split ) names = names.split(/\s*,\s*/);
		jsBash.each( names, function( name ){
			if( jsBash.commands[name] )
				throw 'command "'+name+'" already exists!';
			jsBash.commands[name] = fn;
		});
	},
	parse:function( code ){
		var parser = jsBash.parser.setCode( code ), r, env = jsBash.env;
		try{
			while( !parser.ended ){
				parser.seek(' ',';','|',true);
				env.command = parser.last;
				while( true ){
					if( parser.is('|',';','') || parser.step().is('|',';','') )
						break;
					parser.parseOne();
				}
				r = jsBash.run();
				if( parser.is('|') )//piping
					env.args.push(r);
				if( env.dump ){
					env.vars[env.dump] = r;
					env.dump = '';
				}
				if( parser.step().is(/\s/) )
					parser.seek(/\S/);
				parser.flush();
			}
		}finally{
			jsBash.cleanEnv();
		}
		return r;
	},
	lambda:function( fn, args ){
		args = args || ['a','b','c','d'];
		args[args.length++] = 'return ' + fn;
		return Function.apply( Function, args );
	}
};

jsBash.cleanEnv();

jsBash.parser = parser
				.subscribe( 'string', function( str ){
					if( parser.isTop() )
						jsBash.env.args.push(str.slice(1,-1));
				})
				.subscribe( 'regex, array, hash, eval' , function( str ){
					if( parser.isTop() )
						jsBash.env.args.push( eval('('+str+')') );
				})
				.subscribe( 'keyword' , function( str ){
					if( parser.isTop() )
						jsBash.env.args.push( window[str] || eval(str) );
				})
				.subscribe( 'lamba' , function( str ){
					str = jsBash.lambda(str.slice(1,-1));
					if( parser.isTop() )
						jsBash.env.args.push( str );
					else
						return ''+str;					
				})
				.subscribe( 'number', function( str ){
					if( parser.isTop() )
						jsBash.env.args.push(parseFloat(str,10));
				})
				.subscribe( 'flag', function( str ){
					jsBash.each( str.slice(1).split(''), function( c ){
						jsBash.env.flags[c] = true;
					});
				})
				.subscribe( 'variable', function( str ){
					var name = str.slice(1), env = jsBash.env;
					
					if( str.charAt(0) == '>' )
						env.dump = name;
					else
						env.args.push(env.vars[name]);
				});


/**
 * Misc commands
 */
jsBash.addCommand( 'typeof', function( obj ){
	var type = typeof obj;
	if( type == 'string' && jsBash.commands[obj] )
		type = 'command';
	return type;
});
/*jsBash.addCommand( 'dump', function( obj ){
	if( this.flags.c && window.console )
		console.log( obj );
	else
		alert( obj );
	return obj;
});*/

/**
 * Math/Bool commands
 */
jsBash.addCommand( 'add,+,*,/,-,%,|,&,^,==,>,>=,!=,<,<=', function( s ){
	var op = this.command == 'add' ? '+' : this.command,
		fn = jsBash.lambda('a'+op+'b');
		
	var i = 1;
	while( i in arguments )
		s = fn( s, arguments[i++] );
	return s;		
});
jsBash.addCommand('min,max,abs,sqrt,cos,sin,ceil,exp,floor,round,log,pow,random,tan',function(){
	return Math[this.command].apply(Math,arguments);	
});

/**
 * Array commands
 */
jsBash.addCommand('join,push,shift,unshift,pop,slice,splice,concat,sort,reverse',function(){
	var obj = [].shift.call(arguments), o;
	o = (obj[this.command]||([])[this.command]).apply(obj,arguments);
	return o === undefined || o == obj.length ? obj : o;
});

jsBash.addCommand( 'arr', function(){
	return [].slice.call(arguments);
});
jsBash.addCommand( 'len', function( o ){
	return o.length;
});
jsBash.addCommand( 'return, set', function(){
	return arguments.length == 1 ? arguments[0] : arguments;
});

/**
 * String commands
 */
jsBash.addCommand('split,toUpperCase,toLowerCase,charAt,indexOf,lastIndexOf,match,replace,search,substr,substring',function(){
	var obj = [].shift.call(arguments);
	return (obj[this.command]||('')[this.command]).apply(obj,arguments);
});

/**
 * jQuery commands
 */
jsBash.addCommand( '$', $ );

delete $.fn.length;
$.fns = jsBash.map( $.fn, function(v,k){
	if( typeof v == 'function' )
		return '$'+k;
});

jsBash.addCommand( $.fns, function(){
	var obj = [].shift.call(arguments);
	return $.fn[this.command.slice(1)].apply( obj, arguments );
});

jsBash.addCommand( 'post,get', function( url, data, cb ){
	var ret = '';
	$.ajax({
		type:this.command,
		url:url,
		data:data,
		async:!this.flags.s,
		success:function(r){ ret = r; }
	});
	if( cb )
		ret = cb(ret);
	return ret;
});

/**
 * Function commands
 */
jsBash.addCommand( 'execute, ()', function(){
	var fn = [].shift.call(arguments);
	if( typeof fn == 'string' )
		fn = jsBash.lambda(fn);
	return fn.apply( window, arguments );
});
jsBash.addCommand( 'map, each', function( obj, fn ){
	if( typeof fn == 'string' )
		fn = jsBash.lambda(fn);
	return jsBash[this.command]( obj, fn, window ) || obj;
});
jsBash.addCommand( 'lambda', function(){
	var fn = [].shift.call(arguments);
	if( typeof fn == 'string' )
		fn = jsBash.lambda( fn, arguments.length ? arguments : null );
	if( typeof fn != 'function' )
		return null;
	return fn;
});