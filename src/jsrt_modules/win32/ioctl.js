const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");


var ffi_ntdll = ffi.loadAndBatchBind("ntdll.dll" , [

	"NTSTATUS WINAPI NtDeviceIoControlFile(_In_  HANDLE FileHandle , _In_  HANDLE Event , _In_  IO_APC_ROUTINE*  ApcRoutine , _In_  PVOID ApcContext , _Out_ IO_STATUS_BLOCK* IoStatusBlock , _In_  ULONG IoControlCode , _In_  PVOID InputBuffer , _In_  ULONG InputBufferLength ,  _Out_ PVOID OutputBuffer , _In_  ULONG OutputBufferLength);"  ,
	
	"NTSTATUS WINAPI NtClose(_In_ HANDLE Handle);" ,
	
	"NTSTATUS WINAPI NtOpenFile( _Out_ PHANDLE FileHandle , _In_  ACCESS_MASK DesiredAccess , _In_  OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock ,  _In_  ULONG ShareAccess , _In_  ULONG OpenOptions );" ,
	
	"NTSTATUS WINAPI NtCreateFile( _Out_  PHANDLE FileHandle , _In_ ACCESS_MASK  DesiredAccess , _In_ OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock , _In_opt_ LARGE_INTEGER*     AllocationSize , _In_ ULONG FileAttributes , _In_ ULONG ShareAccess , _In_ ULONG CreateDisposition , _In_ ULONG CreateOptions , _In_ PVOID EaBuffer , _In_ ULONG EaLength );" ,
	
]);

function CTL_CODE(DeviceType, FunctionIndex, Method, Access)
{
	return ( ((DeviceType) << 16) | ((Access) << 14) | ((FunctionIndex) << 2) | (Method) );
}

function METHOD_FROM_CTL_CODE(ctrlCode)
{
	return ((ctrlCode & 3))
}

function DEVICE_TYPE_FROM_CTL_CODE(ctrlCode)
{
	return (((ctrlCode & 0xffff0000)) >> 16);
}


function allocAndInitializeObjectAttributes( ObjectName , Attributes , RootDirectory , SecurityDescriptor )
{
	var lpObjectArributes = null;
	
	
	
	return lpObjectArributes;
}



function openDevice( ObjectName , arg_options )
{
	var param_options = {};
	var hDevice = Number64(0);
	
	assert( _.isString( arguments[0] ) , "invalid ObjectName" );
	
	if ( arguments.length >= 2 )
	{
		if ( arguments[1] )
		{
			assert( _.isObject( arguments[1] ) , "invalid arguments 1" );
			param_options = arguments[1];
		}
	}
	
	var param_lpFileHandle = Buffer.alloc( 8 ).fill(0);
	var param_DesiredAccess = 0x80; // FILE_READ_ATTRIBUTES
	var param_lpObjectAttributes = null;
	var param_IoStatusBlock = null;
	var param_ShareAccess = 0;
	var param_OpenOptions = 0;
	
	
	do
	{
		
		
		
	}while(false);
	
	if ( param_lpFileHandle )
	{
		param_lpFileHandle.free();
		param_lpFileHandle = null;
	}
	
	if ( param_lpObjectAttributes )
	{
		param_lpObjectAttributes.free();
		param_lpObjectAttributes = null;
	}
	
	if ( param_IoStatusBlock )
	{
		param_IoStatusBlock.free();
		param_IoStatusBlock = null;
	}
	
	
	return hDevice;
}
exports.openDevice = openDevice;



function main(  )
{
	
	

	return 0;
}

if ( !module.parent )
{
	main();
}