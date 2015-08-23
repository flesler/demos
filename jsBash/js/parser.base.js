/**
 * Parser - Generic and Extensible Code Parser.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 3/25/2008
 * @version 1.0.0
 * @author Ariel Flesler
 */

/**
 * This creates a parser, and adds many useful state parsers
 */

var parser = new Parser();
parser.registerState( 'string', '\',"', function(){
	var token = this.token;
	do{
		if( !this.seek('\\',token) )
			this.error('unclosed string');
		this.step();
	}while( !this.was(token) );
});
parser.registerState( 'one-line-comment', '//', function(){
	this.seek('\n', true);
});
parser.registerState( 'multi-line-comment', '/*', function(){
	if( !this.seek('*/') )
		this.error('unclosed multiline comment');
	this.move(2);
});
parser.registerState( 'regex', '/', function(){
	while( 1 ){
		if( !this.seek('\\','/') )
			this.error('unclosed regex');
		this.step();
		if( this.was('/') ){
			do this.step();
			while( this.is('g','m','i') );
			break;
		}
	}
});
parser.registerState( 'number', '-,1,2,3,4,5,6,7,8,9,0', function(){
	if( this.is('-') && this.step().is(/\D/) ){//NaN
		this.move(-1);//backtrack
		return false;
	}
	this.seek(/[^\d.e]/, true);
});
parser.registerState( 'subindex', '[', function(){
	if( /\W|^$/.test(this.last.slice(-1)) )//array
		return false;
	this.step();
	while( !this.is(']') ){
		this.parseOne() || this.step();
		if( this.ended )
			this.error('unclosed subindex');
	}
	this.step();
});
parser.registerState( 'array', '[', function(){
	if( /\w/.test(this.last.slice(-1)) )//subindex
		return false;
	this.step();
	while( !this.is(']') ){
		while( !this.is(',',']') && !this.parseOne() )
			this.step();
		if( this.ended )
			this.error('unclosed array');
		if( this.is(',') )
			this.step();
	}
	this.step();
});
parser.registerState( 'hash', '{', function(){
	do{
		if( this.step().is(/\s/) )
			this.seek(/\S/);
		this.setState('hash-attr').seek(':');
		this.endState().step();
		do{
			this.parseOne() || this.step();
			if( this.ended )
				this.error('malformed hash');
		}while( !this.is(',','}') );
	}while( !this.is('}') );
	this.step();
});
parser.registerState( 'eval', '(', function(){	
	this.step();
	while( !this.is(')') ){
		this.parseOne() || this.step();
		if( this.ended )
			this.error('unclosed eval');
	}
	this.step();
});
parser.registerState( 'keyword', 'window, document.body, document, true, false, null, undefined', function(){
	this.seek(/[^\w.]/, true);
});