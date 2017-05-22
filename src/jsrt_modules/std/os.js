const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");






var ffi_ntdll = ffi.loadAndBatchBind("ntdll.dll" , [

	"NTSTATUS __stdcall RtlGetVersion(_Inout_  void* lpVersionInformation);" 

]);

var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [
	"BOOL __stdcall GlobalMemoryStatusEx(_Inout_ void* lpBuffer);" ,
	
	"BOOL __stdcall GetComputerNameW(_Out_ void* lpBuffer , _Inout_ LPDWORD lpnSize);" ,
	
	"BOOL __stdcall GetVersionExW(_Inout_  void* lpVersionInfo);" ,
	
	"DWORD __stdcall GetTempPathW( _In_  DWORD  nBufferLength , _Out_ void* lpBuffer);" ,
	
	"DWORD  __stdcall GetTickCount();" ,
	
	"ULONGLONG  __stdcall GetTickCount64();" ,

]);

var ffi_advapi32 = ffi.loadAndBatchBind("advapi32.dll" , [

	"BOOL __stdcall GetUserNameW(_Out_ void* lpBuffer , _Inout_ LPDWORD lpnSize);" ,
	


]);


exports.EOL = "\r\n";

function os_arch()
{
	return process.arch;
}
exports.arch = os_arch;


function os_endianness()
{
	return "LE";
}
exports.endianness = os_endianness;


function os_freemem()
{
	var lpBuffer = Buffer.alloc( 64 ).fill( 0 );
	var ullAvailVirtual = 0;

	lpBuffer.writeUInt32LE(64 , 0);
	
	ffi_kernel32.GlobalMemoryStatusEx( lpBuffer );
	
	ullAvailVirtual = lpBuffer.readUInt64LE( 0 , 48);
	
	lpBuffer.free();
	lpBuffer = null;
	
	return ullAvailVirtual;
}
exports.freemem = os_freemem;

function os_totalmem()
{
	var lpBuffer = Buffer.alloc( 64 ).fill( 0 );
	var ullAvailVirtual = 0;

	lpBuffer.writeUInt32LE(64 , 0);
	
	ffi_kernel32.GlobalMemoryStatusEx( lpBuffer );
	
	ullAvailVirtual = lpBuffer.readUInt64LE( 0 , 40);
	
	lpBuffer.free();
	lpBuffer = null;
	
	return ullAvailVirtual;
}
exports.totalmem = os_totalmem;


function os_homedir()
{
	return process.env["USERPROFILE"];
}
exports.homedir = os_homedir;

function os_hostname()
{
	var lpBuffer = Buffer.alloc( 301 * 2 ).fill( 0 );
	var lpnSize = Buffer.alloc( 8 ) .fill( 0 );
	var name = '';
	
	// On input, specifies the size of the buffer, in TCHARs.
	lpnSize.writeUInt32LE( 300 );
	
	ffi_kernel32.GetComputerNameW( lpBuffer , lpnSize );
	
	name = lpBuffer.toString( "ucs2" , 0 );
	
	lpBuffer.free();
	lpBuffer = null;
	
	lpnSize.free();
	lpnSize = null;
	
	return name;
}
exports.hostname = os_hostname;

function os_username()
{
	
	var lpBuffer = Buffer.alloc( 260 * 2 ).fill( 0 );
	var lpnSize = Buffer.alloc( 8 ) .fill( 0 );
	var name = '';
	var needSize = 0;
	var bFlag = false;
	
	// On input, specifies the size of the buffer, in TCHARs.
	lpnSize.writeUInt32LE( 260 );
	
	bFlag = ffi_advapi32.GetUserNameW( lpBuffer , lpnSize );
	
	if ( bFlag )
	{
		name = lpBuffer.toString( "ucs2" , 0 );
		
		lpBuffer.free();
		lpBuffer = null;
		
		
		lpnSize.free();
		lpnSize = null;
	
		return name;
	}
	
	needSize = lpnSize.readUInt32LE();
	if ( 0 == needSize )
	{
		return "";
	}
	
	// re alloc
	lpBuffer.free();
	lpBuffer = null;
	
	lpBuffer = Buffer.alloc( needSize * 2 ).fill( 0 );
	
	// On input, specifies the size of the buffer, in TCHARs.
	lpnSize.writeUInt32LE( needSize );
	
	ffi_advapi32.GetUserNameW( lpBuffer , lpnSize );
	
	name = lpBuffer.toString( "ucs2" , 0 );
	
	lpBuffer.free();
	lpBuffer = null;
	
	lpnSize.free();
	lpnSize = null;
	
	return name;
}
exports.username = os_username;

function os_platform()
{
	return process.platform;
}
exports.platform = os_platform;

function os_release()
{
	var lpVersionInfo = Buffer.alloc( 284 ).fill( 0 );

	// dwOSVersionInfoSize
	lpVersionInfo.writeUInt32LE(284 , 0);
	
	ffi_ntdll.RtlGetVersion( lpVersionInfo );
	
	var dwMajorVersion = lpVersionInfo.readUInt32LE( 4 );
	var dwMinorVersion = lpVersionInfo.readUInt32LE( 8 );
	var dwBuildNumber = lpVersionInfo.readUInt32LE( 12 );
	
	lpVersionInfo.free();
	lpVersionInfo = null;
	
	var releaseText = sprintf("%d.%d.%d" , dwMajorVersion , dwMinorVersion , dwBuildNumber );
	
	return releaseText;
}
exports.release = os_release;

function os_version()
{
	var lpVersionInfo = Buffer.alloc( 284 ).fill( 0 );

	// dwOSVersionInfoSize
	lpVersionInfo.writeUInt32LE(284 , 0);
	
	ffi_ntdll.RtlGetVersion( lpVersionInfo );
	
	var versionInfo = {};
	
	versionInfo.major = lpVersionInfo.readUInt32LE( 0x04 );
	versionInfo.minor = lpVersionInfo.readUInt32LE( 0x08 );
	versionInfo.buildNumber = lpVersionInfo.readUInt32LE( 0x0C );
	
	versionInfo.platformId = lpVersionInfo.readUInt32LE( 0x10 );
	
	versionInfo.CSDVersion = lpVersionInfo.toString( "ucs2" , 0x14 );
	
	versionInfo.servicePackMajor = lpVersionInfo.readUInt16LE( 0x110 );
	
	versionInfo.servicePackMinor = lpVersionInfo.readUInt16LE( 0x112 );
	
	versionInfo.suiteMask = lpVersionInfo.readUInt16LE( 0x114 );
	
	versionInfo.productType = lpVersionInfo.readUInt8( 0x116 );
	
	lpVersionInfo.free();
	lpVersionInfo = null;
	
	return versionInfo;
}
exports.version = os_version;


function os_tmpdir()
{
	var lpBuffer = Buffer.alloc( 261 * 2 ).fill(0);

	ffi_kernel32.GetTempPathW( 260 , lpBuffer );
	
	var pathText = lpBuffer.toString( "ucs2" );
	
	lpBuffer.free();
	lpBuffer = null;

	return pathText;
}
exports.tmpdir = os_tmpdir;

function os_type()
{
	return "Windows_NT";
}
exports.type = os_type;

function os_uptime()
{
	if ( ffi_kernel32.GetTickCount64 )
	{
		return ffi_kernel32.GetTickCount64();
	}
	else
	{
		return Number64( ffi_kernel32.GetTickCount() );
	}
}
exports.uptime = os_uptime;



function main(  )
{

	return 0;
}

if ( !module.parent )
{
	main();
}