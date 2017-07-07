const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;

const path = require("path");

const ffi = require("ffi");


var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [
	
	"BOOL WINAPI CloseHandle(  _In_ HANDLE hObject );" ,
	
	"HANDLE WINAPI GetCurrentProcess();" ,
	
	"HANDLE WINAPI CreateToolhelp32Snapshot( _In_ DWORD dwFlags , _In_ DWORD th32ProcessID);" ,
	
	"BOOL WINAPI Heap32First(_Inout_ HEAPENTRY32* lphe , _In_    DWORD th32ProcessID , _In_    ULONG_PTR     th32HeapID);" ,
	
	"BOOL WINAPI Heap32Next(_Out_ HEAPENTRY32* lphe);" ,
	
	"BOOL WINAPI Heap32ListFirst(_In_    HANDLE  hSnapshot , _Inout_ HEAPLIST32* lphl);" ,
	
	"BOOL WINAPI Heap32ListNext(_In_  HANDLE hSnapshot , _Out_ HEAPLIST32* lphl);" ,
	
	"BOOL WINAPI Module32FirstW( _In_ HANDLE  hSnapshot , _Inout_ MODULEENTRY32* lpme);" ,

	"BOOL WINAPI Module32NextW( _In_  HANDLE hSnapshot , _Out_ MODULEENTRY32* lpme);" ,
	
	"BOOL WINAPI Process32FirstW( _In_    HANDLE  hSnapshot , _Inout_ PROCESSENTRY32* lppe );" ,
	
	"BOOL WINAPI Process32NextW( _In_  HANDLE  hSnapshot , _Out_ PROCESSENTRY32* lppe );" ,
	
	"BOOL WINAPI Thread32First( _In_    HANDLE hSnapshot , _Inout_ THREADENTRY32* lpte );" ,
	
	"BOOL WINAPI Thread32Next( _In_  HANDLE hSnapshot , _Out_ THREADENTRY32* lpte);" ,
	
	"BOOL WINAPI Toolhelp32ReadProcessMemory( _In_  DWORD   th32ProcessID , _In_  LPCVOID lpBaseAddress , _Out_ LPVOID  lpBuffer , _In_  SIZE_T  cbRead , _Out_ SIZE_T  lpNumberOfBytesRead );" , 
	
	"DWORD WINAPI GetCurrentProcessId(void);" ,
]);

function enumProcess()
{
	var hSnapshot = null;
	var lpProcessEntry32 = null;
	var bFlag = false;
	var bLoop = true;
	
	var processNode = null;
	var processArray = null;
	
	do
	{
		hSnapshot = ffi_kernel32.CreateToolhelp32Snapshot( 0x00000002 , 0 );
		if ( hSnapshot.isZero() )
		{
			break;
		}
		
		if ( 'x64' == process.arch )
		{
			lpProcessEntry32 = Buffer.alloc( 0x238 );
			lpProcessEntry32.writeUInt32LE( 0x238 , 0x00 );
		}
		else
		{
			lpProcessEntry32 = Buffer.alloc( 0x22c );
			lpProcessEntry32.writeUInt32LE( 0x22c , 0x00 );
		}
		
		bFlag = ffi_kernel32.Process32FirstW( hSnapshot , lpProcessEntry32 );
		if ( !bFlag )
		{
			break;
		}
		
		do
		{
			processNode = {};
			
			processNode.pid = lpProcessEntry32.readUInt32LE( 0x008 );
			
			if ( 'x64' == process.arch )
			{
				processNode.threadCount = lpProcessEntry32.readUInt32LE( 0x01C );
				
				processNode.parentPid = lpProcessEntry32.readUInt32LE( 0x020 );
				
				processNode.basePriority = lpProcessEntry32.readUInt32LE( 0x024 );
				
				processNode.imageName = lpProcessEntry32.toString( "ucs2" , 0x02c , 0x02c + 260 * 2 );
			}
			else
			{
				processNode.threadCount = lpProcessEntry32.readUInt32LE( 0x014 );
				
				processNode.parentPid = lpProcessEntry32.readUInt32LE( 0x018 );
				
				processNode.basePriority = lpProcessEntry32.readUInt32LE( 0x1C );
				
				processNode.imageName = lpProcessEntry32.toString( "ucs2" , 0x024 , 0x024 + 260 * 2  );
			}
			
			if ( !processArray )
			{
				processArray = [];
			}
			
			processArray.push( processNode );
			
			lpProcessEntry32.fill(0);
			
			if ( 'x64' == process.arch )
			{
				lpProcessEntry32.writeUInt32LE( 0x238 , 0x00 );
			}
			else
			{
				lpProcessEntry32.writeUInt32LE( 0x22c , 0x00 );
			}
				
			bLoop = ffi_kernel32.Process32NextW( hSnapshot , lpProcessEntry32 );
			
		}while( bLoop );
		
		
	}while(false);
	
	
	if ( hSnapshot )
	{
		ffi_kernel32.CloseHandle( hSnapshot );
		hSnapshot = null;
	}
	
	if ( lpProcessEntry32 )
	{
		lpProcessEntry32.free();
		lpProcessEntry32 = null;
	}
	
	return processArray;
}
exports.enumProcess = enumProcess ;


function enumModule( arg_pid )
{
	var hSnapshot = null;
	var lpModuleEntry32 = null;
	var bFlag = false;
	var bLoop = true;
	
	var moduleNode = null;
	var moduleArray = null;
	
	do
	{
		hSnapshot = ffi_kernel32.CreateToolhelp32Snapshot( 0x00000008 , arg_pid || 0 );
		if ( hSnapshot.isZero() )
		{
			break;
		}
		
		if ( 'x64' == process.arch )
		{
			lpModuleEntry32 = Buffer.alloc( 0x438 );
			lpModuleEntry32.writeUInt32LE( 0x438 , 0x00 );
		}
		else
		{
			lpModuleEntry32 = Buffer.alloc( 0x428 );
			lpModuleEntry32.writeUInt32LE( 0x428 , 0x00 );
		}
		
		bFlag = ffi_kernel32.Module32FirstW( hSnapshot , lpModuleEntry32 );
		if ( !bFlag )
		{
			break;
		}
		
		do
		{
			moduleNode = {};
	
			if ( 'x64' == process.arch )
			{
				moduleNode.imageBase = lpModuleEntry32.readPointer( 0x018 );
				
				moduleNode.imageSize = lpModuleEntry32.readUInt32LE( 0x020 );
				
				moduleNode.imageName = lpModuleEntry32.toString( "ucs2" , 0x030 ,  0x030 + (255 + 1 ) * 2 );
				
				moduleNode.imagePath = lpModuleEntry32.toString( "ucs2" , 0x230 , 0x230 + 260 * 2 );
			}
			else
			{
				moduleNode.imageBase = lpModuleEntry32.readPointer( 0x014 );
				
				moduleNode.imageSize = lpModuleEntry32.readUInt32LE( 0x018 );
				
				moduleNode.imageName = lpModuleEntry32.toString( "ucs2" , 0x020 , 0x020 + (255 + 1 ) * 2  );
				
				moduleNode.imagePath = lpModuleEntry32.toString( "ucs2" , 0x220 , 0x220 + 260 * 2 );
			}
			
			if ( !moduleArray )
			{
				moduleArray = [];
			}
			
			moduleArray.push( moduleNode );
			
			lpModuleEntry32.fill(0);
			
			if ( 'x64' == process.arch )
			{
				lpModuleEntry32.writeUInt32LE( 0x438 , 0x00 );
			}
			else
			{
				lpModuleEntry32.writeUInt32LE( 0x428 , 0x00 );
			}
				
			bLoop = ffi_kernel32.Module32NextW( hSnapshot , lpModuleEntry32 );
			
		}while( bLoop );
		
		
	}while(false);
	
	
	if ( hSnapshot )
	{
		ffi_kernel32.CloseHandle( hSnapshot );
		hSnapshot = null;
	}
	
	if ( lpModuleEntry32 )
	{
		lpModuleEntry32.free();
		lpModuleEntry32 = null;
	}
	
	return moduleArray;
}
exports.enumModule = enumModule ;

function enumThread( arg_pid )
{
	var hSnapshot = null;
	var lpThreadEntry32 = null;
	var bFlag = false;
	var bLoop = true;
	
	var threadNode = null;
	var threadArray = null;
	
	do
	{
		hSnapshot = ffi_kernel32.CreateToolhelp32Snapshot( 0x00000004 , 0 );
		if ( hSnapshot.isZero() )
		{
			break;
		}
		
		
		lpThreadEntry32 = Buffer.alloc( 0x1c );
		lpThreadEntry32.writeUInt32LE( 0x1c , 0x00 );
		
		
		bFlag = ffi_kernel32.Thread32First( hSnapshot , lpThreadEntry32 );
		if ( !bFlag )
		{
			break;
		}
		
		do
		{
			threadNode = {};
			
			threadNode.tid = lpThreadEntry32.readUInt32LE( 0x08 );
				
			threadNode.pid = lpThreadEntry32.readUInt32LE( 0x0c );
			
			threadNode.basePriority = lpThreadEntry32.readInt32LE( 0x010 );
			
			if ( !threadArray )
			{
				threadArray = [];
			}
			
			threadArray.push( threadNode );
			
			lpThreadEntry32.fill(0);

			lpThreadEntry32.writeUInt32LE( 0x1c , 0x00 );
		
			bLoop = ffi_kernel32.Thread32Next( hSnapshot , lpThreadEntry32 );
			
		}while( bLoop );
		
		
	}while(false);
	
	
	if ( hSnapshot )
	{
		ffi_kernel32.CloseHandle( hSnapshot );
		hSnapshot = null;
	}
	
	if ( lpThreadEntry32 )
	{
		lpThreadEntry32.free();
		lpThreadEntry32 = null;
	}
	
	return threadArray;
}
exports.enumThread = enumThread ;


function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}