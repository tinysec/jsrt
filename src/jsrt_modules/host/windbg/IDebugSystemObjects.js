'use strict';

const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;


function GetCurrentProcessDataOffset()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentProcessDataOffset( ) );
}
exports.GetCurrentProcessDataOffset = GetCurrentProcessDataOffset;


function GetCurrentProcessExecutableName()
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentProcessExecutableName( );
}
exports.GetCurrentProcessExecutableName = GetCurrentProcessExecutableName;


function GetCurrentProcessHandle()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentProcessHandle( ) );
}
exports.GetCurrentProcessHandle = GetCurrentProcessHandle;



function GetCurrentProcessSystemId()
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentProcessSystemId( );
}
exports.GetCurrentProcessSystemId = GetCurrentProcessSystemId;


function GetCurrentProcessPeb()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentProcessPeb( ) );
}
exports.GetCurrentProcessPeb = GetCurrentProcessPeb;


function GetCurrentThreadDataOffset()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentThreadDataOffset( ) );
}
exports.GetCurrentThreadDataOffset = GetCurrentThreadDataOffset;


function GetCurrentThreadHandle()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentThreadHandle( ) );
}
exports.GetCurrentThreadHandle = GetCurrentThreadHandle;


function GetCurrentThreadSystemId()
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentThreadSystemId( );
}
exports.GetCurrentThreadSystemId = GetCurrentThreadSystemId;


function GetCurrentThreadTeb()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects_GetCurrentThreadTeb( ) );
}
exports.GetCurrentThreadTeb = GetCurrentThreadTeb;


function GetProcessIdByDataOffset( arg_dataOffset )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetProcessIdByDataOffset( Number64( arg_dataOffset ) );
}
exports.GetProcessIdByDataOffset = GetProcessIdByDataOffset;


function GetProcessIdByHandle( arg_handle )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetProcessIdByHandle( Number64( arg_handle ) );
}
exports.GetProcessIdByHandle = GetProcessIdByHandle;


function GetProcessIdByPeb( arg_peb )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetProcessIdByPeb( Number64( arg_peb ) );
}
exports.GetProcessIdByPeb = GetProcessIdByPeb;


function GetThreadIdByDataOffset( arg_dataOffset )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetThreadIdByDataOffset( Number64( arg_dataOffset ) );
}
exports.GetThreadIdByDataOffset = GetThreadIdByDataOffset;


function GetThreadIdByHandle( arg_handle )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetThreadIdByHandle( Number64( arg_handle ) );
}
exports.GetThreadIdByHandle = GetThreadIdByHandle;


function GetThreadIdByTeb( arg_teb )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects_GetThreadIdByTeb( Number64( arg_teb )  );
}
exports.GetThreadIdByTeb = GetThreadIdByTeb;


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// g_pDebugSystemObjects2

function GetCurrentProcessUpTime()
{
	return process.reserved.hostDependBindings.IDebugSystemObjects2_GetCurrentProcessUpTime( );
}
exports.GetCurrentProcessUpTime =GetCurrentProcessUpTime;


function GetImplicitProcessDataOffset()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects2_GetImplicitProcessDataOffset( ) );
}
exports.GetImplicitProcessDataOffset=GetImplicitProcessDataOffset;


function GetImplicitThreadDataOffset()
{
	return Number64( process.reserved.hostDependBindings.IDebugSystemObjects2_GetImplicitThreadDataOffset( ) );
}
exports.GetImplicitThreadDataOffset=GetImplicitThreadDataOffset;

function SetImplicitProcessDataOffset( arg_dataOffset )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects2_SetImplicitProcessDataOffset( Number64(  arg_dataOffset  )  );
}
exports.SetImplicitProcessDataOffset=SetImplicitProcessDataOffset;


function SetImplicitThreadDataOffset(  arg_dataOffset  )
{
	return process.reserved.hostDependBindings.IDebugSystemObjects2_SetImplicitThreadDataOffset( Number64(  arg_dataOffset  ) );
}
exports.SetImplicitThreadDataOffset=SetImplicitThreadDataOffset;




/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function main(  )
{

	
	printf( "GetCurrentProcessSystemId = %d\n" , GetCurrentProcessSystemId() );
	
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}