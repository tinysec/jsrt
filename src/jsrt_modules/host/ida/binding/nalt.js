'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


// String get_input_file_path( );
function get_input_file_path( )
{
	return process.reserved.hostDependBindings.ida_get_input_file_path( );
}
exports.get_input_file_path = get_input_file_path;

// Number64 get_imagebase( );
function get_imagebase( )
{
	return process.reserved.hostDependBindings.ida_get_imagebase( );
}
exports.get_imagebase = get_imagebase;

// void set_imagebase( Number64 address );
function set_imagebase( arg_address )
{
	return process.reserved.hostDependBindings.ida_set_imagebase( Number64( arg_address ) );
}
exports.set_imagebase = set_imagebase;


// Number get_import_module_qty( );
function get_import_module_qty( )
{
	return process.reserved.hostDependBindings.ida_get_import_module_qty( );
}
exports.get_import_module_qty = get_import_module_qty;


// String get_import_module_name( Number index );
function get_import_module_name( arg_index )
{
	return process.reserved.hostDependBindings.ida_get_import_module_name( arg_index );
}
exports.get_import_module_name = get_import_module_name;


// String enum_import_names( Number index );
function enum_import_names( arg_index )
{
	var info = process.reserved.hostDependBindings.ida_enum_import_names( arg_index );
	if ( !info )
	{
		return;
	}
	
	return _.map( info , function( oldItem )
	{
		var newItem = oldItem;
		
		newItem.address = Number64( oldItem.address );
		
		return newItem;
	});
}
exports.enum_import_names = enum_import_names;





// void set_item_color( Number64 address ,  Number Color );
function set_item_color( arg_address , arg_color )
{
	assert(  _.isNumber(arg_color)  , " arg_color  must be number" );
	
	return process.reserved.hostDependBindings.ida_set_item_color( Number64( arg_address ) , arg_color );
}
exports.set_item_color = set_item_color;


// Number get_item_color( Number64 address );
function get_item_color( arg_address )
{
	return process.reserved.hostDependBindings.ida_get_item_color( Number64( arg_address ) );
}
exports.get_item_color = get_item_color;


// Boolean del_item_color( Number64 address );
function del_item_color( arg_address )
{
	return process.reserved.hostDependBindings.ida_del_item_color( Number64( arg_address ) );
}
exports.del_item_color = del_item_color;






function main(  )
{
	printf( enum_import_names(0 ) );
	
	return 0;
}

if ( !module.parent )
{
	main();
}