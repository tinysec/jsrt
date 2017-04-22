'use strict';


	
	// print as dml
function dprintf()
{
	var text = sprintf.apply(this, arguments);
	if ( 0 == text.length )
	{	
		return;
	}
	
	return process.reserved.hostDependBindings.windbg_dml( text );
}
exports.dprintf = dprintf;


   

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}