jQuery(function( $ ){
	$('#queries li').click(function(){
		execute( $(this).text() );
	});
	$('input:button').click(function(){
		execute( $(this).prev().children().val() );
	});
	
	/* these 2 functions are just to show what's happening, no real life use for them */
	function update( t, txt ){
		$(t).html( txt.replace(/;\s*(?=[\w-])/g,';\n\t').replace(/\n/g,'<br />').replace(/\t/g,'&nbsp;&nbsp;&nbsp;') );
	};
	function execute( code ){
		if( !code ) return;
		try{
			eval(code);
			setTimeout(function(){
				update('#link_text strong', $('link:eq(1)').cssText() );
				update('#style_text strong', $('style:eq(1)').cssText() );
			},0);
		}catch(e){
			alert(e.message||e);
		}
	};
	setTimeout(function(){
		execute('window');
	},500);
});