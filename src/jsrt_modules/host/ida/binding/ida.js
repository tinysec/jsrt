'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


function init_ida_info()
{
	var ida_info = process.reserved.hostDependBindings.ida_inf();
	
	ida_info.startIP = Number64( ida_info.startIP );
	
	ida_info.beginEA = Number64( ida_info.beginEA );
	
	ida_info.minEA = Number64( ida_info.minEA );
	
	ida_info.maxEA = Number64( ida_info.maxEA );

	
	return ida_info;
}
exports.inf = init_ida_info();






function main(  )
{
	
	printf( init_ida_info() );
	
	return 0;
}

if ( !module.parent )
{
	main();
}