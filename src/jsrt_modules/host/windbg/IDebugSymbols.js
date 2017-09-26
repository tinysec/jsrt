'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;





function GetNameByOffset( arg_address )
{
	var info = process.reserved.hostDependBindings.IDebugSymbols_GetNameByOffset( Number64(arg_address) );
	if ( !info )
	{
		return;
	}
	
	info.offset = Number64( info.offset );
	
	return info;
}
exports.GetNameByOffset = GetNameByOffset;
   

function GetOffsetByName( arg_name )
{
	assert( _.isString(arg_name) , "invalid arguments" );
	
	return Number64( process.reserved.hostDependBindings.IDebugSymbols_GetOffsetByName( arg_name ) );
}
exports.GetOffsetByName = GetOffsetByName;


function GetModuleByModuleName( arg_name ,arg_startIndex )
{
	assert( _.isString(arg_name) , "invalid arguments" );
	
	var info = process.reserved.hostDependBindings.IDebugSymbols_GetModuleByModuleName( arg_name , arg_startIndex );
	
	if ( !info )
	{
		return;
	}
	
	info.imageBase = Number64( info.imageBase );
	
	return info;
}
exports.GetModuleByModuleName = GetModuleByModuleName;


function GetFieldOffset( arg_typename , arg_fieldname )
{
	assert( _.isString(arg_typename) , "invalid type name" );
	
	assert( _.isString(arg_fieldname) , "invalid field name" );
	
	var temp = arg_typename.split('!');
	
	assert( ( _.isArray(temp) && ( 2 == temp.length ) ) , "invalid typename" );
	
	var moduleName = temp[0];
	var typename = temp[1];
	
	var info = GetModuleByModuleName( moduleName );
	if ( !info )
	{
		return -1;
	}
	
	return Number64( process.reserved.hostDependBindings.IDebugSymbols_GetFieldOffset( info.imageBase , typename , arg_fieldname ) );
}
exports.GetFieldOffset = GetFieldOffset;





function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}