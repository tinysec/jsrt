'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;



// Number64   choose_entry( string title );
function choose_entry( arg_title )
{
	if ( arg_title )
	{
		assert( _.isString( arg_title ) , " arg_title must be string " );
	}
	
	return Number64(  process.reserved.hostDependBindings.ida_choose_entry( arg_title || "choose a entry" ) );
}
exports.choose_entry = choose_entry;


// select a name , return it's ea
// Number64 choose_name( string title  );
function choose_name( arg_title )
{
	if ( arg_title )
	{
		assert( _.isString( arg_title ) , " arg_title must be string " );
	}
	
	return Number64(  process.reserved.hostDependBindings.ida_choose_name( arg_title || "choose a name"  ) );
}
exports.choose_name = choose_name;


// Number64 choose_func( Number64 destEA );
function choose_xref( arg_ea_to )
{
	return Number64(  process.reserved.hostDependBindings.ida_choose_xref( Number64(arg_ea_to) ) );
}
exports.choose_xref = choose_xref;


// Number64 choose_func( string title );
function choose_func( arg_title )
{
	if ( arg_title )
	{
		assert( _.isString( arg_title ) , " arg_title must be string " );
	}
	
	return Number64(  process.reserved.hostDependBindings.ida_choose_func( arg_title ||  "choose a function" ) );
}
exports.choose_func = choose_func;


// void choose( chooser_t chooser );
function choose( arg_chooser )
{
	assert(  arg_chooser  , " arg_chooser  must not null" );
	
	return process.reserved.hostDependBindings.ida_choose3( arg_chooser );
}
exports.choose = choose;

// Boolean close_chooser( string title );
function close_chooser(  arg_title )
{
	return process.reserved.hostDependBindings.ida_close_chooser( arg_title );
}
exports.close_chooser = close_chooser;



// Boolean jumpto( Number64 address );
function jumpto( arg_address )
{
	return process.reserved.hostDependBindings.ida_jumpto( Number64(arg_address) );
}
exports.jumpto = jumpto;


// Boolean banner( Number time );
function banner( arg_time )
{
	assert( _.isNumber( arg_time ) , " arg_time must be Number " );
	
	return process.reserved.hostDependBindings.ida_banner( arg_time );
}
exports.banner = banner;


// Number64 get_screen_ea( );
function get_screen_ea(  )
{
	return Number64( process.reserved.hostDependBindings.ida_get_screen_ea(  ) );
}
exports.get_screen_ea = get_screen_ea;


// void open_url( string url );
function open_url(  arg_url )
{
	return process.reserved.hostDependBindings.ida_open_url( arg_url );
}
exports.open_url = open_url;



function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}


function test_choose()
{
	var chooser_info = {
			"title" : "test chooser title" ,
			
			"columns" : [] ,
			
			"items" : []
	};
	
	
	var column_node = null ;
	
	var item_node = null ;
	
	var itemIndex = 0;
	
	
	// column1
	column_node = {};
		
	column_node.name = "column_name_1";
	column_node.width = 10;
	
	chooser_info.columns.push( column_node );
	
	// column2
	column_node = {};
		
	column_node.name = "column_name_2";
	column_node.width = 30;
	
	chooser_info.columns.push( column_node );
	
	// elements1
	for ( itemIndex = 0; itemIndex < 100; itemIndex++ )
	{
		item_node = {};
	
		item_node.values = [];
		
		item_node.icon = itemIndex;
		
		if ( 1 == itemIndex )
		{
			item_node.bold = true;
			
			// italic , underline , strike , gray
		}
		else if ( 2 == itemIndex )
		{
			item_node.color = base.RGB( 255 , 123 , 12);
		}
		
		
		item_node.values[ 0 ] = sprintf("item_%02d_col_00" , itemIndex );
		
		item_node.values[ 1 ] = sprintf("item_%02d_col_01" , itemIndex );
		
		chooser_info.items.push( item_node );
	}
	
	function onDestroy( arg_chooser )
	{
		printf("onDestroy\n");
	}

	function onItemDelete( arg_chooser , itemIndex )
	{
		arg_chooser.items.splice( itemIndex , 1 );
		
		printf("onItemDelete %d \n" , itemIndex);

		
	}

	function onItemSelected( arg_chooser , itemIndex )
	{

		printf("onItemSelected %d \n" , itemIndex);

		
	}

	
	chooser_info.onDestroy = onDestroy;
	
	chooser_info.onItemDelete = onItemDelete;
	
	chooser_info.onItemSelected = onItemSelected;
	
	
	chooser_info.defaultIcon = 4;
	
	chooser_info.defaultItem = -1;
	
	chooser_info.modal = true;
	
	choose( chooser_info );
}
