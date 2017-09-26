'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;




// string generate_disasm_line( Number64 address , Number flags );
function generate_disasm_line( arg_address , arg_flags )
{
	return process.reserved.hostDependBindings.ida_generate_disasm_line( Number64(arg_address) , Number(arg_flags)  );
}
exports.generate_disasm_line = generate_disasm_line;




function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}