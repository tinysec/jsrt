const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

const path = require("path");

const ffi = require("ffi");

const win32_native = require("win32/native");


var ffi_ntdll = ffi.loadAndBatchBind("ntdll.dll" , [

	"NTSTATUS WINAPI NtDeviceIoControlFile(_In_  HANDLE FileHandle , _In_  HANDLE Event , _In_  IO_APC_ROUTINE*  ApcRoutine , _In_  PVOID ApcContext , _Out_ IO_STATUS_BLOCK* IoStatusBlock , _In_  ULONG IoControlCode , _In_  PVOID InputBuffer , _In_  ULONG InputBufferLength ,  _Out_ PVOID OutputBuffer , _In_  ULONG OutputBufferLength);"  ,
	
	"NTSTATUS WINAPI NtClose(_In_ HANDLE Handle);" ,
	
	"NTSTATUS WINAPI NtOpenFile( _Out_ PHANDLE FileHandle , _In_  ACCESS_MASK DesiredAccess , _In_  OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock ,  _In_  ULONG ShareAccess , _In_  ULONG OpenOptions );" ,
	
	"NTSTATUS WINAPI NtCreateFile( _Out_  PHANDLE FileHandle , _In_ ACCESS_MASK  DesiredAccess , _In_ OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock , _In_opt_ LARGE_INTEGER*     AllocationSize , _In_ ULONG FileAttributes , _In_ ULONG ShareAccess , _In_ ULONG CreateDisposition , _In_ ULONG CreateOptions , _In_ PVOID EaBuffer , _In_ ULONG EaLength );" ,
	
]);

function CTL_CODE(DeviceType, FunctionIndex, Method, Access)
{
	var param_DeviceType = Number32( DeviceType ).shiftLeft(16);
	var param_Access = Number32( Access ).shiftLeft(14);
	var param_FunctionIndex = Number32( FunctionIndex ).shiftLeft(2);
	
	var IoControlCode = Number32( param_DeviceType );
	
	IoControlCode.or( param_Access ).or( param_FunctionIndex).or( Method );

	return IoControlCode;
}
exports.CTL_CODE = CTL_CODE;

function METHOD_FROM_CTL_CODE(ctrlCode)
{
	var IoControlCode = Number32( ctrlCode );
	
	IoControlCode.and( 3 );
	
	return IoControlCode.toUInt8();
}
exports.METHOD_FROM_CTL_CODE = METHOD_FROM_CTL_CODE;

function DEVICE_TYPE_FROM_CTL_CODE(ctrlCode)
{
	var IoControlCode = Number32( ctrlCode );
	
	IoControlCode.and( 0xffff0000 );
	IoControlCode.shiftRight( 16 );
	
	return IoControlCode.toUInt16LE();
}
exports.DEVICE_TYPE_FROM_CTL_CODE = DEVICE_TYPE_FROM_CTL_CODE;

exports.openDevice = win32_native.openObject;
exports.closeDevice = win32_native.closeHandle;

function deviceIoControl( hDevice , IoControlCode , arg_input , arg_output , IoStatusBlock )
{
	var param_lpIoStatusBlock = Buffer.alloc( 0x10 );
	var Status = 0;

	assert( Number64.isNumber64(hDevice) , "invalid device handle" );
	
	assert(  ( Number64.isNumber64(IoControlCode) || Number32.isNumber32(IoControlCode)  || ( _.isNumber(IoControlCode) ) ) , "invalid IoControlCode" );
	
	if ( arg_input )
	{
		assert( Buffer.isBuffer(arg_input) , "invalid input" );
	}
	
	if ( arg_output )
	{
		assert( Buffer.isBuffer(arg_output) , "invalid output" );
	}
	
	Status = ffi_ntdll.NtDeviceIoControlFile(
			hDevice ,
			null ,
			null ,
			null ,
			param_lpIoStatusBlock ,
			IoControlCode ,
			arg_input ? arg_input : null ,
			arg_input ? arg_input.length : 0 ,
			arg_output ? arg_output : null ,
			arg_output ? arg_output.length : 0
	);
	
	if ( IoStatusBlock )
	{
		IoStatusBlock.Status = param_lpIoStatusBlock.readUInt32LE(0);
		IoStatusBlock.Pointer = param_lpIoStatusBlock.readPointer(0);
		
		if ( "x64" == process.arch )
		{
			IoStatusBlock.Information = param_lpIoStatusBlock.readULONG_PTR(8);
		}
		else
		{
			IoStatusBlock.Information = param_lpIoStatusBlock.readULONG_PTR(8);
		}
	}
	
	param_lpIoStatusBlock.free();
	param_lpIoStatusBlock = null;
	
	return Status;
}
exports.deviceIoControl = deviceIoControl;

// Number64.lessThanSigned32(Status , 0);

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}