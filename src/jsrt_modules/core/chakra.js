'use strict';

const _ = require("underscore");
const assert = require("assert");
const sprintf = require("cprintf").sprintf;


function chakra_memoryUsage(  )
{
	return Number64( process.reserved.bindings.chakra_memoryUsage() );
}
exports.memoryUsage = chakra_memoryUsage;

function chakra_gc(  )
{
	return process.reserved.bindings.chakra_gc();
}
exports.gc = chakra_gc;


function main(  )
{
	return 0;
}

if ( !module.parent )
{
	main();
}


