/**
 * This plugin can be used in 4 ways, this is only 1. Make sure to check
 * the other 3 links as well to see all the Modes.
 */
jQuery(function( $ ){			
	$.preload( '#rollover-images img', {
	    find:'.jpg',
	    replace:'_over.jpg'
	});
	/*		or
	$('#rollover-images img').preload({
		find:'.jpg',
	    replace:'_over.jpg'
	});
	*/
	//add animation
	$('#rollover-images img').hover(function(){
		this.src = this.src.replace('.jpg','_over.jpg');	
	},function(){
		this.src = this.src.replace('_over','');
	});
});