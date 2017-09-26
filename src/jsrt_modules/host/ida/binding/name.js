'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;



// boolean set_name( Number64 address  , string name ,  Number flags  );
function set_name( arg_address , arg_name , arg_flags )
{
	return process.reserved.hostDependBindings.ida_set_name( Number64(arg_address) , arg_name ,  arg_flags );
}
exports.set_name = set_name;


// boolean get_name_ea( string name , Number64 arg_fromEA = BADADDR  );
function get_name_ea( arg_name , arg_fromEA )
{
	return Number64( process.reserved.hostDependBindings.ida_get_name_ea( arg_name , Number64(arg_fromEA) ) );
}
exports.get_name_ea = get_name_ea;


// string get_ea_name( Number64 address , Number flags  );
function get_ea_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_ea_name( Number64(arg_address) , arg_flags );
}
exports.get_ea_name = get_ea_name;

// string get_true_name( Number64 address , Number flags  );
function get_true_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_true_name( Number64(arg_address) , arg_flags );
}
exports.get_true_name = get_true_name;

// string get_visible_name( Number64 address , Number flags  );
function get_visible_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_visible_name( Number64(arg_address) , arg_flags );
}
exports.get_visible_name = get_visible_name;

// string get_short_name( Number64 address , Number flags  );
function get_short_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_short_name( Number64(arg_address) , arg_flags );
}
exports.get_short_name = get_short_name;

// string get_long_name( Number64 address , Number flags  );
function get_long_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_long_name( Number64(arg_address) , arg_flags );
}
exports.get_long_name = get_long_name;

// string get_demangled_name( Number64 address , Number flags  );
function get_demangled_name( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_get_demangled_name( Number64(arg_address) , arg_flags );
}
exports.get_demangled_name = get_demangled_name;



function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}