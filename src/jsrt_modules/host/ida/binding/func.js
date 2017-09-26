'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

// Number get_total_function_count();
function get_total_function_count( )
{
	return process.reserved.hostDependBindings.ida_get_func_qty(  );
}
exports.get_total_function_count = get_total_function_count;


// Number64 get_function_by_index( Number Index );
function get_function_by_index( arg_index )
{
	assert( _.isNumber(arg_index) , "arg_index must  be Number" );
	
	var info = process.reserved.hostDependBindings.ida_get_function_by_index( arg_index );
	if ( !info )
	{
		return null;
	}
	
	return Number64( info );
}
exports.get_function_by_index = get_function_by_index;


// Number get_function_index_by_addres( Number64 startEA );
function get_function_index_by_addres( arg_startEA )
{
	return process.reserved.hostDependBindings.ida_get_func_num( Number64(arg_startEA) );
}
exports.get_function_index_by_addres = get_function_index_by_addres;


// Number64 get_prev_func( Number64 startEA );
function get_prev_func( arg_startEA )
{
	var info = process.reserved.hostDependBindings.ida_get_prev_func( Number64(arg_startEA)  );
	if ( !info )
	{
		return null;
	}
	
	return Number64( info );
}
exports.get_prev_func = get_prev_func;


// Number64 get_next_func( Number64 startEA );
function get_next_func( arg_startEA )
{
	var info = process.reserved.hostDependBindings.ida_get_next_func( Number64(arg_startEA) );
	if ( !info )
	{
		return null;
	}
	
	return Number64( info );
}
exports.get_next_func = get_next_func;


// string get_function_name( Number64 startEA);
function get_function_name( arg_startEA )
{
	return process.reserved.hostDependBindings.ida_get_func_name2( Number64(arg_startEA) );
}
exports.get_function_name = get_function_name;


// area_t get_func_limits( Number64 startEA );
function get_func_limits( arg_startEA )
{
	var info = process.reserved.hostDependBindings.ida_get_func_limits( Number64(arg_startEA) );
	if ( !info )
	{
		return;
	}
	
	info.startEA = Number64( info.startEA );
	info.endEA = Number64( info.endEA );
	
	return info;
}
exports.get_func_limits = get_func_limits;


// boolean set_function_startEA( Number64 startEA , Number64 newStartEA );
function set_function_startEA( arg_startEA , arg_NewStartEA )
{
	return process.reserved.hostDependBindings.ida_func_setstart( Number64(arg_startEA) , Number64( arg_NewStartEA) );
}
exports.set_function_startEA = set_function_startEA;


// boolean set_function_endEA( Number64 startEA , Number64 endEA );
function set_function_endEA( arg_startEA , arg_endEA )
{
	return process.reserved.hostDependBindings.ida_func_setend( Number64(arg_startEA) , Number64( arg_endEA) );
}
exports.set_function_endEA = set_function_endEA;


// string get_function_comment( Number64 startEA , boolean Repeateable );
function get_function_comment( arg_startEA , arg_repeateable )
{
	return process.reserved.hostDependBindings.ida_get_func_cmt( Number64(arg_startEA) , arg_repeateable );
}
exports.get_function_comment = get_function_comment;



// boolean set_function_comment( Number64 startEA , string comment , boolean Repeateable);
function set_function_comment( arg_startEA , arg_comment , arg_repeateable )
{
	assert( _.isString(arg_comment) , "arg_comment must  be string" );
	
	return process.reserved.hostDependBindings.ida_set_func_cmt( Number64(arg_startEA) , arg_comment ,  arg_repeateable  );
}
exports.set_function_comment = set_function_comment;


// boolean del_function_comment( Number64 startEA , boolean Repeateable  );
function del_function_comment( arg_startEA , arg_repeateable  )
{
	return process.reserved.hostDependBindings.ida_del_func_cmt( Number64(arg_startEA) , arg_repeateable );
}
exports.del_function_comment = del_function_comment;



// boolean add_function( Number64 startEA , Number64 endEA );
function add_function( arg_startEA , arg_endEA )
{
	return process.reserved.hostDependBindings.ida_add_func( Number64(arg_startEA) , Number64(arg_endEA) );
}
exports.add_function = add_function;


// boolean del_function( Number64 startEA );
function del_function( arg_startEA )
{
	return process.reserved.hostDependBindings.ida_del_func( Number64(arg_startEA)  );
}
exports.del_function = del_function;


// Number get_function_bitness( Number64 startEA );
function get_function_bitness( arg_startEA )
{
	return process.reserved.hostDependBindings.ida_get_func_bitness( Number64(arg_startEA) );
}
exports.get_function_bitness = get_function_bitness;


// Number get_function_bytes( Number64 startEA  );
// it seem's not endEA - startEA
function get_function_bytes( arg_startEA )
{
	return process.reserved.hostDependBindings.ida_get_func_bytes( Number64(arg_startEA) );
}
exports.get_function_bytes = get_function_bytes;

// Number address_to_function_name_and_text_offset( Number64 address  );
function address_to_function_name_and_text_offset( arg_address )
{
	return process.reserved.hostDependBindings.ida_a2funcoff( Number64(arg_address)  );
}
exports.address_to_function_name_and_text_offset = address_to_function_name_and_text_offset;





function main(  )
{
	

	
	
	return 0;
}

if ( !module.parent )
{
	main();
}