'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;



// int analyze_area( Number64 startEA , Number64 endEA );
function analyze_area( arg_startEA , arg_endEA )
{
	return process.reserved.hostDependBindings.ida_analyze_area( Number64(arg_startEA) , Number64( arg_endEA )  );
}
exports.analyze_area = analyze_area;




function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}