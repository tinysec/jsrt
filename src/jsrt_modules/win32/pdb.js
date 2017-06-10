const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");

var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [

	"HANDLE WINAPI GetCurrentProcess(void);" 

]);



var ffi_dbghelp = ffi.loadAndBatchBind("dbghelp.dll" , [

	"BOOL WINAPI SymCleanup(_In_ HANDLE hProcess);" , 
	
	"BOOL WINAPI SymInitializeW(_In_     HANDLE hProcess,_In_opt_ PCWSTR UserSearchPath,_In_     BOOL   fInvadeProcess);" ,
	
	"BOOL WINAPI SymGetSearchPath( _In_  HANDLE hProcess , _Out_ void*  SearchPath , _In_  DWORD  SearchPathLength );" ,
	
	"BOOL WINAPI SymSetSearchPathW(_In_     HANDLE hProcess,_In_opt_ PCWSTR SearchPath);" ,
	
	"BOOL WINAPI SymGetSymFromName64( _In_    HANDLE             hProcess, _In_    PCSTR              Name , _Inout_ void* Symbol);" ,
	
	"BOOL WINAPI SymGetSymFromAddr64(_In_      HANDLE             hProcess,_In_      DWORD64            Address,_Out_opt_ DWORD64*           Displacement,_Inout_   void* Symbol);" ,
	
	"BOOL WINAPI SymGetSymbolFileW(_In_opt_ HANDLE hProcess,_In_opt_ PCWSTR SymPath,_In_     PCWSTR ImageFile,_In_     DWORD  Type,_Out_    WCHAR*  SymbolFile,_In_     size_t cSymbolFile,_Out_    WCHAR*  DbgFile,_In_     size_t cDbgFile);" ,
	
	"DWORD64 WINAPI SymLoadModule64(_In_     HANDLE  hProcess,_In_opt_ HANDLE  hFile,_In_opt_ PCSTR   ImageName,_In_opt_ PCSTR   ModuleName,_In_     DWORD64 BaseOfDll,_In_     DWORD   SizeOfDll);" ,
	
	"BOOL WINAPI SymUnloadModule64( _In_ HANDLE  hProcess,_In_ DWORD64 BaseOfDll);" 

]);

var g_hCurrentProcess = ffi_kernel32.GetCurrentProcess();

function help_fixSearchPath( param_searchPath )
{
	var UserSearchPath = '';
	
	if ( _.isArray( param_searchPath ) )
    {
        if ( 0 != param_searchPath.length )
        {
            UserSearchPath = param_searchPath.join(';');
        }
        else
        {
            UserSearchPath = '';
        }
    }
    else if ( _.isString( param_searchPath ) )
    {
        UserSearchPath = param_searchPath;
    }
    else
    {
        UserSearchPath = '';
	}
			
	return UserSearchPath;
}


function pdb_init( param_searchPath )
{
	return ffi_dbghelp.SymInitializeW( g_hCurrentProcess , help_fixSearchPath( param_searchPath ) , false );
}
exports.init = pdb_init;

function pdb_clean( )
{
	return ffi_dbghelp.SymCleanup( g_hCurrentProcess );
}
exports.clean = pdb_clean;

function pdb_setSearchPath( param_searchPath )
{
	return ffi_dbghelp.SymSetSearchPathW( g_hCurrentProcess , help_fixSearchPath( param_searchPath ) );
}
exports.setSearchPath = pdb_setSearchPath;


function pdb_loadSymbolFile( imageFile )
{
	var nSymbolFileLength = 0;
	var pszSymbolFile = null;
	
	var nDbgFileLength = 0;
	var pszDbgFile = null;
	
	var strSymbolFile = '';
	
	var bFlag = false;
	
	nSymbolFileLength = 260;
    pszSymbolFile = Buffer.alloc( (nSymbolFileLength + 1)* 2 ).fill(0);

    nDbgFileLength = 260;
    pszDbgFile = Buffer.alloc( (nDbgFileLength + 1)* 2 ).fill(0);
	
	bFlag = ffi_dbghelp.SymGetSymbolFileW(
		g_hCurrentProcess ,
		null ,
		imageFile ,
		2 , // pdb 
		pszSymbolFile ,
		nSymbolFileLength ,
		pszDbgFile ,
		nDbgFileLength
	);
		
	strSymbolFile = pszSymbolFile.toString('ucs2');
		
	pszSymbolFile.free();
	pszSymbolFile = null;
	
	pszDbgFile.free();
	pszDbgFile = null;
	
	return strSymbolFile;
}
exports.loadSymbolFile = pdb_loadSymbolFile;

function pdb_loadImage( imageFile , arg_imageName , arg_imageBase , arg_imageSize )
{
	var param_imageName = '';
	var param_imageBase = 0;
	var param_imageSize = 0;
	
	var loadedBase = 0;
	
	if ( _.isString( arg_imageName )  )
	{
		param_imageName = arg_imageName;
	}
	
	if ( arguments.length >= 3 )
	{
		param_imageBase = Number64( arg_imageBase );
	}
	
	if ( arguments.length >= 4 )
	{
		param_imageSize = Number64( arg_imageSize );
	}
	
	
	loadedBase = ffi_dbghelp.SymLoadModule64(
		g_hCurrentProcess ,
		null ,
		imageFile , 
		param_imageName ,
		param_imageBase ,
		param_imageSize
	);

	return loadedBase;
}
exports.loadImage = pdb_loadImage;

function pdb_unloadImage( imageBase )
{
	return ffi_dbghelp.SymUnloadModule64( g_hCurrentProcess , Number64( imageBase ) );
}
exports.unloadImage = pdb_unloadImage;

function pdb_addressToSymbol( symbolAddress )
{
	var MaxNameLength = 1024;
	
	var nSymbol64BufferSize = 0;
	var lpSymbol64 = null;
	var bFlag = false;
	
	var symbolInfo = null;

	var lpDisplacement = Buffer.alloc( 8 ).fill(0);
	
	
	nSymbol64BufferSize = 0x20 + ( MaxNameLength + 1 ) * 2;
	
	lpSymbol64 = Buffer.alloc( nSymbol64BufferSize ).fill( 0 );
	
	// SizeOfStruct
	lpSymbol64.writeUInt32LE( 0x20 , 0x00 );
	
	// MaxNameLength
	lpSymbol64.writeUInt64LE( MaxNameLength , 0x18 );
	
	bFlag = ffi_dbghelp.SymGetSymFromAddr64(
			g_hCurrentProcess ,
			Number64( symbolAddress ) ,
			lpDisplacement ,
			lpSymbol64 
	);
	
	if ( !bFlag )
	{
		lpDisplacement.free();
		lpDisplacement = null;
		
		lpSymbol64.free();
		lpSymbol64 = null;
		
		return null;
	}
			
	symbolInfo = {};
	symbolInfo.name = 	lpSymbol64.toString( 'ascii' , 0x1C );
	symbolInfo.offset = lpDisplacement.readUInt64LE(0);
			
	
	lpDisplacement.free();
	lpDisplacement = null;
	
	lpSymbol64.free();
	lpSymbol64 = null;
	
	return symbolInfo;
}
exports.addressToSymbol = pdb_addressToSymbol;


function pdb_addressToName( symbolAddress )
{
	var symbolInfo = pdb_addressToSymbol( symbolAddress );
	if ( !symbolInfo )
	{
		return '';
	}
	
	if ( symbolInfo.offset.isZero() )
	{
		return symbolInfo.name;
	}
	else
	{
		return sprintf("%s+0x%X", symbolInfo.name , symbolInfo.offset );
	}
}
exports.addressToName = pdb_addressToName;

// get address from name
function pdb_nameToAddress( symbolName )
{
	var MaxNameLength = 1024;
	
	var nSymbol64BufferSize = 0;
	var lpSymbol64 = null;
	var bFlag = false;
	
	var symbolAddress = 0;
	
	nSymbol64BufferSize = 0x20 + ( MaxNameLength + 1 ) * 2;
	
	lpSymbol64 = Buffer.alloc( nSymbol64BufferSize ).fill( 0 );
	
	// SizeOfStruct
	lpSymbol64.writeUInt32LE( 0x20 , 0x00 );
	
	// MaxNameLength
	lpSymbol64.writeUInt64LE( MaxNameLength , 0x18 );
	
	bFlag = ffi_dbghelp.SymGetSymFromName64(
			g_hCurrentProcess ,
			symbolName ,
			lpSymbol64
	);
	if ( !bFlag )
	{
		lpSymbol64.free();
		lpSymbol64 = null;
	
		return Number64(0);
	}
	
	// Address
	symbolAddress = lpSymbol64.readUInt64LE( 0x08 );
	
	lpSymbol64.free();
	lpSymbol64 = null;
	
	return symbolAddress;
	
}
exports.nameToAddress = pdb_nameToAddress;


function main(  )
{

	return 0;
}

if ( !module.parent )
{
	main();
}