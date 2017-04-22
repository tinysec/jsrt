'use strict';

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;
	
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