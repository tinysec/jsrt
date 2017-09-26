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
			vprintf("[ida.js] duplicate %s\n" , item_name );
		}
		else
		{
			bindings[ item_name ] = item_routine;
		}
	}
	
}

combine_bindings( require( "host/ida/binding/allins" ) );

combine_bindings( require( "host/ida/binding/auto" ) );

combine_bindings( require( "host/ida/binding/dbg" ) );


combine_bindings( require( "host/ida/binding/entry" ) );

combine_bindings( require( "host/ida/binding/enum" ) );

combine_bindings( require( "host/ida/binding/expr" ) );

combine_bindings( require( "host/ida/binding/fixup" ) );


combine_bindings( require( "host/ida/binding/frame" ) );

combine_bindings( require( "host/ida/binding/fuc" ) );

combine_bindings( require( "host/ida/binding/gdl" ) );

combine_bindings( require( "host/ida/binding/graph" ) );

combine_bindings( require( "host/ida/binding/hexrays" ) );

combine_bindings( require( "host/ida/binding/ida" ) );

combine_bindings( require( "host/ida/binding/idc" ) );

combine_bindings( require( "host/ida/binding/idp" ) );

combine_bindings( require( "host/ida/binding/kernelwin" ) );

combine_bindings( require( "host/ida/binding/lines" ) );

combine_bindings( require( "host/ida/binding/loader" ) );

combine_bindings( require( "host/ida/binding/moves" ) );

combine_bindings( require( "host/ida/binding/nalt" ) );

combine_bindings( require( "host/ida/binding/name" ) );

combine_bindings( require( "host/ida/binding/netnode" ) );

combine_bindings( require( "host/ida/binding/offset" ) );

combine_bindings( require( "host/ida/binding/search" ) );

combine_bindings( require( "host/ida/binding/segment" ) );

combine_bindings( require( "host/ida/binding/strlist" ) );

combine_bindings( require( "host/ida/binding/struct" ) );

combine_bindings( require( "host/ida/binding/typeinf" ) );

combine_bindings( require( "host/ida/binding/ua" ) );

combine_bindings( require( "host/ida/binding/xref" ) );

//////////////////////////////////////////////////////////////////////////

combine_bindings( require( "host/ida/capstone_disassemble" ) );

module.exports = bindings;

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}