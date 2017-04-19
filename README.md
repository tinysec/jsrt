# jsrt
javascript runtime for windows , based on **chakra**

## maybe JSRT is the best friend for binary hacker.

## native support
* 64-bit number
* buffer
* host full memory access , and support both GC and manual memory manager.
* c-like printf and sprintf
* ffi
* console , window , cgi , ida , windbg
* serialize and unserialize
* fuzz and exploit help
* full windows api access
* re-entry support for windbg and ida mode
* i386 , wow64 , amd64
* portable from windows xp ~ windows 10 rs2
* small dist.
* build-in sqlite3 , distorm3
* 

## usage
```javascript
Usage: js [options] [--eval script | script.js] [arguments]

Options: 
 --version	show version
 --verbose	verbose mode
 --help		show help
 --eval		eval mode


Environment: 
JSRT_MODULE_PATH		common jsrt module search path
JSRT_IDA_MODULE_PATH		jsrt-ida module search path
JSRT_WINDBG_MODULE_PATH		jsrt-windbg module search path
```

## example
enum windows

```javascript
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
```

and you will got
```javascript
0x0001014A -> ForegroundStaging|
0x00010176 -> ForegroundStaging|
0x000100FC -> tooltips_class32|
0x00010100 -> tooltips_class32|
0x002F0A7E -> Net UI Tool Window|
0x01840922 -> Net UI Tool Window|
0x02A50EF4 -> tooltips_class32|
0x016D0E1A -> UIRibbonStdCompMgr|
0x02A00DCC -> tooltips_class32|
0x010C0DA4 -> tooltips_class32|
0x00890D2E -> tooltips_class32|
0x0001041A -> Chrome_SystemMessageWindow|
0x00010414 -> Base_PowerMessageWindow|
0x00010180 -> IME|
0x00010148 -> IME|
0x0001011C -> IME|
0x02630B5A -> IME|
0x015A074C -> IME|
```




## the pre-version is used for kernel fuzz
[javascript kernel fuzz](https://github.com/tinysec/public/tree/master/FuzzWindowsKernelViaJavascript)


