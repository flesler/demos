/**
 * Parser - Generic and Extensible Code Parser.
 * Copyright (c) 2008 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Licensed under BSD (http://www.opensource.org/licenses/bsd-license.php)
 * Date: 3/25/2008
 * @version 1.0.0
 * @author Ariel Flesler
 */
  
function Parser( str ){
	this.setCode(str);
	this.handlers = {};
	this.listeners = {};
};

(function( Parser ){
	
	Parser.globalState = 'code';
	
	Parser.prototype = {
		// Sets a string to the parser and resets it.
		setCode:function( str ){
			this.code = str || '';
			this.endPos = this.code.length;//index of the end-of-string
			this.parsed = '';//stores the flushed data
			this.states = [ ];//stack of state names
			this.buffers = [ ];//stack of buffered data for state changes
			this.state = '';//name of the actual state
			this.setGlobalState();
			this.pos = 0;//present index
			return this.set(0);
		},
		// Sets the actual index, can backtrack but only from the buffer.
		set:function( pos ){
			//pos = Math.min( pos, this.endPos );//no need
			if( pos < 0 ) pos = 0;//shouldn't happen, but well..
			if( pos >= this.pos ){//go forward
				this.last = this.code.slice( this.pos, pos );
				this.buffer += this.last;
			}else{//backtrack
				this.last = this.code.slice( pos, this.pos );
				this.buffer = this.buffer.slice( 0, this.pos - pos );
			}
			this.token = this.code.charAt(pos);//actual character
			this.pos = pos;
			this.rest = this.code.slice(pos+1);//the remaining code after the token
			this.ended = pos > this.endPos - 1;//save some repetitive calculations, we are done, or not?
			return this;
		},
		// Moves x characters from the actual position.
		move:function( amount ){
			return this.set( this.pos + amount );
		},
		// Shortcut, move on to the next character
		step:function(){
			return this.move(1);
		},
		// Jump to the closest found token, accepts infinite amount of string,regexes, or true for end-of-string. 
		// Returns true or false (found or not)
		seek:function(){
			if( !this.ended ){
				var index, min,	i=arguments.length, chr;
				while( i-- ){
					chr = arguments[i];
					index = chr === true ? this.endPos : this.rest[chr.test?'search':'indexOf'](chr);
					if( index != -1 && ( isNaN(min) || index < min ) )
						min = index;
				}
				if( !isNaN(min) ){
					this.move( min+1 );
					return true;
				}
			}
			return false;
		},
		// Retrieve the former buffered data, and merge with the actual buffer
		flushState:function(){
			if( this.buffers.length )//unstack a buffer
				this.buffer = this.buffers.pop() + this.buffer;
			return this;
		},
		// Merge all the buffers and store, can't backtrack to it
		flush:function(){
			while( this.buffers.length )//try to unstack buffers
				this.flushState();
			this.parsed += this.buffer;//store the buffered data
			this.buffer = '';
			return this;
		},
		// Push a new state into the chain
		setState:function( name ){
			if( this.state ){
				this.states.push(this.state);
				this.buffers.push(this.buffer);
				this.prevState = this.state;
			}
			this.state = name;
			this.buffer = '';
			return this;
		},
		// Self-explanative
		setGlobalState:function(){
			return this.setState( Parser.globalState );
		},
		// See if there's a listener to the actual state, and let it parse the buffer
		notify:function(){
			if( this.listeners[this.state] ){//if someone registered to this state
				var ret = this.listeners[this.state]( this.buffer );
				if( ret !== undefined )
					this.buffer = ret;
			}
			return this;
		},
		// Unstack a state and flush the buffer.
		endState:function( notify ){
			if( notify !== false )//generally, notify the listener
				this.notify();
			this.prevState = this.state;
			this.state = this.states.pop();
			return this.buffers.length ? this.flushState() : this.flush();
		},
		// Register a state parser, needs a name(id), array or comma-separated strings of starting chars/string.
		// They are indexed by the first character, so it's preferable to use 1 char starts.
		registerState:function( name, start, fn ){
			if( start.split ) start = start.split(/\s*,\s*/);
			var l = start.length, key;
			while( l-- ){
				key = start[l].charAt(0);
				if( !this.handlers[key] )
					this.handlers[key] = [ ];
				this.handlers[key].push({
					rest:start[l].slice(1),
					name:name,
					fn:fn
				});
			}
			return this;
		},
		// Set a listener for a specific state, can get an array or comma separated names of states.
		// For now, only one listener is allowed per-state.
		subscribe:function( state, handler ){
			if( state.split ) state = state.split(/\s*,\s*/);
			while( state.length )
				this.listeners[state.pop()] = handler;
			return this;
		},
		// Check the actual token, and try to parse, will advance if so, else just stays there, returns true/false (parsed or not)
		parseOne:function(){
			var handlers, handler, i = 0, done = false;
			if( !this.ended && (handlers = this.handlers[this.token]) ){
				while( !done && (handler = handlers[i++]) ){
					if( this.rest.indexOf(handler.rest) ) continue;//if the match had a rest, and doesn't match
					if( this.isGlobal() )//if we are global, let it flush and don't stack global state
						this.endState();
					this.setState( handler.name );
					done = handler.fn.call( this ) !== false;//if it returns false, means it can't handle
					this.endState( done );
					if( !this.state )//ensure a state
						this.setGlobalState();
				}
			}
			return done;
		},
		// Parses the string up to the end, and calls end, so it surely flushes the parsed code.
		parse:function(){
			while( this.pos < this.endPos ){
				if( !this.parseOne() )//no natural stepping
					this.step(); //skip this char and go to the next
			}
			return this.end();//we should be in the end now
		},
		// Signal the end and store the content
		end:function(){
			this.ended = true;
			return this.flush();
		},
		// Throw a descriptive error, showing index, token and actual state, can receive an extra message.
		error:function( msg ){
			var err = 'ERROR index:'+this.pos+', char:"'+this.token+'" state:"'+this.state+'"';
			if( msg )
				err += ', msg:"'+msg+'"';
			throw err;
		},
		// Are we at the top of the states stack ? 
		isTop:function(){
			return !this.states.length;
		},
		// Are we at the top, and with the default state ?
		isGlobal:function(){
			return this.state == Parser.globalState && this.isTop();
		},
		// Checks if one of the given strings/regexes matches the token
		is:function(){
			return is( arguments, this.token );
		},
		// Same check, but for the part we just passed by (from previous token, to the char before the token)
		was:function(){
			return is( arguments, this.last );
		}
	};
	
	function is( args, token ){
		if( args[0] && args[0].splice )
			args = args[0];
		var i = args.length, arg;
		
		while( i-- ){
			arg = args[i];
			if( arg == token || arg.test && arg.test(token) )
				return true;
		}
		return false;
	};
	
})( Parser );