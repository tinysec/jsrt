'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


const idp_binding = require( "host/ida/binding/idp" );


const IDA_ARRAY_TABLE_OP_TYPES = [
	"void",
	
	"reg",
	
	"mem",
	
	"phrase",
	
	"disp",
	
	"imm",
	
	"far",
	
	"near",
	
	"idpspec0",
	
	"idpspec1",
	
	"idpspec2",
	
	"idpspec3",
	
	"idpspec4",
	
	"idpspec5"
];


const IDA_ARRAY_TABLE_DATA_TYPES = [
	"byte",
	
	"word",
	
	"dword",
	
	"float",
	
	"double",
	
	"tbyte",
	
	"real",
	
	"qword",
	
	"128bit",
	
	"code",
	
	"void",
	
	"fword",
	
	"bitfild",
	
	"string" ,
	
	"unicode" ,
	
	"3byte" ,
	
	"long_double" ,
	
	"256bit" ,
	
	"512bit"
];


// String decode_insn( Number64 address );
function decode_insn( arg_address )
{
	var info = process.reserved.hostDependBindings.ida_decode_insn( Number64(arg_address) );
	if ( !info )
	{
		return;
	}
	
	info.ea = Number64( info.ea );

	info.ip = Number64( info.ip );
		
	info.cs = Number64( info.cs );
	
	info.operands = _.map( info.operands , function(item)
	{
		item.op_type = IDA_ARRAY_TABLE_OP_TYPES[ item.op_type ];
		
		item.data_type = IDA_ARRAY_TABLE_DATA_TYPES[ item.data_type ];
		
		if ( 'reg' == item.op_type )
		{
			// idp_binding.get_reg_name( item.reg , 2 );
			// todo
			
		}
	
	
		item.value = Number64( item.value );
		
		item.address = Number64( item.address );
		
		return item;
	});
	
	
	return info;
}
exports.decode_insn = decode_insn;




function main(  )
{
	printf( decode_insn( "0x95E88249" ) );
	
	return 0;
}

if ( !module.parent )
{
	main();
}