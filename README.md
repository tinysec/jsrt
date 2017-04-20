# PREPARE TO RELEASE , COMING SOON!

# the javascript runtime ( JSRT ) project

* javascript runtime for windows , based on **chakra**
* author: TinySec( <a href="https://twitter.com/TinySecEx" target="_blank">@TinySecEx</a> )
* latest-release: <a href="https://github.com/tinysec/jsrt/releases/tag/v0.0.2.0" target="_blank">0.0.2.0</a> 
* maybe JSRT is the best friend for binary hacker.

## DOCUMENTS
<a href="https://github.com/tinysec/jsrt/wiki" target="_blank">https://github.com/tinysec/jsrt/wiki</a> 

## host type

| filename | host | arch  | usage |
| ------| ------ | ------ |------ | 
| js.exe  | console | i386  | js.exe [options] [--eval script or script.js] [arguments] 
| js64.exe  | console | amd64  | js64.exe [options] [--eval script or script.js] [arguments] 
| jsw.exe  | window | i386  | jsw.exe [options] [--eval script or script.js] [arguments]|  
| jsw64.exe  | window | amd64  | jsw64.exe [options] [--eval script or script.js] [arguments]  
| jsida.plw  | IDA | i386  | [options] [--eval script or script.js] [arguments]  
| jsida.p64  | IDA | amd64  | [options] [--eval script or script.js] [arguments]  
| jswd.dll  | windbg | i386  | !js [options] [--eval script or script.js] [arguments] 
| jswd64.dll  | windbg | amd64  | !js [options] [--eval script or script.js] [arguments]  
| jsk.sys  | kernel | i386  | TODO , support kernel access
| jsk64.sys  | kernel | amd64  | TODO , support kernel access

## native support feature
* 64-bit number
* Buffer
* host full memory access , and support both GC and manual memory manager.
* c-like printf and sprintf
* ffi , support some windows type , full windows api access
* serialize and unserialize
* fuzz and exploit help
* re-entry support for windbg and ida mode
* portable from windows xp ~ windows 10 rs2
* small dist.
* extern sqlite3 , distorm3 , libcurl
* anything you want for binary hack.

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

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

var hUser32 = ffi.loadLibrary( "user32.dll" );
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
	var lpEnumFunc = ffi.thunk( enumRoutine , "BOOL CALLBACK EnumWindowsProc(_In_ HWND   hwnd,_In_ LPARAM lParam);"   );

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
..........
```

## history
JSRT project had two version ,
* the pre-version is self use , not-published , it was written between 2015-07 ~ 2016-09
* the current version is going to public release , support  some compatible to other bindings. 


## the pre-version is used for kernel fuzz ( self use , not-published)
[javascript kernel fuzz](https://github.com/tinysec/public/tree/master/FuzzWindowsKernelViaJavascript)


