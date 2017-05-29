'use strict';

const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const fs = require("fs");

const serialize = require("serialize").serialize;

const ffi = require("ffi");

var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [
	
	"BOOL WINAPI CloseHandle( _In_ HANDLE hObject );" ,
	
	"DWORD WINAPI WaitForMultipleObjects(_In_       DWORD  nCount, _In_  HANDLE *lpHandles,_In_       BOOL   bWaitAll, _In_       DWORD  dwMilliseconds);" ,
	
	"DWORD WINAPI WaitForSingleObject(  _In_ HANDLE hHandle , _In_ DWORD  dwMilliseconds );" ,
	
	"BOOL WINAPI TerminateThread(  _In_ HANDLE hHandle , _In_ DWORD  dwExitCode );" 
]);

function Thread( arg_hThread )
{
	this.hThread = arg_hThread;
}

Thread.prototype.wait = function( timeout )
{
	assert( this.hThread , "invalid hThread");

	return ffi_kernel32.WaitForSingleObject( this.hThread , timeout || -1 );
}

Thread.prototype.close = function(  )
{
	assert( this.hThread , "invalid hThread");
	
	ffi_kernel32.CloseHandle( this.hThread );
	
	this.hThread = null;
}

Thread.prototype.waitAndClose = function( timeout )
{
	assert( this.hThread , "invalid hThread");

	var waitRet = ffi_kernel32.WaitForSingleObject( this.hThread , timeout || -1 );
	
	ffi_kernel32.CloseHandle( this.hThread );
	
	this.hThread = null;
	
	return waitRet;
}

Thread.prototype.waitAndKill = function( timeout )
{
	assert( this.hThread , "invalid hThread");

	var waitRet = ffi_kernel32.WaitForSingleObject( this.hThread , timeout || -1 );
	
	if ( 0 != waitRet )
	{
		ffi_kernel32.TerminateThread( this.hThread , waitRet || 0 );
	}

	ffi_kernel32.CloseHandle( this.hThread );
	
	this.hThread = null;
	
	return waitRet;
}

Thread.prototype.kill = function( exitCode )
{
	assert( this.hThread , "invalid hThread");
	
	return ffi_kernel32.TerminateThread( this.hThread , exitCode || 0 );
}

function create( fileName , routineName , threadContext )
{
	var hThread = 0;
	var fileContent = null;
	
	assert( _.isString(fileName) , "invalid filename" );
	
	assert( _.isString(routineName) , "invalid routineName" );
	
	fileContent = fs.readFile( fileName , "utf-8");
	
	assert( ( 0 != fileContent.length ) , "empty fileContent" );
	
	hThread = process.reserved.bindings.thread_create( fileContent , fileName , routineName ,  serialize( threadContext ) );
	if ( !hThread )
	{
		return;
	}

	return new Thread( Number64(hThread) );
}
exports.create = create;

function WaitForMultipleObjects( handleArray , bWaitAll  , timeout )
{
	var lpHandleArray = null;
	var pointerSize = ("x64" == process.arch) ? 8 : 4;
	var index = 0;
	var waitRet = 0;
	
	do
	{
		assert( _.isArray(handleArray) , "handleArray must be array" );
		
		assert( ( 0 != handleArray.length ) , "handleArray must not empty" );
		
		lpHandleArray = Buffer.alloc( pointerSize * handleArray.length ).fill(0);
		
		for ( index = 0; index < handleArray.length; index++ )
		{
			lpHandleArray.writePointer( handleArray[index] , index * pointerSize );
		}
		
		waitRet = ffi_kernel32.WaitForMultipleObjects(
				handleArray.length , 
				lpHandleArray , 
				bWaitAll ,
				timeout || -1
		);
				
	}while(false);
	
	
	if ( lpHandleArray )
	{
		lpHandleArray.free();
		lpHandleArray = null;
	}

	return waitRet;
}

function waitMulti( threadArray , bWaitAll  , timeout )
{
	assert( _.isArray(threadArray) , "threadArray must be array" );
	
	assert( ( 0 != threadArray.length ) , "threadArray must not empty" );
	
	var handleArray = _.map( threadArray , function(item)
	{
		return item.hThread;
	});
	
	return WaitForMultipleObjects( handleArray , bWaitAll , timeout );
}
exports.waitMulti = waitMulti;

function waitAll( threadArray  , timeout )
{
	assert( _.isArray(threadArray) , "threadArray must be array" );
	
	assert( ( 0 != threadArray.length ) , "threadArray must not empty" );
	
	var handleArray = _.map( threadArray , function(item)
	{
		return item.hThread;
	});
	
	return WaitForMultipleObjects( handleArray , true , timeout );
}
exports.waitAll = waitAll;

function waitAllAndClose( threadArray  , timeout )
{
	assert( _.isArray(threadArray) , "threadArray must be array" );
	
	assert( ( 0 != threadArray.length ) , "threadArray must not empty" );
	
	var handleArray = _.map( threadArray , function(item)
	{
		return item.hThread;
	});
	
	var waitRet = WaitForMultipleObjects( handleArray , true , timeout );
	
	var index = 0;
	
	for ( index = 0; index < threadArray.length; index++ )
	{
		ffi_kernel32.CloseHandle( threadArray[index].hThread );
		threadArray[index].hThread = null;
	}
	
	return waitRet;
}
exports.waitAllAndClose = waitAllAndClose;

function waitAllAndKill( threadArray  , timeout )
{
	assert( _.isArray(threadArray) , "threadArray must be array" );
	
	assert( ( 0 != threadArray.length ) , "threadArray must not empty" );
	
	var handleArray = _.map( threadArray , function(item)
	{
		return item.hThread;
	});
	
	var waitRet = WaitForMultipleObjects( handleArray , true , timeout );
	
	var index = 0;
	
	for ( index = 0; index < threadArray.length; index++ )
	{
		ffi_kernel32.TerminateThread( threadArray[index].hThread , waitRet );
	
		ffi_kernel32.CloseHandle( threadArray[index].hThread );
		threadArray[index].hThread = null;
	}
	
	return waitRet;
}
exports.waitAllAndKill = waitAllAndKill;



function main(  )
{
	return 0;
}

if ( !module.parent )
{
	main();
}


