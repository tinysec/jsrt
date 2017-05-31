const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");

var ffi_kernel32 = null;
var g_autoName = '';

if ( process.OSMajorVersion > 5 )
{
	g_autoName = 'kernelbase.dll';
}
else
{
	g_autoName = 'kernel32.dll';
}

ffi_kernel32 = ffi.loadAndBatchBind( g_autoName , [

	"BOOL WINAPI GetFileVersionInfoA(  _In_       LPCSTR lptstrFilename ,  DWORD   dwHandle , _In_       DWORD   dwLen , _Out_      LPVOID  lpData);" , 
	
	"BOOL WINAPI GetFileVersionInfoW(  _In_       LPCWSTR lptstrFilename ,  DWORD   dwHandle , _In_       DWORD   dwLen , _Out_      LPVOID  lpData);" , 
	
	"DWORD WINAPI GetFileVersionInfoSizeA( _In_      LPCSTR lptstrFilename , _Out_opt_ LPDWORD lpdwHandle);" ,
	
	"DWORD WINAPI GetFileVersionInfoSizeW( _In_      LPCWSTR lptstrFilename , _Out_opt_ LPDWORD lpdwHandle);" ,
	
	"BOOL WINAPI VerQueryValueA( _In_  LPCVOID pBlock , _In_  LPCSTR lpSubBlock , _Out_ LPVOID  *lplpBuffer , _Out_ PUINT   puLen );" , 
	
	"BOOL WINAPI VerQueryValueW( _In_  LPCVOID pBlock , _In_  LPCWSTR lpSubBlock , _Out_ LPVOID  *lplpBuffer , _Out_ PUINT   puLen );"
	
]);

var VER_KEYS = [
    "Comments" ,
    "CompanyName" ,
    "FileDescription" ,
    "FileVersion" ,
    "InternalName" ,
    "LegalCopyright" ,
    "LegalTrademarks",
    "OriginalFilename" ,
    "ProductName" ,
    "ProductVersion" ,
    "PrivateBuild",
    "SpecialBuild"
];


function queryFixFileInfo( lpAnsiVersionInfo , lpWideVersionInfo )
{
	var fixedFileInfo = null;
	
	var ppBlockData = Buffer.alloc( 8 ).fill(0);
	
	var lpBlockDataAddress = null;
	
	var lpBlockData = null;
	
	var lpBlockDataLength = Buffer.alloc( 8 ).fill(0);
	var blockDataLength = 0;
	
	var blockData = null;
	
	var wideFlag = false;
	var ansiFlag = false;
	
	var queryName = '\\';
	
	do
	{
		if ( lpWideVersionInfo )
		{
			wideFlag = ffi_kernel32.VerQueryValueW( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
		}
		
		if ( !wideFlag )
		{
			if ( lpWideVersionInfo )
			{
				ppBlockData.fill(0);
				lpBlockDataLength.fill(0);
				ansiFlag = ffi_kernel32.VerQueryValueA( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
			}
		}
		
		if ( (!wideFlag) && (!ansiFlag) )
		{
			break;
		}
		
		blockDataLength = lpBlockDataLength.readUInt32LE(0);
		if ( 0 == blockDataLength )
		{
			break;
		}
		
		lpBlockData = Buffer.attachUnsafe( ppBlockData.readPointer(0) , blockDataLength );
		
		blockData = {};
		
		blockData.FileVersionHigh = lpBlockData.readUInt32LE( 0x04 );
		
		blockData.FileVersionLow = lpBlockData.readUInt32LE( 0x08 );
		
		blockData.ProductVersionHigh = lpBlockData.readUInt32LE( 0x0C );
		
		blockData.ProductVersionLow = lpBlockData.readUInt32LE( 0x10 );
		
		blockData.FileFlagsMask = lpBlockData.readUInt32LE( 0x14 );
		
		blockData.FileFlags = lpBlockData.readUInt32LE( 0x18 );
		
		blockData.FileOS = lpBlockData.readUInt32LE( 0x1C );
		
		blockData.FileType = lpBlockData.readUInt32LE( 0x20 );
		
		blockData.FileSubType = lpBlockData.readUInt32LE( 0x24 );
		
		blockData.FileDateHigh = lpBlockData.readUInt32LE( 0x28 );
		
		blockData.FileDateLow = lpBlockData.readUInt32LE( 0x2C );
		
	}while(false);
	
	if ( ppBlockData )
	{
		ppBlockData.free();
		ppBlockData = null;
	}
	
	if ( lpBlockDataLength )
	{
		lpBlockDataLength.free();
		lpBlockDataLength = null;
	}
	
	return blockData;
}

function queryTranslationInfo( lpAnsiVersionInfo , lpWideVersionInfo )
{
	var fixedFileInfo = null;
	
	var ppBlockData = Buffer.alloc( 8 ).fill(0);
	
	var lpBlockDataAddress = null;
	
	var lpBlockData = null;
	
	var lpBlockDataLength = Buffer.alloc( 8 ).fill(0);
	var blockDataLength = 0;
	
	var blockData = null;
	
	var wideFlag = false;
	var ansiFlag = false;
	
	var queryName = '\\VarFileInfo\\Translation';
	
	do
	{
		if ( lpWideVersionInfo )
		{
			wideFlag = ffi_kernel32.VerQueryValueW( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
		}
		
		if ( !wideFlag )
		{
			if ( lpWideVersionInfo )
			{
				ppBlockData.fill(0);
				lpBlockDataLength.fill(0);
				ansiFlag = ffi_kernel32.VerQueryValueA( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
			}
		}
		
		if ( (!wideFlag) && (!ansiFlag) )
		{
			break;
		}
		
		blockDataLength = lpBlockDataLength.readUInt32LE(0);
		if ( 0 == blockDataLength )
		{
			break;
		}
		
		lpBlockData = Buffer.attachUnsafe( ppBlockData.readPointer(0) , blockDataLength );
		
		blockData = {};
		
		blockData.langID = lpBlockData.readUInt16LE( 0x00 );
		
		blockData.charset = lpBlockData.readUInt16LE( 0x02 );
		
		
	}while(false);
	
	if ( ppBlockData )
	{
		ppBlockData.free();
		ppBlockData = null;
	}
	
	if ( lpBlockDataLength )
	{
		lpBlockDataLength.free();
		lpBlockDataLength = null;
	}
	
	return blockData;
}

function queryVarFileInfo( lpAnsiVersionInfo , lpWideVersionInfo , translationInfo , keyName )
{
	var fixedFileInfo = null;
	
	var ppBlockData = Buffer.alloc( 8 ).fill(0);
	
	var lpBlockDataAddress = null;
	
	var lpBlockData = null;
	
	var lpBlockDataLength = Buffer.alloc( 8 ).fill(0);
	var blockDataLength = 0;
	var blockDataSize = 0;
	
	var blockData = null;
	
	var wideFlag = false;
	var ansiFlag = false;
	
	var queryName = '\\';
	
	do
	{
		queryName = sprintf('\\StringFileInfo\\%04X%04X\\%s' , 
                translationInfo.langID ,
                translationInfo.charset ,
                keyName
        );
		
		if ( lpWideVersionInfo )
		{
			wideFlag = ffi_kernel32.VerQueryValueW( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
		}
		
		if ( !wideFlag )
		{
			if ( lpWideVersionInfo )
			{
				ppBlockData.fill(0);
				lpBlockDataLength.fill(0);
				ansiFlag = ffi_kernel32.VerQueryValueA( lpWideVersionInfo , queryName , ppBlockData , lpBlockDataLength );
			}
		}
		
		if ( (!wideFlag) && (!ansiFlag) )
		{
			break;
		}
		
		blockDataLength = lpBlockDataLength.readUInt32LE(0);
		
		if ( 0 == blockDataLength )
		{
			break;
		}
		
		lpBlockData = Buffer.attachUnsafe( ppBlockData.readPointer(0) , blockDataLength );
		
		blockData = lpBlockData.toString( translationInfo.charset );
	
	}while(false);
	
	if ( ppBlockData )
	{
		ppBlockData.free();
		ppBlockData = null;
	}
	
	if ( lpBlockDataLength )
	{
		lpBlockDataLength.free();
		lpBlockDataLength = null;
	}
	
	return blockData;
}

function queryFileVersion( arg_filename )
{
	var wideVersionInfoSize = 0;
	var ansiVersionInfoSize = 0;
	
	var lpdwHandle = Buffer.alloc(8).fill(0);
	
	var lpWideVersionInfo = null;
	var lpAnsiVersionInfo = null;
	
	var wideFlag = false;
	var ansiFlag = false;
	
	var versionInfo = null;
	
	var fixedFileInfo = null;
	var translationInfo = null;
	
	var varFileInfo = null;
	var singleInfo = null;
	
	
	do
	{
		assert( _.isString(arg_filename) , "arg_filename must be string" );
		
		// wide
		lpdwHandle.fill(0);
		wideVersionInfoSize = ffi_kernel32.GetFileVersionInfoSizeW( arg_filename , lpdwHandle );
		if ( 0 != wideVersionInfoSize )
		{
			lpWideVersionInfo = Buffer.alloc( wideVersionInfoSize ).fill(0);
			
			wideFlag = ffi_kernel32.GetFileVersionInfoW( arg_filename , 0 , wideVersionInfoSize , lpWideVersionInfo );
		}
		
		// asni
		lpdwHandle.fill(0);
		ansiVersionInfoSize = ffi_kernel32.GetFileVersionInfoSizeA( arg_filename , lpdwHandle );
		if ( 0 != ansiVersionInfoSize )
		{
			lpAnsiVersionInfo = Buffer.alloc( ansiVersionInfoSize ).fill(0);
			
			ansiFlag = ffi_kernel32.GetFileVersionInfoA( arg_filename , 0 , ansiVersionInfoSize , lpAnsiVersionInfo );
		}
		
		if ( ( !wideFlag) && ( !ansiFlag) )
		{
			break;
		}
		
		fixedFileInfo = queryFixFileInfo(
				ansiFlag ? lpAnsiVersionInfo : null ,
				wideFlag ? lpWideVersionInfo : null
		);
		
		if ( !fixedFileInfo )
		{
			break;
		}
		
		translationInfo = queryTranslationInfo(
				ansiFlag ? lpAnsiVersionInfo : null ,
				wideFlag ? lpWideVersionInfo : null
		);
		
		if ( translationInfo )
		{
			varFileInfo = {};
			
			_.each( VER_KEYS , function(item) 
			{
				singleInfo = queryVarFileInfo( 
					ansiFlag ? lpAnsiVersionInfo : null ,
					wideFlag ? lpWideVersionInfo : null ,
					translationInfo ,
					item 
				);
					
				if ( singleInfo )
				{
					varFileInfo[ item ] = singleInfo;
				}
			});
		}
		
		// output
		versionInfo = {};
		versionInfo.fixedInfo = fixedFileInfo;
		
		if ( translationInfo )
		{
			versionInfo.translationInfo = translationInfo;
		}
		
		if ( varFileInfo )
		{
			versionInfo.varInfo = varFileInfo;
		}
		
	}while(false);
	
	if ( lpWideVersionInfo )
	{
		lpWideVersionInfo.free();
		lpWideVersionInfo = null;
	}
	
	if ( lpAnsiVersionInfo )
	{
		lpAnsiVersionInfo.free();
		lpAnsiVersionInfo = null;
	}
	
	if ( lpdwHandle )
	{
		lpdwHandle.free();
		lpdwHandle = null;
	}
	
	return versionInfo;
}
module.exports = queryFileVersion;

function main(  )
{
	return 0;
}

if ( !module.parent )
{
	main();
}