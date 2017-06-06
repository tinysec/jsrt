const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");

var ffi_ntdll = ffi.loadAndBatchBind("ntdll.dll" , [

	
	"NTSTATUS WINAPI NtDeviceIoControlFile(_In_  HANDLE FileHandle , _In_  HANDLE Event , _In_  IO_APC_ROUTINE*  ApcRoutine , _In_  PVOID ApcContext , _Out_ IO_STATUS_BLOCK* IoStatusBlock , _In_  ULONG IoControlCode , _In_  PVOID InputBuffer , _In_  ULONG InputBufferLength ,  _Out_ PVOID OutputBuffer , _In_  ULONG OutputBufferLength);"  ,
	
	"NTSTATUS WINAPI NtClose(_In_ HANDLE Handle);" ,
	
	"NTSTATUS WINAPI NtOpenFile( _Out_ PHANDLE FileHandle , _In_  ACCESS_MASK DesiredAccess , _In_  OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock ,  _In_  ULONG ShareAccess , _In_  ULONG OpenOptions );" ,
	
	"NTSTATUS WINAPI NtCreateFile( _Out_  PHANDLE FileHandle , _In_ ACCESS_MASK  DesiredAccess , _In_ OBJECT_ATTRIBUTES* ObjectAttributes , _Out_ IO_STATUS_BLOCK*   IoStatusBlock , _In_opt_ LARGE_INTEGER*     AllocationSize , _In_ ULONG FileAttributes , _In_ ULONG ShareAccess , _In_ ULONG CreateDisposition , _In_ ULONG CreateOptions , _In_ PVOID EaBuffer , _In_ ULONG EaLength );" 
	
]);


function string2UNICODE_STRING( arg_string  )
{
	assert( _.isString( arguments[0] )  , "invalid arguments 0");

	var lpUnicodeString = null;
	var bufferLength = 0;
	
	var bufferAddress = null;
	
	if ( "x64" == process.arch )
	{
		bufferLength = 0x10 + ( arg_string.length + 1 ) * 2;
	}
	else
	{
		bufferLength = 0x08 + ( arg_string.length  + 1) * 2;
	}
	
	lpUnicodeString = Bufer.alloc( bufferLength ).fill(0);
	
	if ( 0 == arg_string.length )
	{
		// Length 
		lpUnicodeString.writeUInt16LE( 0 , 0x00 );
			
		// MaximumLength
		lpUnicodeString.writeUInt16LE( 0 , 0x02 );
	}
	else
	{
		// Length 
		lpUnicodeString.writeUInt16LE( arg_string.length * 2 , 0x00 );
			
		// MaximumLength
		lpUnicodeString.writeUInt16LE( ( arg_string.length + 1 ) * 2 , 0x02 );
		
	}
		
	if ( "x64" == process.arch )
	{
		// Pointer
		bufferAddress = Number64( lpUnicodeString.address );
		bufferAddress.add( 0x10 );
		
		lpUnicodeString.writePointer( bufferAddress , 0x08);
		
		
		// write String
		if ( 0 != arg_string.length )
		{
			lpUnicodeString.write( arg_string , 0x10 , arg_string.length * 2 , "ucs2" );
		}
	}
	else
	{
		// Pointer
		bufferAddress = Number64( lpUnicodeString.address );
		bufferAddress.add( 0x08 );
		
		lpUnicodeString.writePointer( bufferAddress , 0x04);
		
		
		// write String
		if ( 0 != arg_string.length )
		{
			lpUnicodeString.write( arg_string , 0x10 , arg_string.length * 2 , "ucs2" );
		}
	}
	
	return lpUnicodeString;
}
exports.string2UNICODE_STRING = string2UNICODE_STRING;


function string2ANSI_STRING( arg_string  )
{
	assert( _.isString( arguments[0] )  , "invalid arguments 0");

	var lpAnsiString = null;
	var bufferLength = 0;
	
	var bufferAddress = null;
	
	if ( "x64" == process.arch )
	{
		bufferLength = 0x10 + ( arg_string.length + 1 ) * 1;
	}
	else
	{
		bufferLength = 0x08 + ( arg_string.length  + 1) * 1;
	}
	
	lpAnsiString = Bufer.alloc( bufferLength ).fill(0);
	
	
	if ( 0 == arg_string.length )
	{
		// Length 
		lpAnsiString.writeUInt16LE( 0 , 0x00 );
		
		// MaximumLength
		lpAnsiString.writeUInt16LE( 0 , 0x02 );
	}
	else
	{
		// Length 
		lpAnsiString.writeUInt16LE( arg_string.length * 1 , 0x00 );
			
		// MaximumLength
		lpAnsiString.writeUInt16LE( ( arg_string.length + 1 ) * 1 , 0x02 );
		
	}
	
	if ( "x64" == process.arch )
	{
		// Pointer
		bufferAddress = Number64( lpAnsiString.address );
		bufferAddress.add( 0x10 );
		
		lpAnsiString.writePointer( bufferAddress , 0x08);
		
		
		// write String
		if ( 0 != arg_string.length )
		{
			lpAnsiString.write( arg_string , 0x10 , arg_string.length * 2 , "ascii" );
		}
	}
	else
	{
		// Pointer
		bufferAddress = Number64( lpAnsiString.address );
		bufferAddress.add( 0x08 );
		
		lpAnsiString.writePointer( bufferAddress , 0x04);
		
		
		// write String
		if ( 0 != arg_string.length )
		{
			lpAnsiString.write( arg_string , 0x10 , arg_string.length * 2 , "ascii" );
		}
	}
	
	return lpAnsiString;
}
exports.string2ANSI_STRING = string2ANSI_STRING;


function allocAndInitializeObjectAttributes( ObjectName , Attributes , RootDirectory , SecurityDescriptor )
{
	var lpObjectArributes = null;
	var ObjectArributesBufferSize = 0;
	
	var ObjectNameAddress = null;
	var lpObjectNameBuffer = null;
	
	var ObjectName_BufferAddress = null;
	
	if ( "x64" == process.arch )
	{
		ObjectArributesBufferSize = 0x30 + 0x10 + ( ObjectName.length + 1 ) * 2;
		
		lpObjectArributes = Buffer.alloc( ObjectArributesBufferSize ).fill(0);
		
		// Length 
		lpObjectArributes.writeUInt32LE( 0x30 , 0x00 );
		
		// RootDirectory
		lpObjectArributes.writePointer( RootDirectory , 0x08 );
		
		// ObjectName
		ObjectNameAddress = Number64( lpObjectArributes.address );
		ObjectNameAddress.add( 0x30);
		
		lpObjectArributes.writePointer( ObjectNameAddress , 0x10 );
		
		// Attributes 
		lpObjectArributes.writeUInt32LE( Attributes , 0x18 );
		
		// SecurityDescriptor 
		lpObjectArributes.writePointer( SecurityDescriptor , 0x20 );
	}
	else
	{
		ObjectArributesBufferSize = 0x18 + 0x08 + ( ObjectName.length + 1 ) * 2;
		
		lpObjectArributes = Buffer.alloc( ObjectArributesBufferSize ).fill(0);
		
		// Length 
		lpObjectArributes.writeUInt32LE( 0x18 , 0x00 );
		
		// RootDirectory
		lpObjectArributes.writePointer( RootDirectory , 0x04 );
		
		// ObjectName
		ObjectNameAddress = Number64( lpObjectArributes.address );
		ObjectNameAddress.add( 0x18);
		
		lpObjectArributes.writePointer( ObjectNameAddress , 0x08 );
		
		// Attributes 
		lpObjectArributes.writeUInt32LE( Attributes , 0x0C );
		
		// SecurityDescriptor 
		lpObjectArributes.writePointer( SecurityDescriptor , 0x10 );
	}
	
	// set UNICODE_STRING
	if ( "x64" == process.arch )
	{
		lpObjectNameBuffer = Buffer.attachUnsafe( ObjectNameAddress , 0x10 + ( ObjectName.length + 1 ) * 2 );
	}
	else
	{
		lpObjectNameBuffer = Buffer.attachUnsafe( ObjectNameAddress , 0x08 + ( ObjectName.length + 1 ) * 2 );
	}

	// Length
	lpObjectNameBuffer.writeUInt16LE( ObjectName.length * 2 , 0x00 );
		
	// MaximumLength
	lpObjectNameBuffer.writeUInt16LE( ( ObjectName.length + 1 ) * 2 , 0x02 );
	
	if ( "x64" == process.arch )
	{
		lpObjectNameBuffer.writePointer( ObjectName.length * 2 , 0x00 );
		
		ObjectName_BufferAddress = Number64( ObjectNameAddress );
		ObjectName_BufferAddress.add( 0x10 );
		
		// Buffer
		lpObjectNameBuffer.writePointer( ObjectName_BufferAddress , 0x08 );
		
		lpObjectNameBuffer.write( ObjectName , 0x10 , ObjectName.length * 2 , "ucs2" );
	}
	else
	{
		ObjectName_BufferAddress = Number64( ObjectNameAddress );
		ObjectName_BufferAddress.add( 0x08 );
		
		// Buffer
		lpObjectNameBuffer.writePointer( ObjectName_BufferAddress , 0x04 );
		
		lpObjectNameBuffer.write( ObjectName , 0x08 , ObjectName.length * 2 , "ucs2" );
	}
	
	ObjectNameAddress = null;
	lpObjectNameBuffer = null;
	ObjectName_BufferAddress = null;
	
	return lpObjectArributes;
}
exports.allocAndInitializeObjectAttributes = allocAndInitializeObjectAttributes;

function openObject( ObjectName , arg_options )
{
	var param_options = {};
	var hDevice = Number64(0);
	
	assert( _.isString( arguments[0] ) , "invalid ObjectName" );
	assert( ( 0 != arguments[0].length ) , "invalid ObjectName" );
	
	if ( arguments.length >= 2 )
	{
		if ( arguments[1] )
		{
			assert( _.isObject( arguments[1] ) , "invalid arguments 1" );
			param_options = arguments[1];
		}
	}
	
	var param_lpFileHandle = Buffer.alloc( 8 ).fill(0);
	var param_DesiredAccess = 0; // 
	var param_lpObjectAttributes = null;
	var param_IoStatusBlock = Buffer.alloc( 0x10 );
	var param_ShareAccess = 0; 
	var param_OpenOptions = 0;
	
	var ObjectAttributes_Attributes  = 0;
	var ObjectAttributes_RootDirectory = null;
	
	var Status = 0;
	
	
	do
	{
		
		
		if ( !_.isUndefined( param_options.ignoreCase ) )
		{
			if ( param_options.ignoreCase )
			{
				ObjectAttributes_Attributes = base.SetFlag( ObjectAttributes_Attributes , 0x40 );
			}
		}
		else
		{
			ObjectAttributes_Attributes = 0x40; // OBJ_CASE_INSENSITIVE
		}
		
		if ( !_.isUndefined( param_options.desiredAccess ) )
		{
			param_DesiredAccess = param_options.desiredAccess;
		}
		else
		{
			param_DesiredAccess = 0x80; //FILE_READ_ATTRIBUTES
		}
		
		if ( !_.isUndefined( param_options.shareAccess ) )
		{
			param_ShareAccess = param_options.shareAccess;
		}
		else
		{
			param_ShareAccess = 1; // FILE_SHARE_READ
		}
		
		if ( !_.isUndefined( param_options.openOption ) )
		{
			param_OpenOptions = param_options.openOption;
		}
	
		param_lpObjectAttributes = allocAndInitializeObjectAttributes( 
						ObjectName ,
						ObjectAttributes_Attributes ,
						ObjectAttributes_RootDirectory ,
						null
		);
				
						
		Status = ffi_ntdll.NtOpenFile(
				param_lpFileHandle ,
				param_DesiredAccess ,
				param_lpObjectAttributes , 
				param_IoStatusBlock ,
				param_ShareAccess ,
				param_OpenOptions
		);
		
		base.setLastError( Status );
		
		hDevice = param_lpFileHandle.readPointer(0);
		
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
	
	if ( param_lpObjectAttributes )
	{
		param_lpObjectAttributes.free();
		param_lpObjectAttributes = null;
	}

	return hDevice;
}
exports.openObject = openObject;


function closeHandle( hHandle )
{
	return ffi_ntdll.NtClose( hHandle );
}
exports.closeHandle = closeHandle;



function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}