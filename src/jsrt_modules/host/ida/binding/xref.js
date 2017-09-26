'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


// Boolean add_cref( Number64 from , Number64 to , Number type );
function add_cref( arg_from , arg_to , arg_type )
{
	return process.reserved.hostDependBindings.ida_add_cref( Number64( arg_from ) , Number64( arg_to ) ,  arg_type );
}
exports.add_cref = add_cref;


// Boolean del_cref( Number64 from , Number64 to , Boolean expand );
function del_cref( arg_from , arg_to , arg_expand )
{
	return process.reserved.hostDependBindings.ida_del_cref( Number64( arg_from ) , Number64( arg_to ) ,  arg_expand );
}
exports.del_cref = del_cref;


// Boolean add_dref( Number64 from , Number64 to , Number type );
function add_dref( arg_from , arg_to , arg_type )
{
	return process.reserved.hostDependBindings.ida_add_dref( Number64( arg_from ) , Number64( arg_to ) ,  arg_type );
}
exports.add_dref = add_dref;


// Boolean del_dref( Number64 from , Number64 to  );
function del_dref( arg_from , arg_to  )
{
	return process.reserved.hostDependBindings.ida_del_dref( Number64( arg_from ) , Number64( arg_to )  );
}
exports.del_dref = del_dref;



// Number64 get_first_dref_from( Number64 from  );
function get_first_dref_from( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_dref_from( Number64( arg_from )  ) );
}
exports.get_first_dref_from = get_first_dref_from;


// Number64 get_next_dref_from( Number64 from , Number64 current  );
function get_next_dref_from( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_dref_from( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_dref_from = get_next_dref_from;


// Number64 get_first_dref_to( Number64 from  );
function get_first_dref_to( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_dref_to( Number64( arg_from )  ) );
}
exports.get_first_dref_to = get_first_dref_to;


// Number64 get_next_dref_to( Number64 from , Number64 current  );
function get_next_dref_to( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_dref_to( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_dref_to = get_next_dref_to;





// Number64 get_first_cref_from( Number64 from  );
function get_first_cref_from( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_cref_from( Number64( arg_from )  ) );
}
exports.get_first_cref_from = get_first_cref_from;


// Number64 get_next_cref_from( Number64 from , Number64 current  );
function get_next_cref_from( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_cref_from( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_cref_from = get_next_cref_from;


// Number64 get_first_cref_to( Number64 from  );
function get_first_cref_to( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_cref_to( Number64( arg_from )  ) );
}
exports.get_first_cref_to = get_first_cref_to;


// Number64 get_next_cref_to( Number64 from , Number64 current  );
function get_next_cref_to( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_cref_to( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_cref_to = get_next_cref_to;




// Number64 get_first_fcref_from( Number64 from  );
function get_first_fcref_from( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_fcref_from( Number64( arg_from )  ) );
}
exports.get_first_fcref_from = get_first_fcref_from;


// Number64 get_next_fcref_from( Number64 from , Number64 current  );
function get_next_fcref_from( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_fcref_from( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_fcref_from = get_next_fcref_from;


// Number64 get_first_fcref_to( Number64 from  );
function get_first_fcref_to( arg_from   )
{
	return Number64( process.reserved.hostDependBindings.ida_get_first_fcref_to( Number64( arg_from )  ) );
}
exports.get_first_fcref_to = get_first_fcref_to;


// Number64 get_next_fcref_to( Number64 from , Number64 current  );
function get_next_fcref_to( arg_from , arg_cur  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_next_fcref_to( Number64( arg_from ) , Number64( arg_cur )  ) );
}
exports.get_next_fcref_to = get_next_fcref_to;







function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}