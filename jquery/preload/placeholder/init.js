/**
 * This plugin can be used in 4 ways, this is only 1. Make sure to check
 * the other 3 links as well to see all the Modes.
 */
jQuery(function( $ ){			
	$('#summary').fadeIn('slow');
	
	/**
	 * All the functions below, are used to update the summary div
	 * That is not the objective of the plugin, the really important part 
	 * is the one right below. The option placeholder, and threshold.
	 */
	$.preload( '#ph-images img', {//the first argument is a selector to the images
		onRequest:request,
		onComplete:complete,
		onFinish:finish,
		placeholder:'../img/placeholder.jpg',//this is the really important option
		notFound:'../img/notfound.jpg',//optional image if an image wasn't found
		threshold: 2 //'2' is the default, how many at a time, to load.
	});
	
	function update( data ){
		$('#done').html( ''+data.done );
		$('#total').html( ''+data.total );
		$('#loaded').html( ''+data.loaded );
		$('#failed').html( ''+data.failed );
	};
	function complete( data ){
		update( data );
		$('#image-next').html( 'none' );//reset the "loading: xxxx"
		$('#image-loaded').html( data.image );
	};
	function request( data ){
		update( data );
		$('#image-next').html( data.image );//set the "loading: xxxx"
	};
	function finish(){//hide the summary
		$('#summary').fadeOut('slow');
	};
});