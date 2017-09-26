const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


function cpuid( eax , ecx )
{
	assert( _.isNumber(eax) , "eax must be number" );
	assert( ( _.isNumber(ecx) || _.isUndefined(ecx) ) , "ecx must be number" );

	return process.reserved.bindings.intrinsic_cpuid( eax , ecx || 0 );
}
exports.cpuid = cpuid;

// fs
function readfsUInt32LE( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	return process.reserved.bindings.intrinsic_readfsdword( offset );
}
exports.readfsUInt32LE = readfsUInt32LE;

function readfsPointer( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	if ( 'x64' == process.arch )
	{
		return Number64( process.reserved.bindings.intrinsic_readfsqword( offset ) );
	}
	else
	{
		return Number64( process.reserved.bindings.intrinsic_readfsdword( offset ) );
	}
}
exports.readfsPointer = readfsPointer;

function readfsUInt64LE( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	return Number64( process.reserved.bindings.intrinsic_readfsqword( offset ) );
}
exports.readfsUInt64LE = readfsUInt64LE;

// gs
function readgsUInt32LE( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	return process.reserved.bindings.intrinsic_readfsdword( offset );
}
exports.readgsUInt32LE = readgsUInt32LE;

function readgsUInt64LE( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	return Number64( process.reserved.bindings.intrinsic_readfsqword( offset ) );
}
exports.readgsUInt64LE = readgsUInt64LE;

function readgsPointer( offset )
{
	assert( _.isNumber(offset) , "offset must be number" );
	
	if ( 'x64' == process.arch )
	{
		return Number64( process.reserved.bindings.intrinsic_readgsqword( offset ) );
	}
	else
	{
		return Number64( process.reserved.bindings.intrinsic_readgsdword( offset ) );
	}
}
exports.readgsPointer = readgsPointer;


function getTEB()
{
	if ( 'x64' == process.arch )
	{
		return readgsPointer( 0x30 );
	}
	else
	{
		return readfsPointer( 0x18 );
	}
}
exports.getTEB = getTEB;

function getPEB()
{
	if ( 'x64' == process.arch )
	{
		return readgsPointer( 0x60 );
	}
	else
	{
		return readfsPointer( 0x30 );
	}
}
exports.getPEB = getPEB;


function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}