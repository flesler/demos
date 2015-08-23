jQuery(function( $ ){
	//borrowed from jQuery easing plugin
	//http://gsgd.co.uk/sandbox/jquery.easing.php
	$.easing.backout = function(x, t, b, c, d){
		var s=1.70158;
		return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
	};
	
	$('#screen').scrollShow({
		view:'#view',
		content:'#images',
		easing:'backout',
		wrappers:'link,crop',
		navigators:'a[id]',
		navigationMode:'sr',
		circular:true,
		start:0
	});
});