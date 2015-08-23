/**
 * This plugin can be used in 4 ways, this is only 1. Make sure to check
 * the other 3 links as well to see all the Modes.
 */
jQuery(function( $ ){	
	var urls = [ '1201297655', '1199062170', '1198009718', '1197069345', '1169525567',
				 '1172516542', '1185394304', '1185917526', '1186001076', '1187836588' ];
	$.preload( urls, {
		base:'http://spb.fotologs.net/photo/43/14/58/animal_world/',
		ext:'_f.jpg',
		onComplete:function( data ){
			var img = new Image();
			img.src = data.image;
			$('#url-images').append(img);
		},
		onFinish:function(){
			$('#url-images p').fadeOut(2000);
		}
	});
});