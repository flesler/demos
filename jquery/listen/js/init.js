jQuery(function( $ ){
   /**
	* This is just for the demo, you don't need this.
	*/
	var htmls = [
		'<li class="hover click">Hover and click me</li>',
		'<li class="hover"><input type="text" value="Focus and blur me" /></li>',
		'<li class="click">Click me</li>',
		'<li class="hover">Hover me</li>'				
	];			
	
	/*listen globally using the static method (if not specified, the document is the listener) */		
	$.listen( 'click', '#additem', function(){
		var rand = Math.floor(Math.random()*4);
		$items.append( htmls[rand] );
	});
	//$.indexer('click').stop();//this would stop the global bindings for click
	
	/* use dom elements as listeners */
	var $items = $('#items')//listen for these 3 events, save it in a var because it is constantly reused
		.listen( 'click', 'li.click', function(e){//only the lis that have class click, are clickable
			$(this).toggleClass('clicked');
			e.stopPropagation();//no need to bother the document
		})
		//$items.indexer('click').stop();//this would stop all the click bindings for $items
		.listen( 'mouseover', 'li.hover', function(e){//only those li with class hover react to the mouse movement
			$(this).addClass('hovered');
		})
		.listen( 'mouseout', 'li.hover', function(e){
			$(this).removeClass('hovered');
		});
	
	/* the plugin can handle focus/blur using focusin/focusout.*/
	$items //mark the focused input inside $items
		.listen('focus','input',function(e){
			$(this).addClass('focused');
		})
		.listen('blur','input',function(e){
			$(this).removeClass('focused');
		})
});