const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");

var ffi_user32 = ffi.loadAndBatchBind("user32.dll" , [

	"LRESULT WINAPI SendMessage( _In_ HWND   hWnd , _In_ UINT   Msg , _In_ WPARAM wParam ,  _In_ LPARAM lParam);"
	
]);




function main(  )
{
	
	
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}