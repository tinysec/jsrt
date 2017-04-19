
const assert = require("assert");
const ffi = require("ffi");

var hUser32 = ffi.getModuleHandle( "user32.dll" );
var fnEnumWindows = ffi.bindModule( hUser32 ,  "BOOL WINAPI EnumWindows(_In_ void* lpEnumFunc,_In_ LPARAM      lParam); "  );
var fnGetClassNameA = ffi.bindModule( hUser32 ,  "int WINAPI GetClassNameA(_In_  HWND   hWnd,_Out_ LPTSTR lpClassName,_In_  int    nMaxCount);"  );

// BOOL CALLBACK EnumWindowsProc(_In_ HWND   hwnd,_In_ LPARAM lParam);
function enumRoutine( hWnd , lParam )
{
	var lpClassNameA = Buffer.alloc( 250 ).fill( 0 );

	var nRet = 0;
	
	nRet = fnGetClassNameA( hWnd , lpClassNameA , 250 );
	
	printf("0x%p -> %s|\n" , hWnd  , lpClassNameA.toString() );
	
	lpClassNameA.free();

	return true;
}

function main(  )
{
	var lpEnumFunc = ffi.thunk( "BOOL CALLBACK EnumWindowsProc(_In_ HWND   hwnd,_In_ LPARAM lParam);" ,  enumRoutine  );

	fnEnumWindows( lpEnumFunc  , 0 );

	lpEnumFunc.free();
	
	return 0;
}

if ( !module.parent )
{
	main();
}