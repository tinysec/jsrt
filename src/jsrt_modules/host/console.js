'use strict';

const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


// USHORT getTextAttribute( );
function getTextAttribute( )
{
	return process.reserved.hostDependBindings.console_get_text_attribute( );
}
exports.getTextAttribute = getTextAttribute;


// Boolean setTextAttribute( USHORT wAttributes );
function setTextAttribute( arg_attributes )
{
	return process.reserved.hostDependBindings.console_set_text_attribute( arg_attributes );
}
exports.setTextAttribute = setTextAttribute;


// String getTitle(  );
function getTitle( )
{
	return process.reserved.hostDependBindings.console_get_title( );
}
exports.getTitle = getTitle;


// Boolean setTitle( String title );
function setTitle( arg_title )
{
	return process.reserved.hostDependBindings.console_set_title( arg_title );
}
exports.setTitle = setTitle;


// Boolean showWindow( int cmdShow );
function showWindow( arg_cmdShow )
{
	return process.reserved.hostDependBindings.console_show_window( arg_cmdShow );
}
exports.showWindow = showWindow;




function color_printf( arg_color , ...arg_left )
{
	var argv = Array.prototype.slice.call( arguments );
	
	var oldAttribute = 0;
	
	argv.shift();

	oldAttribute = getTextAttribute();
	
	setTextAttribute( arg_color );
	
	printf.apply(this, argv );
	
	setTextAttribute( oldAttribute );
}
exports.color_printf = color_printf;



function main(  )
{
	
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}