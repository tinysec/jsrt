'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;
	
// print as dml

//------------------------------------------------------------------------------------------------------------
//IDebugControl
function dprintf()
{
	var text = sprintf.apply(this, arguments);
	if ( 0 == text.length )
	{	
		return;
	}
	
	return process.reserved.hostDependBindings.windbg_dml( text );
}
exports.dprintf = dprintf;


function execute()
{
	var text = sprintf.apply(this, arguments);
	if ( 0 == text.length )
	{	
		return;
	}
	
	return process.reserved.hostDependBindings.windbg_execute( text );
}
exports.execute = execute;

function isPointer64Bit()
{
	return process.reserved.hostDependBindings.windbg_isPointer64Bit( );
}
exports.isPointer64Bit = isPointer64Bit;

//------------------------------------------------------------------------------------------------------------
// IDebugSymbol
function getAddressInfo( arg_address )
{
	var info = process.reserved.hostDependBindings.windbg_getAddressInfo( Number64(arg_address) );
	if ( !info )
	{
		return;
	}
	
	info.offset = Number64( info.offset );
	
	return info;
}
exports.getAddressInfo = getAddressInfo;
   
function getAddressName( arg_address )
{
	var info = getAddressInfo(arg_address);
	if ( !info )
	{
		return;
	}
	
	if ( info.offset.isZero32() )
	{
		return info.name;
	}
	else
	{
		return sprintf('%s+0x%X' , info.name , info.offset );
	}
}
exports.getAddressName = getAddressName;


function getAddressByName( arg_name )
{
	assert( _.isString(arg_name) , "invalid arguments" );
	
	return Number64( process.reserved.hostDependBindings.windbg_getAddressByName( arg_name ) );
}
exports.getAddressByName = getAddressByName;


function getModuleBaseByName( arg_name )
{
	assert( _.isString(arg_name) , "invalid arguments" );
	
	return Number64( process.reserved.hostDependBindings.windbg_getModuleBaseByName( arg_name , 0 ) );
}
exports.getModuleBaseByName = getModuleBaseByName;


function getFieldOffset( arg_typename , arg_fieldname )
{
	assert( _.isString(arg_typename) , "invalid type name" );
	
	assert( _.isString(arg_fieldname) , "invalid field name" );
	
	var temp = arg_typename.split('!');
	
	assert( ( _.isArray(temp) && ( 2 == temp.length ) ) , "invalid typename" );
	
	var moduleName = temp[0];
	var typename = temp[1];
	
	var imageBase = getModuleBaseByName( moduleName );
	if ( !imageBase )
	{
		return -1;
	}
	
	
	
	return Number64( process.reserved.hostDependBindings.windbg_getFieldOffset( imageBase , typename , arg_fieldname ) );
}
exports.getFieldOffset = getFieldOffset;





//-------------------------------------------------------------------
// IDebugDataSpaces

function readMsr( arg_index )
{
	assert( _.isNumber(arg_index) , "invalid msr index" );
	
	return Number64( process.reserved.hostDependBindings.windbg_readMsr( arg_index ) );
}
exports.readMsr = readMsr;

function writeMsr( arg_index , arg_value )
{
	assert( _.isNumber(arg_index) , "invalid msr index" );
	
	return process.reserved.hostDependBindings.jsbinding_windbg_writeMsr( arg_index , Number64(arg_value) );
}
exports.writeMsr = writeMsr;


function readPhysical( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_readPhysical( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.readPhysical = readPhysical;


function readVirtual( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_readVirtual( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.readVirtual = readVirtual;

function readVirtualUncached( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_readVirtualUncached( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.readVirtualUncached = readVirtualUncached;


function writePhysical( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_writePhysical( Number64(arg_address) , arg_buffer , arg_writeBytes || arg_buffer.length ) ;
}
exports.writePhysical = writePhysical;


function writeVirtual( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_writeVirtual( Number64(arg_address) , arg_buffer , arg_writeBytes || arg_buffer.length  ) ;
}
exports.writeVirtual = writeVirtual;

function writeVirtualUncached( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_writeVirtualUncached( Number64(arg_address) , arg_buffer ,  arg_writeBytes || arg_buffer.length  ) ;
}
exports.writeVirtualUncached = writeVirtualUncached;



function searchVirtual( arg_address , arg_length , arg_pattern , arg_granularity )
{
	assert( Buffer.isBuffer(arg_pattern) , "invalid arg_pattern" );
	
	return process.reserved.hostDependBindings.windbg_searchVirtual( 
			Number64(arg_address) ,  
			Number64(arg_length) , 
			arg_pattern ,
			arg_granularity || 1
			
	) ;
}
exports.searchVirtual = searchVirtual;






//----------------------------------------------

// alias name for readVirtual

function readVirtualDoubleBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readDoubleBE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualDoubleBE = readVirtualDoubleBE;

function readVirtualDoubleLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readDoubleLE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualDoubleLE = readVirtualDoubleLE;

function readVirtualFloatBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readFloatBE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualFloatBE = readVirtualFloatBE;

function readVirtualFloatLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readFloatLE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualFloatLE = readVirtualFloatLE;

// 1 byte
function readVirtualInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt8( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt8 = readVirtualInt8;


function readVirtualUInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt8( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt8 = readVirtualUInt8;


// 2 bytes
function readVirtualInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt16BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt16BE = readVirtualInt16BE;


function readVirtualInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt16LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt16LE = readVirtualInt16LE;

function readVirtualUInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt16BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt16BE = readVirtualUInt16BE;


function readVirtualUInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt16LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt16LE = readVirtualUInt16LE;

// 4 bytes
function readVirtualInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt32BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt32BE = readVirtualInt32BE;


function readVirtualInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt32LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt32LE = readVirtualInt32LE;


function readVirtualUInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt32BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt32BE = readVirtualUInt32BE;


function readVirtualUInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt32LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt32LE = readVirtualUInt32LE;

// 8 bytes
function readVirtualInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt64BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt64BE = readVirtualInt64BE;


function readVirtualInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt64LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualInt64LE = readVirtualInt64LE;


function readVirtualUInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt64BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt64BE = readVirtualUInt64BE;


function readVirtualUInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt64LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUInt64LE = readVirtualUInt64LE;

function readVirtualPointer( arg_address , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return readVirtualUInt64LE( arg_address , arg_offset );
	}
	else
	{
		return Number64( readVirtualUInt32LE( arg_address , arg_offset ) );
	}
}
exports.readVirtualPointer = readVirtualPointer;


// write 
function writeVirtualDoubleBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleBE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualDoubleBE = writeVirtualDoubleBE;

function writeVirtualDoubleLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleLE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualDoubleLE = writeVirtualDoubleLE;


//float
function writeVirtualFloatBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatBE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualFloatBE = writeVirtualFloatBE;

function writeVirtualFloatLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatLE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualFloatLE = writeVirtualFloatLE;

// 1 byte
function writeVirtualInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt8( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt8 = writeVirtualInt8;

function writeVirtualUInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt8( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt8 = writeVirtualUInt8;

// 2 bytes

function writeVirtualInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt16BE = writeVirtualInt16BE;

function writeVirtualInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt16LE = writeVirtualInt16LE;


function writeVirtualUInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt16BE = writeVirtualUInt16BE;

function writeVirtualUInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt16LE = writeVirtualUInt16LE;

// 4 bytes
function writeVirtualInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt32BE = writeVirtualInt32BE;

function writeVirtualInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt32LE = writeVirtualInt32LE;


function writeVirtualUInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt32BE = writeVirtualUInt32BE;

function writeVirtualUInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt32LE = writeVirtualUInt32LE;

// 8bytes

function writeVirtualInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt64BE = writeVirtualInt64BE;

function writeVirtualInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualInt64LE = writeVirtualInt64LE;


function writeVirtualUInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt64BE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt64BE = writeVirtualUInt64BE;

function writeVirtualUInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = writeVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUInt64LE = writeVirtualUInt64LE;


function writeVirtualPointer( arg_address , arg_value , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return writeVirtualUInt64LE( arg_address , arg_value , arg_offset );
	}
	else
	{
		return writeVirtualUInt32LE( arg_address , Number64(arg_value) , arg_offset );
	}
}
exports.writeVirtualPointer = writeVirtualPointer;













//----------------------------------------------

// alias name for readVirtualUncached

function readVirtualUnCachedDoubleBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readDoubleBE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedDoubleBE = readVirtualUnCachedDoubleBE;

function readVirtualUnCachedDoubleLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readDoubleLE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedDoubleLE = readVirtualUnCachedDoubleLE;

function readVirtualUnCachedFloatBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readFloatBE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedFloatBE = readVirtualUnCachedFloatBE;

function readVirtualUnCachedFloatLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readFloatLE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedFloatLE = readVirtualUnCachedFloatLE;

// 1 byte
function readVirtualUnCachedInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt8( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt8 = readVirtualUnCachedInt8;


function readVirtualUnCachedUInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt8( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt8 = readVirtualUnCachedUInt8;


// 2 bytes
function readVirtualUnCachedInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt16BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt16BE = readVirtualUnCachedInt16BE;


function readVirtualUnCachedInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt16LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt16LE = readVirtualUnCachedInt16LE;

function readVirtualUnCachedUInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt16BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt16BE = readVirtualUnCachedUInt16BE;


function readVirtualUnCachedUInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt16LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt16LE = readVirtualUnCachedUInt16LE;

// 4 bytes
function readVirtualUnCachedInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt32BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt32BE = readVirtualUnCachedInt32BE;


function readVirtualUnCachedInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt32LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt32LE = readVirtualUnCachedInt32LE;


function readVirtualUnCachedUInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt32BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt32BE = readVirtualUnCachedUInt32BE;


function readVirtualUnCachedUInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt32LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt32LE = readVirtualUnCachedUInt32LE;

// 8 bytes
function readVirtualUnCachedInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt64BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt64BE = readVirtualUnCachedInt64BE;


function readVirtualUnCachedInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readInt64LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedInt64LE = readVirtualUnCachedInt64LE;


function readVirtualUnCachedUInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt64BE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt64BE = readVirtualUnCachedUInt64BE;


function readVirtualUnCachedUInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = readVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("read 0x%X offset 0x%X with %d bytes , but only %d bytes got" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	value = lpBuffer.readUInt64LE( 0 );
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return value;
}
exports.readVirtualUnCachedUInt64LE = readVirtualUnCachedUInt64LE;

function readVirtualUnCachedPointer( arg_address , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return readVirtualUnCachedUInt64LE( arg_address , arg_offset  );
	}
	else
	{
		return Number64( readVirtualUnCachedUInt32LE( arg_address , arg_offset  ) );
	}
}
exports.readVirtualUnCachedPointer = readVirtualUnCachedPointer;


// write 
function writeVirtualUnCachedDoubleBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleBE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedDoubleBE = writeVirtualUnCachedDoubleBE;

function writeVirtualUnCachedDoubleLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleLE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedDoubleLE = writeVirtualUnCachedDoubleLE;


//float
function writeVirtualUnCachedFloatBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatBE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedFloatBE = writeVirtualUnCachedFloatBE;

function writeVirtualUnCachedFloatLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatLE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedFloatLE = writeVirtualUnCachedFloatLE;

// 1 byte
function writeVirtualUnCachedInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt8( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt8 = writeVirtualUnCachedInt8;

function writeVirtualUnCachedUInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt8( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt8 = writeVirtualUnCachedUInt8;

// 2 bytes

function writeVirtualUnCachedInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt16BE = writeVirtualUnCachedInt16BE;

function writeVirtualUnCachedInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt16LE = writeVirtualUnCachedInt16LE;


function writeVirtualUnCachedUInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt16BE = writeVirtualUnCachedUInt16BE;

function writeVirtualUnCachedUInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt16LE = writeVirtualUnCachedUInt16LE;

// 4 bytes
function writeVirtualUnCachedInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt32BE = writeVirtualUnCachedInt32BE;

function writeVirtualUnCachedInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt32LE = writeVirtualUnCachedInt32LE;


function writeVirtualUnCachedUInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt32BE = writeVirtualUnCachedUInt32BE;

function writeVirtualUnCachedUInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt32LE = writeVirtualUnCachedUInt32LE;

// 8bytes

function writeVirtualUnCachedInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt64BE = writeVirtualUnCachedInt64BE;

function writeVirtualUnCachedInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedInt64LE = writeVirtualUnCachedInt64LE;


function writeVirtualUnCachedUInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt64BE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt64BE = writeVirtualUnCachedUInt64BE;

function writeVirtualUnCachedUInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = writeVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
	}
	catch(err)
	{
		ioError = err;
	}
	
	if ( ioError )
	{
		lpBuffer.free();
		throw ioError;
	}
	
	if ( wantedBytes != ioBytes )
	{
		lpBuffer.free();
		throw new Error("write 0x%X offset 0x%X with %d bytes , but only %d bytes ok" , arg_address  , arg_offset , wantedBytes , ioBytes );
	}
	
	lpBuffer.free(); 
	lpBuffer = null;
	
	return true;
}
exports.writeVirtualUnCachedUInt64LE = writeVirtualUnCachedUInt64LE;


function writeVirtualUnCachedPointer( arg_address , arg_value , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return writeVirtualUnCachedUInt64LE( arg_address , arg_value , arg_offset );
	}
	else
	{
		return writeVirtualUnCachedUInt32LE( arg_address , Number64(arg_value) , arg_offset );
	}
}
exports.writeVirtualUnCachedPointer = writeVirtualUnCachedPointer;


//-------------------------------------------------------------------






function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}