'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;



// Number64 find_data( Number64 startEA , Number flags  );
function find_data( arg_startEA , arg_flags )
{
	return Number64( process.reserved.hostDependBindings.ida_find_data( Number64( arg_startEA ) , arg_flags ) );
}
exports.find_data = find_data;



// Number64 find_code( Number64 startEA , Number flags  );
function find_code( arg_startEA , arg_flags )
{
	return Number64( process.reserved.hostDependBindings.ida_find_code( Number64( arg_startEA ) , arg_flags ) );
}
exports.find_code = find_code;


// Number64 find_imm( Number64 startEA , Number64 value  );
function find_imm( arg_startEA , arg_value )
{
	return Number64( process.reserved.hostDependBindings.ida_find_imm( Number64( arg_startEA ) , Number64( arg_value ) ) );
}
exports.find_imm = find_imm;


// Number64 find_text( Number64 startEA , String pattern , Number flags  );
function find_text( arg_startEA , arg_pattern ,  arg_flags )
{
	return Number64( process.reserved.hostDependBindings.ida_find_text( Number64( arg_startEA ) , arg_pattern , arg_flags ) );
}
exports.find_text = find_text;



function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}