'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


// boolean is_call_insn( Number64 address  );
function is_call_insn( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_call_insn( Number64(arg_address) );
}
exports.is_call_insn = is_call_insn;

// boolean is_ret_insn( Number64 address  );
function is_ret_insn( arg_address , arg_strict )
{
	return process.reserved.hostDependBindings.ida_is_ret_insn( Number64(arg_address) , arg_strict || true );
}
exports.is_ret_insn = is_ret_insn;

// boolean is_indirect_jump_insn( Number64 address  );
function is_indirect_jump_insn( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_indirect_jump_insn( Number64(arg_address) );
}
exports.is_indirect_jump_insn = is_indirect_jump_insn;

// boolean is_basic_block_end( Number64 address  );
function is_basic_block_end( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_basic_block_end( Number64(arg_address) );
}
exports.is_basic_block_end = is_basic_block_end;

// boolean is_align_insn( Number64 address  );
function is_align_insn( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_align_insn( Number64(arg_address) );
}
exports.is_align_insn = is_align_insn;


// String get_reg_name( Number reg , Number width  );
function get_reg_name( arg_reg , arg_width )
{
	return process.reserved.hostDependBindings.ida_get_reg_name( arg_reg , arg_width );
}
exports.get_reg_name = get_reg_name;




function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}