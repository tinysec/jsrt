// for authorization
const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

const path = require("path");

const ffi = require("ffi");


var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [
	
	"BOOL WINAPI CloseHandle(  _In_ HANDLE hObject );" ,
	
	"HANDLE WINAPI GetCurrentProcess();"

]);

var ffi_advapi32 = ffi.loadAndBatchBind("advapi32.dll" , [

	"BOOL WINAPI AdjustTokenPrivileges( _In_  HANDLE TokenHandle , _In_ BOOL DisableAllPrivileges , _In_opt_ TOKEN_PRIVILEGES* NewState , _In_ DWORD BufferLength , _Out_opt_ TOKEN_PRIVILEGES* PreviousState , _Out_opt_ PDWORD ReturnLength);" ,
	
	"BOOL WINAPI LookupPrivilegeValueW(_In_opt_ LPCWSTR lpSystemName , _In_ LPCWSTR lpName , _Out_ void* lpLuid);" ,
	
	"BOOL WINAPI OpenProcessToken( _In_  HANDLE  ProcessHandle , _In_  DWORD   DesiredAccess , _Out_ PHANDLE TokenHandle);" 
	
]);

function enableProcessPrivilege( arg_hProcess , arg_Privilege , arg_Enable )
{
	var param_hProcess = null;
	var param_privilege = '';
	var param_enable = true;
	
	assert(  ( arguments.length >= 1 ) , "invalid arguments" );
	
	

	var lpLuid = null;
	var lpTokenHandle = null;
	var hToken = null;
	var bFlag = false;
	var bFinalFlag = false;
	var lpLuidAndAttributes = null;
	var lpTokenPrivileges = null;
	
	
	do
	{
		if ( 1 == arguments.length )
		{
			param_hProcess = Number64(-1);
			
			assert( _.isString( arguments[0] ) , "invalid arg_Privilege " );
			
			param_privilege = arguments[0];
		}
		else if ( 2 == arguments.length )
		{
			if ( _.isString( arguments[0] ) )
			{
				param_hProcess = Number64(-1);
				
				param_privilege = arguments[0];
				
				param_enable = arguments[1] || false;
			}
			else if ( _.isNumber( arguments[0] ) )
			{
				param_hProcess = Number64( arguments[0]  );
				
				assert( _.isString( arguments[1] ) , "invalid arg_Privilege " );
				
				param_privilege = arguments[1];
			}
			else if ( Number64.isNumber64( arguments[0] ) )
			{
				param_hProcess = Number64( arguments[0]  );
				
				assert( _.isString( arguments[1] ) , "invalid arg_Privilege " );
				
				param_privilege = arguments[1];
			}
			else if ( _.isNull( arguments[0] ) )
			{
				param_hProcess = Number64( arguments[0]  );
				
				assert( _.isString( arguments[1] ) , "invalid arg_Privilege " );
				
				param_privilege = arguments[1];
			}
		}
		else if ( 3 == arguments.length )
		{
			param_hProcess = Number64( arguments[0]  );
			
			assert( _.isString( arguments[1] ) , "invalid arg_Privilege " );
			param_privilege = arguments[1];
			
			param_enable = arguments[2] || false;
		}
		
		lpTokenHandle = Buffer.alloc( 8 ).fill(0);
		
		bFlag = ffi_advapi32.OpenProcessToken( param_hProcess , 0x20 , lpTokenHandle );
		if ( !bFlag )
		{
			break;
		}
		
		hToken = lpTokenHandle.readPointer( 0 );
		if ( hToken.isZero() )
		{
			break;
		}
		
		lpLuid = Buffer.alloc( 8 ).fill(0);
		
		bFlag = ffi_advapi32.LookupPrivilegeValueW( 
				null , 
				param_privilege , 
				lpLuid
		);
		if ( !bFlag )
		{
			break;
		}
		
		lpTokenPrivileges = Buffer.alloc( 0x10 ).fill(0);
		
		// PrivilegeCount
		lpTokenPrivileges.writeUInt32LE( 1 , 0x00 );
		
		// Privileges.Luid.LowPart
		lpTokenPrivileges.writeUInt32LE( lpLuid.readUInt32LE(0) , 0x04 );
		
		// Privileges.Luid.HighPart
		lpTokenPrivileges.writeInt32LE( lpLuid.readInt32LE(4) , 0x08 );
		
		if ( param_enable )
		{
			lpTokenPrivileges.writeUInt32LE( 2 , 0x0C ); // SE_PRIVILEGE_ENABLED
		}

		bFinalFlag = ffi_advapi32.AdjustTokenPrivileges( 
					hToken ,
					false , 
					lpTokenPrivileges ,
					0x10 ,
					null ,
					null
				);

	}while(false);
	
	
	if ( lpLuid )
	{
		lpLuid.free();
		lpLuid = null;
	}
	
	if ( lpTokenHandle )
	{
		lpTokenHandle.free();
		lpTokenHandle = null;
	}
	
	if ( hToken )
	{
		ffi_kernel32.CloseHandle( hToken );
		hToken = null;
	}
	
	if ( lpTokenPrivileges )
	{
		lpTokenPrivileges.free();
		lpTokenPrivileges = null;
	}
	
	return bFinalFlag;
}
exports.enableProcessPrivilege = enableProcessPrivilege;



function main(  )
{
	
	return 0;
}

if ( !module.parent )
{
	main();
}