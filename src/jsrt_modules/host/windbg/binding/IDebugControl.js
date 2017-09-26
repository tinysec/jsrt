'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

// print as dml
function dprintf()
{
	var text = sprintf.apply(this, arguments);
	if ( 0 == text.length )
	{	
		return;
	}
	
	return process.reserved.hostDependBindings.windbg_IDebugControl_dml( text );
}
exports.dprintf = dprintf;


function Execute()
{
	var text = sprintf.apply(this, arguments);
	if ( 0 == text.length )
	{	
		return;
	}
	
	return process.reserved.hostDependBindings.windbg_IDebugControl_Execute( text );
}
exports.Execute = Execute;

function IsPointer64Bit()
{
	return process.reserved.hostDependBindings.windbg_IDebugControl_IsPointer64Bit( );
}
exports.IsPointer64Bit = IsPointer64Bit;



function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}