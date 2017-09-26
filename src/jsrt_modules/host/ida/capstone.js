const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;



const bytes_binding = require( "host/ida/binding/bytes" );

const ida_binding = require( "host/ida/binding/ida" );

var lib_capstone = require( "3rd/capstone" );



var g_hCapstone = null;

if ( ida_binding.inf.is_64bit )
{
	g_hCapstone = lib_capstone.open( "CS_ARCH_X86" , "CS_MODE_64" );
}
else
{
	g_hCapstone = lib_capstone.open( "CS_ARCH_X86" , "CS_MODE_32" );
}

lib_capstone.setOption( g_hCapstone , "CS_OPT_DETAIL" , "CS_OPT_ON" );


function disassemble( arg_address )
{
	var ioBuffer = null;
	var bFlag = false;
	
	var inst = null;
	
	do
	{
		ioBuffer = Buffer.alloc( 200 );
		if ( !ioBuffer )
		{
			break;
		}
		
		bFlag = bytes_binding.get_many_bytes( arg_address , ioBuffer );
		if ( !bFlag )
		{
			break;
		}
		
		
		inst = lib_capstone.disasm( g_hCapstone , ioBuffer , arg_address ,  1 );
		
		
	}while(false);
	
	if ( ioBuffer )
	{
		ioBuffer.free();
		ioBuffer = null;
	}
	
	return inst;
}
exports.disassemble = disassemble;


function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}