jQuery(function( $ ){
	//borrowed from jQuery easing plugin
	//http://gsgd.co.uk/sandbox/jquery.easing.php
	$.easing.elasout = function(x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	};	
	$('button').click(function(){//this is not the cleanest way to do this, I'm just keeping it short.
		var index = parseInt( $(this).prev('input').val() ) || 0;
		var $c = $(this).parent().next();
		$c.stop().scrollTo('li:eq('+index+')', {duration:2500, easing:'elasout',axis:$c.attr('id')});
	});
	$('#btn_screen').click(function(){
		$.scrollTo( $('#txt_screen').val(), {duration:2500} );
	});
	$('div.container a').click(function(){
		var $c = $(this).parents('.container');
		$c.stop().scrollTo( 0, {duration:2000,axis:$c.attr('id'), queue:true} );
		return false;
	});
});