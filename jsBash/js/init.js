var html = [];
jsBash.each( jsBash.commands, function( fn, name ){
	html.push(name);
});

html = '<li>' + html.sort().join('</li><li>') + '</li>'; 

var $uls = $('div.branch ul');

$uls
	.eq(1).slideUp().end()
	.eq(2).slideUp(function(){ this.innerHTML = html; html = null; });

$uls.prev('h2').click(function(){
	var $ul = $(this).next('ul');
	if( !$ul.is(':visible') ){
		$uls.filter(':visible').slideUp();
		$ul.slideDown();
	}
});

$('#scripts li').click(function(){
	$('#source').val( $.trim($(this).text()) );
});

var back = [ '' ], forward = [ ], eventCount = 0;
function execute( text ){
	var source = document.getElementById('source'),
		code = text || source.value,
		$p = $('<p class="code" />').text( code );
	
	if( !code ) return;			
	back.push( code );
	forward.length = 0;
	
	source.value = '';
	$('<li />').append( $p ).appendTo('#dump');
	var ret = jsBash.parse( code );
	jsBash.run( 'dump', [ret] );
	
	// Log to google analytics
	try{
		pageTracker.event( 'command-executed', code, ++eventCount );
	}catch(e){}
};

$('#source').keydown(function(e){
	switch( e.keyCode ){
		case 13:
			if( !e.shiftKey ){
				e.preventDefault();
				execute();
			}
		break;
		case 33:
			if( back.length ){
				forward.push( this.value );
				this.value = back.pop();
			}
		break;
		case 34:
			if( forward.length ){
				back.push( this.value );
				this.value = forward.pop()
			}
		break;
	}
});

jsDump.multiline = false;
jsBash.addCommand( 'dump', function( obj ){
	if( this.flags.c && window.console )
		console.log( obj );
	else
		$('<p class="dump" />').text( jsDump.parse(obj) ).appendTo('#dump li:last');
	return obj;
});
jsBash.addCommand( 'clear', function(){
	$('#dump').empty();
});