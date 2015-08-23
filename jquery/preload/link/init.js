/**
 * This plugin can be used in 4 ways, this is only 1. Make sure to check
 * the other 3 links as well to see all the Modes.
 */
jQuery(function( $ ){			
	var $links = $('#images a');
	var $preview = $('#preview');
	
	//this mode doesn't require any setting, can have though
	$links.preload({ threshold:2 }); //same as $.preload( $links, { threshold:2 } );
	
	$links.mouseover(function(){
		$preview.attr('src', this.href);
	});
});