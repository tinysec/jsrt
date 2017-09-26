'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;






// Number get_basic_blocks( Number64 startEA , Number64 endEA );
function get_basic_blocks( arg_startEA , arg_endEA )
{
	var bbArray =  process.reserved.hostDependBindings.ida_get_basic_blocks( Number64(arg_startEA) , Number64(arg_endEA) );
	if ( !bbArray )
	{
		return;
	}
	
	return _.map( bbArray , function(oldItem)
	{
		var newItem = {};
		
		newItem.id = oldItem.id;
		
		newItem.startEA = Number64( oldItem.startEA );
		newItem.endEA = Number64( oldItem.endEA );
		
		return newItem;
	});
}
exports.get_basic_blocks = get_basic_blocks;


function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}