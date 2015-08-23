// Pretty ugly, huh ?
if( !this.console ){
	var _event_count_ = 0;
	var _focus_ = function( input ){
		if( input.value == input.defaultValue )
			input.value = '';
	};
	var _run_ = function(){
		var out;
		
		try{
			out = eval(document.getElementById('_code_').value);
		}catch(e){
			out = e.message || e;
		}finally{
			try{
				pageTracker.event('command - console.lite', out, ++_event_count_ );
			}catch(e){}
		}
		jsDump.HTML = true;
		jsDump.multiline = false;
		document.getElementById('_output_').innerHTML = jsDump.parse(out);
	};
	document.write('<scr'+'ipt type="text/javascript" src="/jsDump/js/jsDump.js"></sc'+'ript>');
	document.write('<br /><p>Seems like you don\'t have a console, you can use this:</p>');
	document.write('<input type="text" id="_code_" value="Put some code here..." size="40" onfocus="_focus_(this)" />');
	document.write('<button onclick="_run_();return false;">Run</button>');
	document.write('<p id="_output_" style="height:20px;width:400px;border:1px black solid">The result will be shown in here...</p>');
}