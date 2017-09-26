'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


//-------------------------------------------------------------------
// IDebugDataSpaces

function ReadMsr( arg_index )
{
	assert( _.isNumber(arg_index) , "invalid msr index" );
	
	return Number64( process.reserved.hostDependBindings.windbg_IDebugDataSpaces_ReadMsr( arg_index ) );
}
exports.ReadMsr = ReadMsr;

function WriteMsr( arg_index , arg_value )
{
	assert( _.isNumber(arg_index) , "invalid msr index" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_WriteMsr( arg_index , Number64(arg_value) );
}
exports.WriteMsr = WriteMsr;


function ReadPhysical( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_ReadPhysical( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.ReadPhysical = ReadPhysical;


function ReadVirtual( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_ReadVirtual( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.ReadVirtual = ReadVirtual;

function ReadVirtualUncached( arg_address , arg_buffer , arg_readBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_ReadVirtualUncached( Number64(arg_address) , arg_buffer , arg_readBytes || arg_buffer.length ) ;
}
exports.ReadVirtualUncached = ReadVirtualUncached;


function WritePhysical( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_WritePhysical( Number64(arg_address) , arg_buffer , arg_writeBytes || arg_buffer.length ) ;
}
exports.WritePhysical = WritePhysical;


function WriteVirtual( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_WriteVirtual( Number64(arg_address) , arg_buffer , arg_writeBytes || arg_buffer.length  ) ;
}
exports.WriteVirtual = WriteVirtual;

function WriteVirtualUncached( arg_address , arg_buffer , arg_writeBytes )
{
	assert( Buffer.isBuffer(arg_buffer) , "invalid arg_buffer" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_WriteVirtualUncached( Number64(arg_address) , arg_buffer ,  arg_writeBytes || arg_buffer.length  ) ;
}
exports.WriteVirtualUncached = WriteVirtualUncached;



function SearchVirtual( arg_address , arg_length , arg_pattern , arg_granularity )
{
	assert( Buffer.isBuffer(arg_pattern) , "invalid arg_pattern" );
	
	return process.reserved.hostDependBindings.windbg_IDebugDataSpaces_SearchVirtual( 
			Number64(arg_address) ,  
			Number64(arg_length) , 
			arg_pattern ,
			arg_granularity || 1
			
	) ;
}
exports.SearchVirtual = SearchVirtual;






//----------------------------------------------

// alias name for ReadVirtual

function ReadVirtualDoubleBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualDoubleBE = ReadVirtualDoubleBE;

function ReadVirtualDoubleLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualDoubleLE = ReadVirtualDoubleLE;

function ReadVirtualFloatBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualFloatBE = ReadVirtualFloatBE;

function ReadVirtualFloatLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualFloatLE = ReadVirtualFloatLE;

// 1 byte
function ReadVirtualInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt8 = ReadVirtualInt8;


function ReadVirtualUInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt8 = ReadVirtualUInt8;


// 2 bytes
function ReadVirtualInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt16BE = ReadVirtualInt16BE;


function ReadVirtualInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt16LE = ReadVirtualInt16LE;

function ReadVirtualUInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt16BE = ReadVirtualUInt16BE;


function ReadVirtualUInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt16LE = ReadVirtualUInt16LE;

// 4 bytes
function ReadVirtualInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt32BE = ReadVirtualInt32BE;


function ReadVirtualInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt32LE = ReadVirtualInt32LE;


function ReadVirtualUInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt32BE = ReadVirtualUInt32BE;


function ReadVirtualUInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt32LE = ReadVirtualUInt32LE;

// 8 bytes
function ReadVirtualInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt64BE = ReadVirtualInt64BE;


function ReadVirtualInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualInt64LE = ReadVirtualInt64LE;


function ReadVirtualUInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt64BE = ReadVirtualUInt64BE;


function ReadVirtualUInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUInt64LE = ReadVirtualUInt64LE;

function ReadVirtualPointer( arg_address , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return ReadVirtualUInt64LE( arg_address , arg_offset );
	}
	else
	{
		return Number64( ReadVirtualUInt32LE( arg_address , arg_offset ) );
	}
}
exports.ReadVirtualPointer = ReadVirtualPointer;


// write 
function WriteVirtualDoubleBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleBE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualDoubleBE = WriteVirtualDoubleBE;

function WriteVirtualDoubleLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleLE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualDoubleLE = WriteVirtualDoubleLE;


//float
function WriteVirtualFloatBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatBE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualFloatBE = WriteVirtualFloatBE;

function WriteVirtualFloatLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatLE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualFloatLE = WriteVirtualFloatLE;

// 1 byte
function WriteVirtualInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt8( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt8 = WriteVirtualInt8;

function WriteVirtualUInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt8( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt8 = WriteVirtualUInt8;

// 2 bytes

function WriteVirtualInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt16BE = WriteVirtualInt16BE;

function WriteVirtualInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt16LE = WriteVirtualInt16LE;


function WriteVirtualUInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt16BE = WriteVirtualUInt16BE;

function WriteVirtualUInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt16LE = WriteVirtualUInt16LE;

// 4 bytes
function WriteVirtualInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt32BE = WriteVirtualInt32BE;

function WriteVirtualInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt32LE = WriteVirtualInt32LE;


function WriteVirtualUInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt32BE = WriteVirtualUInt32BE;

function WriteVirtualUInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt32LE = WriteVirtualUInt32LE;

// 8bytes

function WriteVirtualInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt64BE = WriteVirtualInt64BE;

function WriteVirtualInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualInt64LE = WriteVirtualInt64LE;


function WriteVirtualUInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt64BE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt64BE = WriteVirtualUInt64BE;

function WriteVirtualUInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = WriteVirtual( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUInt64LE = WriteVirtualUInt64LE;


function WriteVirtualPointer( arg_address , arg_value , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return WriteVirtualUInt64LE( arg_address , arg_value , arg_offset );
	}
	else
	{
		return WriteVirtualUInt32LE( arg_address , Number64(arg_value) , arg_offset );
	}
}
exports.WriteVirtualPointer = WriteVirtualPointer;













//----------------------------------------------

// alias name for ReadVirtualUncached

function ReadVirtualUnCachedDoubleBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedDoubleBE = ReadVirtualUnCachedDoubleBE;

function ReadVirtualUnCachedDoubleLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedDoubleLE = ReadVirtualUnCachedDoubleLE;

function ReadVirtualUnCachedFloatBE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedFloatBE = ReadVirtualUnCachedFloatBE;

function ReadVirtualUnCachedFloatLE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedFloatLE = ReadVirtualUnCachedFloatLE;

// 1 byte
function ReadVirtualUnCachedInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt8 = ReadVirtualUnCachedInt8;


function ReadVirtualUnCachedUInt8( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt8 = ReadVirtualUnCachedUInt8;


// 2 bytes
function ReadVirtualUnCachedInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt16BE = ReadVirtualUnCachedInt16BE;


function ReadVirtualUnCachedInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt16LE = ReadVirtualUnCachedInt16LE;

function ReadVirtualUnCachedUInt16BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt16BE = ReadVirtualUnCachedUInt16BE;


function ReadVirtualUnCachedUInt16LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt16LE = ReadVirtualUnCachedUInt16LE;

// 4 bytes
function ReadVirtualUnCachedInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt32BE = ReadVirtualUnCachedInt32BE;


function ReadVirtualUnCachedInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt32LE = ReadVirtualUnCachedInt32LE;


function ReadVirtualUnCachedUInt32BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt32BE = ReadVirtualUnCachedUInt32BE;


function ReadVirtualUnCachedUInt32LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt32LE = ReadVirtualUnCachedUInt32LE;

// 8 bytes
function ReadVirtualUnCachedInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt64BE = ReadVirtualUnCachedInt64BE;


function ReadVirtualUnCachedInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedInt64LE = ReadVirtualUnCachedInt64LE;


function ReadVirtualUnCachedUInt64BE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt64BE = ReadVirtualUnCachedUInt64BE;


function ReadVirtualUnCachedUInt64LE( arg_address , arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	var value = 0;
	
	try
	{
		ioBytes = ReadVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.ReadVirtualUnCachedUInt64LE = ReadVirtualUnCachedUInt64LE;

function ReadVirtualUnCachedPointer( arg_address , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return ReadVirtualUnCachedUInt64LE( arg_address , arg_offset  );
	}
	else
	{
		return Number64( ReadVirtualUnCachedUInt32LE( arg_address , arg_offset  ) );
	}
}
exports.ReadVirtualUnCachedPointer = ReadVirtualUnCachedPointer;


// write 
function WriteVirtualUnCachedDoubleBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleBE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedDoubleBE = WriteVirtualUnCachedDoubleBE;

function WriteVirtualUnCachedDoubleLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeDoubleLE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedDoubleLE = WriteVirtualUnCachedDoubleLE;


//float
function WriteVirtualUnCachedFloatBE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatBE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedFloatBE = WriteVirtualUnCachedFloatBE;

function WriteVirtualUnCachedFloatLE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeFloatLE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedFloatLE = WriteVirtualUnCachedFloatLE;

// 1 byte
function WriteVirtualUnCachedInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt8( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt8 = WriteVirtualUnCachedInt8;

function WriteVirtualUnCachedUInt8( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 1;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt8( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt8 = WriteVirtualUnCachedUInt8;

// 2 bytes

function WriteVirtualUnCachedInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt16BE = WriteVirtualUnCachedInt16BE;

function WriteVirtualUnCachedInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt16LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt16LE = WriteVirtualUnCachedInt16LE;


function WriteVirtualUnCachedUInt16BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt16BE = WriteVirtualUnCachedUInt16BE;

function WriteVirtualUnCachedUInt16LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 2;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt16LE = WriteVirtualUnCachedUInt16LE;

// 4 bytes
function WriteVirtualUnCachedInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt32BE = WriteVirtualUnCachedInt32BE;

function WriteVirtualUnCachedInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt32LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt32LE = WriteVirtualUnCachedInt32LE;


function WriteVirtualUnCachedUInt32BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt32BE = WriteVirtualUnCachedUInt32BE;

function WriteVirtualUnCachedUInt32LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(4).fill(0);
	var ioError = null;
	var wantedBytes = 4;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt32LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt32LE = WriteVirtualUnCachedUInt32LE;

// 8bytes

function WriteVirtualUnCachedInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt64BE = WriteVirtualUnCachedInt64BE;

function WriteVirtualUnCachedInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeInt64LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedInt64LE = WriteVirtualUnCachedInt64LE;


function WriteVirtualUnCachedUInt64BE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt64BE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt64BE = WriteVirtualUnCachedUInt64BE;

function WriteVirtualUnCachedUInt64LE( arg_address , arg_value ,  arg_offset )
{
	var lpBuffer = Buffer.alloc(8).fill(0);
	var ioError = null;
	var wantedBytes = 8;
	var ioBytes = 0;
	
	try
	{
		lpBuffer.writeUInt16LE( arg_value );
		
		ioBytes = WriteVirtualUnCached( Number64.add(arg_address , arg_offset) , lpBuffer , wantedBytes );
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
exports.WriteVirtualUnCachedUInt64LE = WriteVirtualUnCachedUInt64LE;


function WriteVirtualUnCachedPointer( arg_address , arg_value , arg_offset )
{
	if ( isPointer64Bit() )
	{
		return WriteVirtualUnCachedUInt64LE( arg_address , arg_value , arg_offset );
	}
	else
	{
		return WriteVirtualUnCachedUInt32LE( arg_address , Number64(arg_value) , arg_offset );
	}
}
exports.WriteVirtualUnCachedPointer = WriteVirtualUnCachedPointer;


//-------------------------------------------------------------------






function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}