'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


var bindings = {};

function combine_bindings( single )
{
	var item_name = null;
	var item_routine = null;
	
	for ( item_name in single )
	{
		item_routine = single[ item_name ];
		
		if ( _.has( bindings , item_name )
		{
			vprintf("[windbg.js] duplicate %s\n" , item_name );
		}
		else
		{
			bindings[ item_name ] = item_routine;
		}
	}
	
}

combine_bindings( require("host/windbg/binding/IDebugAdvanced" ) );

combine_bindings( require("host/windbg/binding/IDebugClient" ) );

combine_bindings( require("host/windbg/binding/IDebugControl" ) );

combine_bindings( require("host/windbg/binding/IDebugDataSpaces" ) );

combine_bindings( require("host/windbg/binding/IDebugSymbols") );

combine_bindings( require("host/windbg/binding/IDebugSystemObjects") );


module.exports = bindings;

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}