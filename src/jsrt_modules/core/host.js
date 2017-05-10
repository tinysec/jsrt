'use strict';

const assert = require("assert");
const _ = require("underscore");




// host-depends read write
function readInt8( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readInt8( address , offset );
}
exports.readInt8 = readInt8;


function readUInt8( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readUInt8( address , offset );
}
exports.readUInt8 = readUInt8;


function readInt16LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readInt16LE( address , offset );
}
exports.readInt16LE = readInt16LE;

function readInt16BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readInt16BE( address , offset );
}
exports.readInt16BE = readInt16BE;

function readUInt16LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readUInt16LE( address , offset );
}
exports.readUInt16LE = readUInt16LE;

function readUInt16BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readUInt16BE( address , offset );
}
exports.readUInt16BE = readUInt16BE;


function readInt32LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readInt32LE( address , offset );
}
exports.readInt32LE = readInt32LE;

function readInt32BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readInt32BE( address , offset );
}
exports.readInt32BE = readInt32BE;

function readUInt32LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readUInt32LE( address , offset );
}
exports.readUInt32LE = readUInt32LE;

function readUInt32BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readUInt32BE( address , offset );
}
exports.readUInt32BE = readUInt32BE;


function readInt64LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return Number64( process.reserved.bindings.host_readInt64LE( address , offset ) );
}
exports.readInt64LE = readInt64LE;

function readInt64BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return Number64( process.reserved.bindings.host_readInt64BE( address , offset ) );
}
exports.readInt64BE = readInt64BE;

function readUInt64LE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return Number64( process.reserved.bindings.host_readUInt64LE( address , offset ) );
}
exports.readUInt64LE = readUInt64LE;

function readUInt64BE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return Number64( process.reserved.bindings.host_readUInt64BE( address , offset ) );
}
exports.readUInt64BE = readUInt64BE;

function readFloatLE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readFloatLE( address , offset );
}
exports.readFloatLE = readFloatLE;

function readFloatBE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readFloatBE( address , offset );
}
exports.readFloatBE = readFloatBE;

function readDoubleLE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readDoubleLE( address , offset );
}
exports.readDoubleLE = readDoubleLE;

function readDoubleBE( arg_address , arg_offset )
{
	assert( ( arguments.length >= 1 ) , "invalid arguments" );
	
	var address = Number64( arg_address );
	var offset = Number64( arg_offset );
	
	return process.reserved.bindings.host_readDoubleBE( address , offset );
}
exports.readDoubleBE = readDoubleBE;

// write
function writeInt8( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = arguments[1];
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = arguments[2];
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
		
	return process.reserved.bindings.host_writeInt8( address , offset , value );
}
exports.writeInt8 = writeInt8;


function writeUInt8( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeUInt8( address , offset , value );
}
exports.writeUInt8 = writeUInt8;


function writeInt16LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeInt16LE( address , offset , value );
}
exports.writeInt16LE = writeInt16LE;

function writeInt16BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeInt16BE( address , offset , value );
}
exports.writeInt16BE = writeInt16BE;

function writeUInt16LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
		
	return process.reserved.bindings.host_writeUInt16LE( address , offset , value );
}
exports.writeUInt16LE = writeUInt16LE;

function writeUInt16BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeUInt16BE( address , offset , value );
}
exports.writeUInt16BE = writeUInt16BE;


function writeInt32LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeInt32LE( address , offset , value );
}
exports.writeInt32LE = writeInt32LE;

function writeInt32BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeInt32BE( address , offset , value );
}
exports.writeInt32BE = writeInt32BE;

function writeUInt32LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeUInt32LE( address , offset , value );
}
exports.writeUInt32LE = writeUInt32LE;

function writeUInt32BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeUInt32BE( address , offset , value );
}
exports.writeUInt32BE = writeUInt16BE;


function writeInt64LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = LONG64( arguments[1] );
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = LONG64( arguments[2] );
	}
		
	return process.reserved.bindings.host_writeInt64LE( address , offset , value );
}
exports.writeInt64LE = writeInt64LE;

function writeInt64BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = LONG64( arguments[1] );
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = LONG64( arguments[2] );
	}
		
	return process.reserved.bindings.host_writeInt64BE( address , offset , value );
}
exports.writeInt64BE = writeInt64BE;

function writeUInt64LE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = Number64( arguments[1] );
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = Number64( arguments[2] );
	}
		
	return process.reserved.bindings.host_writeUInt64LE( address , offset , value );
}
exports.writeUInt64LE = writeUInt64LE;

function writeUInt64BE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = Number64( arguments[1] );
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = Number64( arguments[2] );
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeUInt64BE( address , offset , value );
}
exports.writeUInt64BE = writeUInt64BE;


function writeFloatLE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value = arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value = arguments[2] ;
	}
		
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
	
	return process.reserved.bindings.host_writeFloatLE( address , offset , value );
}
exports.writeFloatLE = writeFloatLE;

function writeFloatBE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
		
	return process.reserved.bindings.host_writeFloatBE( address , offset , value );
}
exports.writeFloatBE = writeFloatBE;


function writeDoubleLE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
		
	return process.reserved.bindings.host_writeDoubleLE( address , offset , value );
}
exports.writeDoubleLE = writeDoubleLE;

function writeDoubleBE( arg_address , arg_offset  , arg_value )
{
	assert( ( arguments.length >= 2 ) , "invalid arguments" )
	
	var address = 0;
	var offset = 0;
	var value = 0;
	
	if ( 2 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = 0;
		value =  arguments[1] ;
	}
	else if ( 3 == arguments.length )
	{
		address = Number64( arguments[0] );
		offset = Number64( arguments[1] );
		value =  arguments[2] ;
	}
	
	assert(  ( _.isNumber( value ) ) , "invalid value type" );
		
	return process.reserved.bindings.host_writeDoubleBE( address , offset , value );
}
exports.writeDoubleBE = writeDoubleBE;



function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}