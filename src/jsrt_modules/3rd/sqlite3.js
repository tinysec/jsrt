const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");


var ffi_sqlite3 = ffi.loadAndBatchBind("sqlite3.dll" , [

	"int __cdecl sqlite3_open( void* filename , void** ppDb);" , 
	
	"void __cdecl sqlite3_free( HANDLE pData);" , 
	
	"int __cdecl sqlite3_close( HANDLE hSQLite);" , 
	
	"int __cdecl sqlite3_exec( HANDLE hSQLite , void* sql , void* callback , void* lParam , void** errmsg);" ,
	
	"int __cdecl sqlite3_changes( HANDLE hSQLite );" ,
	
	"int __cdecl sqlite3_total_changes( HANDLE hSQLite );" ,
	
	"ULONG64 __cdecl sqlite3_last_insert_rowid( HANDLE hSQLite);"

]);


function sqlite3_open( filename )
{
	var lpFileName = null;
	var lpHandle = null;
	
	var hSQLite = null;
	var retCode = 0;
	
	assert( _.isString(filename) , "invalid filename" );
	
	assert( ( filename.length != 0 ) , "invalid filename" );
	
	lpFileName = Buffer.from( filename , "utf-8" );
	lpHandle = Buffer.alloc( 8 ).fill(0);
	
	
	retCode = ffi_sqlite3.sqlite3_open( lpFileName , lpHandle );
	if ( 0 != retCode )
	{
		lpFileName.free();
		lpFileName = null;
		
		lpHandle.free();
		lpHandle = null;
		
		throw new Error(sprintf("open %s faild %d" , filename , retCode ) );
	}
	
	hSQLite = lpHandle.readPointer( 0 );
	
	lpFileName.free();
	lpFileName = null;
	
	lpHandle.free();
	lpHandle = null;
		
	return hSQLite;
}
exports.open = sqlite3_open;

function sqlite3_close( hSQLite )
{
	var retCode = 0;

	assert( Number64.isNumber64( hSQLite) , "invalid sqlite handle" );

	return ffi_sqlite3.sqlite3_close( hSQLite );
}
exports.close = sqlite3_close;

function sqlite3_exec( hSQLite , sql )
{
	var lpSQL = null;
	var retCode = 0;
	
	var lppErrMsg = null;
	var lpErrMsgAddress = null;
	var result = {};

	
	var errMsg = '';
	
	assert( Number64.isNumber64( hSQLite) , "invalid sqlite handle" );
	
	assert( _.isString(sql) , "invalid sql" );
	
	assert( ( sql.length != 0 ) , "invalid sql" );
		
	lpSQL = Buffer.from( sql , "utf-8" );

	lppErrMsg = Buffer.alloc( 8 ).fill(0);
	
	result.code = ffi_sqlite3.sqlite3_exec( hSQLite , lpSQL , null , null , lppErrMsg);

	lpErrMsgAddress = lppErrMsg.readPointer(0);
	if ( !lpErrMsgAddress.isZero() )
	{
		result.error = Buffer.toString( lpErrMsgAddress , "utf-8" );
		
		ffi_sqlite3.sqlite3_free( lpErrMsgAddress );
		lpErrMsgAddress = null;
	}
	
	
	result.modifiedRows = ffi_sqlite3.sqlite3_changes( hSQLite );
	result.totalModifiedRows = ffi_sqlite3.sqlite3_changes( hSQLite );
	result.lastInsertRowId = ffi_sqlite3.sqlite3_last_insert_rowid( hSQLite );
	
	lpSQL.free();
	lpSQL = null;
	
	lppErrMsg.free();
	lppErrMsg = null;
	
	return result;
}
exports.exec = sqlite3_exec;

function def_exec_callback( param , columnCount , ppColumn_value  , ppColumn_name , context  )
{
	var columnIndex = 0;

	var lpColumnValueAddress = null;
	var lpColumnNameAddress = null;
	
	var columnValue = '';
	var columnName = '';
	
	var rowNode = {};
	
	var POINTER_SIZE = 'x64' == process.arch ? 8 : 4; 
	
	var callbackRet = 0;

	
	for ( columnIndex = 0; columnIndex < columnCount; columnIndex++ )
	{
		lpColumnValueAddress = Buffer.readPointer( ppColumn_value , POINTER_SIZE * columnIndex  );
		
		
		if ( !lpColumnValueAddress.isZero() )
		{
			columnValue = Buffer.toString( lpColumnValueAddress , "utf-8" );
			lpColumnValueAddress = null;
		}
		else
		{
			columnValue = undefined;
		}
				
		lpColumnNameAddress = Buffer.readPointer( ppColumn_name , POINTER_SIZE * columnIndex  );
		
		if ( !lpColumnNameAddress.isZero() )
		{
			columnName = Buffer.toString( lpColumnNameAddress , "utf-8" );
			lpColumnNameAddress = null;

			rowNode[ columnName ] = columnValue;
		}
	}
	
	if ( context.callback )
	{
		callbackRet = context.callback( null , rowNode );
	}
	else
	{
		if ( !context.result.rows )
		{
			context.result.rows = [];
		}

		context.result.rows.push( rowNode );
	}
	
	lpColumnValueAddress = null;
	lpColumnNameAddress = null;
	
	return callbackRet;
}

function sqlite3_execSync( hSQLite , sql )
{
	var lpSQL = null;
	var retCode = 0;
	
	var lppErrMsg = null;
	var lpErrMsgAddress = null;

	var errMsg = '';
	
	var callback = null;
	
	var lpCallback = null;
	
	var context = {};
	
	assert( Number64.isNumber64( hSQLite) , "invalid sqlite handle" );
	
	assert( _.isString(sql) , "invalid sql" );
	
	assert( ( sql.length != 0 ) , "invalid sql" );
	
	if ( arguments.length >= 3 )
	{
		if ( _.isFunction( arguments[ arguments.length - 1 ] ) )
		{
			callback = arguments[ arguments.length - 1 ];
		}
	}
	
		
	lpSQL = Buffer.from( sql , "utf-8" );

	lppErrMsg = Buffer.alloc( 8 ).fill(0);
	
	context.callback = callback;
	context.result = {};
	
	context.result.code = -1;

	
	lpCallback = ffi.thunk( 
				def_exec_callback , 
				"int __cdecl sqlite3_callback(void* param , int columnCount , char** ppColumn_value , char** ppColumn_name )" ,
				this ,
				context
	);
	
	context.result.code = ffi_sqlite3.sqlite3_exec( hSQLite , lpSQL , lpCallback , null , lppErrMsg);
	
	lpErrMsgAddress = lppErrMsg.readPointer(0);
	if ( !lpErrMsgAddress.isZero() )
	{
		context.result.error = Buffer.toString( lpErrMsgAddress , "utf-8" );
		
		ffi_sqlite3.sqlite3_free( lpErrMsgAddress );
		lpErrMsgAddress = null;
	}
	
	// result
	var result = context.result;
	result.modifiedRows = ffi_sqlite3.sqlite3_changes( hSQLite );
	result.totalModifiedRows = ffi_sqlite3.sqlite3_changes( hSQLite );
	result.lastInsertRowId = ffi_sqlite3.sqlite3_last_insert_rowid( hSQLite );
	
	lpCallback.free();
	lpCallback = null;
		
	lpSQL.free();
	lpSQL = null;
	
	lppErrMsg.free();
	lppErrMsg = null;
	
	
	return result;
}
exports.execSync = sqlite3_execSync;


function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}