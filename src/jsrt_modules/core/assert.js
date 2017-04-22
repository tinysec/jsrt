'use strict';

module.exports = function assert( pattern , message ) 
{
	if ( pattern )
	{
		return;
	}

    throw new Error( message || "assert fail");
}
	

function main(  )
{

	
	return 0;
}

if ( !module.parent )
{
	main();
}