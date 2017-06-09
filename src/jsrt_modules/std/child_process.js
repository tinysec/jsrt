const assert = require("assert");
const _ = require("underscore");

const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;
const DbgPrint = require("cprintf").DbgPrint;

const path = require("path");

const ffi = require("ffi");

var ffi_kernel32 = ffi.loadAndBatchBind("kernel32.dll" , [
	"BOOL WINAPI CreateProcessW(_In_opt_    LPCWSTR  lpApplicationName,_Inout_opt_ LPWSTR  lpCommandLine,_In_opt_  SECURITY_ATTRIBUTES* lpProcessAttributes, _In_opt_    SECURITY_ATTRIBUTES* lpThreadAttributes,_In_  BOOL bInheritHandles,_In_  DWORD dwCreationFlags,_In_opt_    LPVOID  pEnvironment,_In_opt_    LPCWSTR  lpCurrentDirectory,_In_ STARTUPINFO* lpStartupInfo,_Out_ PROCESS_INFORMATION* lpProcessInformation);" ,
	
	"BOOL WINAPI CloseHandle(_In_ HANDLE hObject);" ,
	
	"DWORD WINAPI WaitForSingleObject(_In_ HANDLE hHandle,_In_ DWORD  dwMilliseconds);" ,
	
	"DWORD WINAPI WaitForMultipleObjects(_In_       DWORD  nCount, _In_ const HANDLE *lpHandles, _In_       BOOL   bWaitAll, _In_       DWORD  dwMilliseconds);" ,
	
	"BOOL WINAPI CreatePipe(_Out_    PHANDLE               hReadPipe, _Out_    PHANDLE               hWritePipe, _In_opt_ SECURITY_ATTRIBUTES* lpPipeAttributes, _In_     DWORD                 nSize);" ,
	
	"BOOL WINAPI ReadFile( _In_        HANDLE       hFile,_Out_       LPVOID       lpBuffer,_In_        DWORD        nNumberOfBytesToRead,_Out_opt_   LPDWORD      lpNumberOfBytesRead,_Inout_opt_ OVERLAPPED* lpOverlapped);" ,
	
	"BOOL WINAPI WriteFile(_In_        HANDLE       hFile,_In_        LPCVOID      lpBuffer, _In_        DWORD        nNumberOfBytesToWrite,_Out_opt_   LPDWORD      lpNumberOfBytesWritten,_Inout_opt_ OVERLAPPED* lpOverlapped);" ,
	
	"BOOL WINAPI PeekNamedPipe(_In_      HANDLE  hNamedPipe, _Out_opt_ LPVOID  lpBuffer,_In_      DWORD   nBufferSize,_Out_opt_ LPDWORD lpBytesRead,_Out_opt_ LPDWORD lpTotalBytesAvail,_Out_opt_ LPDWORD lpBytesLeftThisMessage);",
	
	"VOID WINAPI Sleep(_In_ DWORD dwMilliseconds);" , 
	
	"BOOL WINAPI TerminateProcess( _In_ HANDLE hProcess , _In_ UINT   uExitCode);" , 
	
	"DWORD WINAPI ResumeThread(_In_ HANDLE hThread);" ,
	
	"BOOL WINAPI IsWow64Process(_In_  HANDLE hProcess, _Out_ PBOOL  Wow64Process);" ,
	
	"UINT WINAPI WinExec( _In_ LPCSTR lpCmdLine , _In_ UINT   uCmdShow);" ,
	
	"DWORD WINAPI GetTickCount(void);"  

]);

function addEnvPaths(destPaths, envKeyName) 
{
    var envPaths = null;
    var envValue = process.env[envKeyName];

    if (!envValue) {
        return destPaths;
    }

    envPaths = envValue.split(";");

    envPaths = _.map(envPaths, function (item) {
        return path.normalize(item.trim().toLowerCase());
    });

    envPaths = _.map(envPaths, function (item) {
        return path.removeBackslash(item);
    });

    destPaths = _.union(destPaths, envPaths);

    return destPaths;
}

function buildSearchPaths() 
{
    var searchPaths = [];
    var testPath = '';

    testPath = process.currentDirectory.toLowerCase();
    if (-1 == searchPaths.indexOf(testPath)) 
	{
        searchPaths.push(testPath);
    }

    testPath = process.execDirectory.toLowerCase();
    if (-1 == searchPaths.indexOf(testPath)) 
	{
        searchPaths.push(testPath);
    }

    searchPaths = addEnvPaths(searchPaths, "Path");

    searchPaths = _.filter(searchPaths, function (item) 
	{
        return (0 != item.length) && path.folderExists(item);
    });

    return searchPaths;
}

function resolveFile(arg_name) 
{
    var searchPaths = [];
    var mainFileName = '';
    var index = 0;
	var mindex = 0;
    var testFileName = '';
	
	var extArray = process.env.PATHEXT.split(';');
	
	extArray = _.map( extArray , function(item)
	{
		return item.toLowerCase();
	});
	
    assert(_.isString(arg_name));

    var findName = path.normalize(arg_name);

    if (path.fileExists(findName)) 
	{
        return findName;
    }

    searchPaths = buildSearchPaths();

    // add 
    for (index = 0; index < searchPaths.length; index++) 
	{
        testFileName = path.combine(searchPaths[index], findName);

        if (path.fileExists(testFileName)) 
		{
            return testFileName;
        }
        else 
		{
			for ( mindex = 0; mindex < extArray.length; mindex++ )
			{
				testFileName = path.combine(searchPaths[index], findName + extArray[mindex] );
				if (path.fileExists(testFileName)) 
				{
					return testFileName;
				}
			}
        }
    }

    return;
}

function envTable2Block( table , arg_encoding )
{
	var key = '';
	var value = '';
	var bufferSize = 0;
	var offset = 0;
	var key_value = '';
	
	var lpEnvironment = null;
	
	var codepage = base.encoding2codepage( arg_encoding || 'ascii' );
	
	assert( ( ( 0 == codepage ) || ( 1200 == codepage ) )  , 'invalid encoding' );

	for ( key in table )
	{
		value = table[ key ];
		
		key_value = sprintf('%s=%s' , key , value );
		
		if ( 1200 == codepage )
		{
			bufferSize += ( key_value.length + 1 ) * 2;
		}
		else
		{
			bufferSize += ( key_value.length + 1 ) * 1;
		}
	}
	
	if ( 1200 == codepage )
	{
		bufferSize += 1 * 2;
	}
	else
	{
		bufferSize += 1 * 1;
	}

	lpEnvironment = Buffer.alloc( bufferSize ).fill( 0 );
	
	for ( key in table )
	{
		value = table[ key ];
		
		// name=value\0
		key_value = sprintf('%s=%s' , key , value );
	
		offset += lpEnvironment.write( key_value , offset , arg_encoding || 'ascii');
		
		if ( 1200 == codepage )
		{
			offset += 2;
		}
		else
		{
			offset += 1;
		}
	}
	
	return lpEnvironment;
}


function help_child_process_spawn( param_commandline , param_options )
{
	var arg_options = null;
	
	var arg_userApplication = null;
	var arg_application = null;
	
	var arg_lpCommandline = null;
	var arg_commandline = '';
	var arg_userCommandline = '';
	
	
	var arg_dwCreationFlags = 0; 
	var arg_lpEnvironment= null;
	var arg_CurrentDirectory = null;
	var arg_lpStartupInfo = null;
	var arg_lpProcessInformation  = null;
	
	var option_showWindow = undefined;
	var option_input = undefined;
	var option_timeout = undefined;
	var option_maxBuffer = 200*1024;
	var option_encoding = undefined;
	var option_shell = false;
	var option_console = false;
	var option_useStdHandles = false;
	
	var starupFlags = 0;

	var lpReadPipeBuffer = null;
	var lpWritePipeBuffer = null;
	var lpPipeAttributes = null;
	
	var lpDesktop = null;
	var lpTitle = null;

	var bFlag = false;
	var bFinalFlag = false;
	
	var ChildProcess = {};
	
	var cmdlineArray = null;
	var index = 0;
	
	do
	{	
		assert( _.isString( arguments[0] )  , "invalid arguments[0]" );
		

		cmdlineArray = base.cmdlineToArgv( arguments[0] );
		
		if ( cmdlineArray.length >= 1 )
		{
			arg_application = resolveFile( cmdlineArray[0] );
			arg_userApplication = arg_application;
			
			cmdlineArray.shift();
			
			for ( index = 0; index < cmdlineArray.length; index++ )
			{
				if ( -1 != cmdlineArray[index].indexOf(" ") )
				{
					arg_commandline += ' ' + '"' + base.escapeDoubleQuotes( cmdlineArray[index] ) + '"';
				}
				else
				{
					arg_commandline += ' ' + '"' + cmdlineArray[index] + '"';
				}
			}

			arg_userCommandline = arg_commandline;
		}
		else
		{
			arg_application = resolveFile( cmdlineArray[0] );
			
			assert( arg_application , sprintf('not found %s' , cmdlineArray[0] ) );
			arg_userApplication = arg_application;
		}
		
		if ( arguments.length >= 2 )
		{
			if ( arguments[1] )
			{
				if ( _.isObject( arguments[1] ) )
				{
					arg_options = arguments[1];
				}
			}
		}
		
		if ( arg_options )
		{
			if ( !_.isUndefined( arg_options.env ) )
			{
				assert( _.isObject( arg_options.env ) , "invalid option.env" );
				arg_lpEnvironment = envTable2Block( arg_options , 'ucs2' );
			}
			
			if ( !_.isUndefined( arg_options.cwd ) )
			{
				assert( _.isString( arg_options.cwd ) , "invalid option.cwd" );
				arg_CurrentDirectory = arg_options.cwd;
			}
			
			if ( !_.isUndefined( arg_options.argv0 ) )
			{
				assert( _.isString( arg_options.argv0 ) , "invalid option.argv0" );
				
				arg_commandline = param_commandline; 
		
				
				arg_application = resolveFile( arg_options.argv0 );
			}
			
			if ( !_.isUndefined( arg_options.input ) )
			{
				assert( ( _.isString( arg_options.input ) || Buffer.isBuffer( arg_options.input ) ) , "invalid option.input" );
				option_input = arg_options.input;
			}
			
			if ( !_.isUndefined( arg_options.timeout ) )
			{
				assert( _.isNumber( arg_options.timeout ) , "invalid option.timeout" );
				option_timeout = arg_options.timeout;
			}
			
			if ( !_.isUndefined( arg_options.maxBuffer ) )
			{
				assert( _.isNumber( arg_options.maxBuffer ) , "invalid option.maxBuffer" );
				option_maxBuffer = arg_options.maxBuffer;
			}
			
			if ( !_.isUndefined( arg_options.encoding ) )
			{
				assert( _.isString( arg_options.encoding ) , "invalid option.encoding" );
				option_encoding = arg_options.encoding;
			}
			
			// cmd.exe /d /s /c
			if ( arg_options.shell )
			{
				option_shell = true;
				
				arg_application = process.env["ComSpec"];
				
				if ( !_.isUndefined( arg_options.argv0 ) )
				{
					arg_commandline = " /d /s /c " + resolveFile( arg_options.argv0  ) + " " + param_commandline;
				}
				else
				{
					if ( 0 == arg_userCommandline.length )
					{
						arg_commandline = " /d /s /c " + arg_userApplication;
					}
					else
					{
						arg_commandline = " /d /s /c " + arg_userApplication + " " + arg_userCommandline;
					}
				}
			}
			
			// CREATE_NEW_CONSOLE
			if ( arg_options.console )
			{
				option_console = true;
			}
			
			if ( arg_options.useStdHandles )
			{
				option_useStdHandles = true;
			}
			
			if ( !_.isUndefined( arg_options.flags ) )
			{
				// 0x00000400 = CREATE_UNICODE_ENVIRONMENT
				arg_dwCreationFlags = Number64( arg_options.flags );
			}
			
			if ( !_.isUndefined( arg_options.show ) )
			{
				assert( _.isNumber( arg_options.show ) , "invalid option.showWindow" );
				option_showWindow = arg_options.show;
				
				starupFlags |= 1; // STARTF_USESHOWWINDOW
			}
	
			if ( !_.isUndefined( arg_options.desktop ) )
			{
				assert( _.isString( arg_options.desktop ) , "invalid option.desktop" );
		
				lpDesktop = Buffer.from( arg_options.desktop , 'ucs2' );
			}
			
			if ( !_.isUndefined( arg_options.title ) )
			{
				assert( _.isString( arg_options.title ) , "invalid option.title" );
			
				// only console mode
				lpTitle = Buffer.from( arg_options.title , 'ucs2' );
			}
		}
		
		// fix create flags
		if ( arg_lpEnvironment )
		{
			arg_dwCreationFlags |= 0x400;  // CREATE_UNICODE_ENVIRONMENT
		}
		
		if ( option_console )
		{
			arg_dwCreationFlags |= 0x10;	// CREATE_NEW_CONSOLE
		}
		
		
		// arg_lpCommandline
		if ( 0 == arg_commandline.length )
		{
			if ( -1 != arg_application.indexOf(' ') )
			{
				if ( '"' == arg_application.charAt(0) )
				{
					arg_commandline = arg_application + ' ';
				}
				else
				{
					arg_commandline = '"' + arg_application + '" ';
				}
			}
			else
			{
				arg_commandline = arg_application + ' ';
			}
		}
		
		if ( 0 != arg_commandline.length )
		{
			arg_lpCommandline = Buffer.from( arg_commandline , 'ucs2' );
		}

		
		if ( option_useStdHandles )
		{
			// pipe
			lpReadPipeBuffer = Buffer.alloc( 8 ).fill( 0 );
			lpWritePipeBuffer = Buffer.alloc( 8 ).fill( 0 );
				
			lpPipeAttributes = Buffer.alloc( 24 ).fill(0);
			if ( 'x64' == process.arch )
			{
				// nLength
				lpPipeAttributes.writeUInt32LE( 24 , 0x00 );
				
				// bInheritHandle
				lpPipeAttributes.writeUInt32LE( 1 , 0x10 );
			}
			else
			{
				// nLength
				lpPipeAttributes.writeUInt32LE( 12 , 0x00 );
				
				// bInheritHandle
				lpPipeAttributes.writeUInt32LE( 1 , 0x08 );
			}
		
			bFlag = ffi_kernel32.CreatePipe( lpReadPipeBuffer , lpWritePipeBuffer , lpPipeAttributes , 0 );
			if ( !bFlag )
			{
				break;
			}
			
			ChildProcess.hStdInputReadPipe = lpReadPipeBuffer.readPointer( 0 );
			ChildProcess.hStdInputWritePipe = lpWritePipeBuffer.readPointer( 0 );
			
			if ( ChildProcess.hStdInputReadPipe.isZero() )
			{
				break;
			}
			
			if ( ChildProcess.hStdInputWritePipe.isZero() )
			{
				break;
			}
			
			// hStdOutput
			lpReadPipeBuffer.fill(0);
			lpWritePipeBuffer.fill(0);
			bFlag = ffi_kernel32.CreatePipe( lpReadPipeBuffer , lpWritePipeBuffer , lpPipeAttributes , 0 );
			if ( !bFlag )
			{
				break;
			}
			
			ChildProcess.hStdOutputReadPipe = lpReadPipeBuffer.readPointer( 0 );
			ChildProcess.hStdOutputWritePipe = lpWritePipeBuffer.readPointer( 0 );
			
			if ( ChildProcess.hStdOutputReadPipe.isZero() )
			{
				break;
			}
			
			if ( ChildProcess.hStdOutputWritePipe.isZero() )
			{
				break;
			}
			
			// hStdError
			lpReadPipeBuffer.fill(0);
			lpWritePipeBuffer.fill(0);
			bFlag = ffi_kernel32.CreatePipe( lpReadPipeBuffer , lpWritePipeBuffer , lpPipeAttributes , 0 );
			if ( !bFlag )
			{
				break;
			}
			
			ChildProcess.hStdErrorReadPipe = lpReadPipeBuffer.readPointer( 0 );
			ChildProcess.hStdErrorWritePipe = lpWritePipeBuffer.readPointer( 0 );
			
			if ( ChildProcess.hStdErrorReadPipe.isZero() )
			{
				break;
			}
			
			if ( ChildProcess.hStdErrorWritePipe.isZero() )
			{
				break;
			}
			
			starupFlags |= 0x00000100; // STARTF_USESTDHANDLES
		}
		

		// #define STARTF_USESTDHANDLES 0x00000100
		// #define STARTF_USESHOWWINDOW 0x00000001
		
		// lpStartupInfo
		if ( 'x64' == process.arch )
		{
			arg_lpStartupInfo = Buffer.alloc( 104 ).fill( 0 ) ;
			
			// cbSize
			arg_lpStartupInfo.writeUInt32LE( 104 , 0x00 );
			
			
			// lpDesktop
			arg_lpStartupInfo.writePointer( lpDesktop , 0x10 );
			
			// lpTitle
			arg_lpStartupInfo.writePointer( lpTitle , 0x18 );
			
			// dwFlags
			arg_lpStartupInfo.writeUInt32LE( starupFlags , 60 );
			
			if ( base.FlagOn(starupFlags , 1 ) )
			{
				// wShowWindow
				arg_lpStartupInfo.writeUInt32LE( option_showWindow , 64 );
			}
			
			if ( option_useStdHandles )
			{
				// hStdInput
				arg_lpStartupInfo.writePointer( ChildProcess.hStdInputReadPipe , 80 );
				
				// hStdOutput
				arg_lpStartupInfo.writePointer( ChildProcess.hStdOutputWritePipe , 88 );
				
				// hStdError
				arg_lpStartupInfo.writePointer( ChildProcess.hStdErrorWritePipe , 96 );
			}
	
		}
		else
		{
			arg_lpStartupInfo = Buffer.alloc( 68 ).fill( 0 ) ;
			
			// cbSize
			arg_lpStartupInfo.writeUInt32LE( 68 , 0x00 );
			
			// lpDesktop
			arg_lpStartupInfo.writePointer( lpDesktop , 0x08 );
			
			// lpTitle
			arg_lpStartupInfo.writePointer( lpTitle , 0x0C );
			
			
			// dwFlags
			arg_lpStartupInfo.writeUInt32LE( starupFlags , 44 );
			
			if ( base.FlagOn(starupFlags , 1 ) )
			{
				// wShowWindow
				arg_lpStartupInfo.writeUInt32LE( option_showWindow , 48 );
			}
			
			if ( option_useStdHandles )
			{
				// hStdInput
				arg_lpStartupInfo.writePointer( ChildProcess.hStdInputReadPipe , 56 );
				
				// hStdOutput
				arg_lpStartupInfo.writePointer( ChildProcess.hStdOutputWritePipe , 60 );
				
				// hStdError
				arg_lpStartupInfo.writePointer( ChildProcess.hStdErrorWritePipe , 64 );
			}
	
		}
		
		// arg_lpProcessInformation
		if ( 'x64' == process.arch )
		{
			arg_lpProcessInformation = Buffer.alloc( 24 );
		}
		else
		{
			arg_lpProcessInformation = Buffer.alloc( 16 );
		}
		
		KdPrint("[CreateProcess] application='%s'\n" , arg_application );
		KdPrint("[CreateProcess] commandline='%s'\n" , arg_commandline );
			
		bFlag = ffi_kernel32.CreateProcessW(
				arg_application ,
				arg_lpCommandline ,
				null ,
				null ,
				true ,
				arg_dwCreationFlags ,
				arg_lpEnvironment , 
				arg_CurrentDirectory ,
				arg_lpStartupInfo , 
				arg_lpProcessInformation  
		);
		
		if ( !bFlag )
		{
			break;
		}
		
		if ( 'x64' == process.arch )
		{
			ChildProcess.hProcess = arg_lpProcessInformation.readPointer( 0x00 );
			
			ChildProcess.hThread = arg_lpProcessInformation.readPointer( 0x08 );
			
			ChildProcess.pid = arg_lpProcessInformation.readUInt32LE( 0x10 );
			
			ChildProcess.tid = arg_lpProcessInformation.readUInt32LE( 0x14 );
		}
		else
		{
			ChildProcess.hProcess = arg_lpProcessInformation.readPointer( 0x00 );
			
			ChildProcess.hThread = arg_lpProcessInformation.readPointer( 0x04 );
			
			ChildProcess.pid = arg_lpProcessInformation.readUInt32LE( 0x08 );
			
			ChildProcess.tid = arg_lpProcessInformation.readUInt32LE( 0x0C );
		}
		
		
		// wow64
		var lpWow64Buffer = Buffer.alloc(8).fill(0);
		ffi_kernel32.IsWow64Process( ChildProcess.hProcess , lpWow64Buffer );
		
		ChildProcess.wow64 = ( 1 == lpWow64Buffer.readUInt32LE(0) );
		
		lpWow64Buffer.free();
		lpWow64Buffer = null;
		
		ChildProcess.suspend = function(  )
		{
			// hThread
			if ( ChildProcess.hThread )
			{
				return ffi_kernel32.SuspendThread( ChildProcess.hThread );
			}
			else
			{
				return -1;
			}
		}
		
		ChildProcess.resume = function(  )
		{
			// hThread
			if ( ChildProcess.hThread )
			{
				return ffi_kernel32.ResumeThread( ChildProcess.hThread );
			}
			else
			{
				return -1;
			}
		}
		
		ChildProcess.wait = function( dwMilliseconds )
		{
			// hProcess
			if ( ChildProcess.hProcess )
			{
				return ffi_kernel32.WaitForSingleObject( ChildProcess.hProcess , dwMilliseconds || -1 );
			}
			else
			{
				return -1;
			}
		}
		
		
		// method kill
		ChildProcess.kill = function( exitCode )
		{
			// hProcess
			if ( ChildProcess.hProcess )
			{
				ffi_kernel32.TerminateProcess( ChildProcess.hProcess ,  exitCode || 0 ) ;
			}
			
			help_close_handles( ChildProcess );
		}
		
		ChildProcess.waitForExit = function( dwMilliseconds )
		{
			var waitCode = ChildProcess.wait( dwMilliseconds );
			
			// hProcess
			if ( ChildProcess.hProcess )
			{
				if ( 0 != waitCode )
				{
					ffi_kernel32.TerminateProcess( ChildProcess.hProcess ,  waitCode || 0 ) ;
				}
			}
			
			help_close_handles( ChildProcess );
			
			return waitCode;
		}
		

		bFinalFlag = true;
	}while(false);
	
	if ( lpReadPipeBuffer )
	{
		lpReadPipeBuffer.free();
		lpReadPipeBuffer = null;
	}
	
	if ( lpWritePipeBuffer )
	{
		lpWritePipeBuffer.free();
		lpWritePipeBuffer = null;
	}
	
	if ( lpPipeAttributes )
	{
		lpPipeAttributes.free();
		lpPipeAttributes = null;
	}
	
	if ( arg_lpEnvironment )
	{
		arg_lpEnvironment.free();
		arg_lpEnvironment = null;
	}
	
	if ( arg_lpStartupInfo )
	{
		arg_lpStartupInfo.free();
		arg_lpStartupInfo = null;
	}
	
	if ( arg_lpProcessInformation )
	{
		arg_lpProcessInformation.free();
		arg_lpProcessInformation = null;
	}
	
	if ( lpDesktop )
	{
		lpDesktop.free();
		lpDesktop = null;
	}
	
	if ( lpTitle )
	{
		lpTitle.free();
		lpTitle = null;
	}
	
	if ( arg_lpCommandline )
	{
		arg_lpCommandline.free();
		arg_lpCommandline = null;
	}
	
	if ( !bFinalFlag )
	{
		// hStdInput
		help_close_handles( ChildProcess );
		
		ChildProcess = null;
	}
	
	return ChildProcess;
}

function help_child_process_capture( child , arg_options )
{
	var param_options = null;
	
	if ( arg_options && _.isObject(arg_options) )
	{
		param_options = arg_options;
	}
	
	var option_timeout = -1;
	var option_maxBuffer = 200*1024;
	var option_encoding = 'ascii';
	
	var bFlag = false;
	
	var lpTotalBytesAvail = null;
	var TotalBytesAvail = 0;
	
	var StdOutAvailBytes = 0;
	var StdErrAvaiBytes = 0;
	
	var SingleReadedBytes = 0;
	var SingleLeftBytes = 0;
	
	var lpFrameBuffer = null;
	
	var nNumberOfBytesToRead = 0;
	
	var lpNumberOfBytesRead = null;
	var NumberOfBytesRead = 0;
	
	var StdoutTotalReadedSize = 0;
	var StdErrorTotalReadedSize = 0;
	
	var StdOutQuotaLeftSize = 0;
	var StdErrorQuotaLeftSize = 0; 
	
	var capture = {};
	
	var startTick = null;
	var nWait = 0;
	var bNeedExit = false;
	
	var childHadExit = false;
	
	do
	{
		capture.stdout = '';
		capture.stderr = '';
	
		if ( param_options )
		{
			if ( !_.isUndefined( param_options.timeout ) )
			{
				assert( _.isNumber( param_options.timeout ) , "invalid option.timeout" );
				
				option_timeout = param_options.timeout;
			}
			
			if ( !_.isUndefined( param_options.maxBuffer ) )
			{
				assert( _.isNumber( param_options.maxBuffer ) , "invalid option.maxBuffer" );
				
				option_maxBuffer = param_options.maxBuffer;
			}
			
			if ( !_.isUndefined( param_options.encoding ) )
			{
				assert( _.isString( param_options.encoding ) , "invalid option.encoding" );
				
				option_encoding = param_options.encoding;
			}
		}
		
		StdErrorQuotaLeftSize = option_maxBuffer;
		StdOutQuotaLeftSize = option_maxBuffer;
		

		lpFrameBuffer = Buffer.alloc( 1024 ).fill(0);
		lpTotalBytesAvail = Buffer.alloc( 8 ).fill(0);
		lpNumberOfBytesRead = Buffer.alloc( 8 ).fill(0);

		startTick = ffi_kernel32.GetTickCount();
		
		while( true )
		{
			if ( option_timeout >= 0 )
			{
				if ( ffi_kernel32.GetTickCount() - startTick >= option_timeout )
				{
					capture.timeout = true;
					
					KdPrint("capture timeout is reach\n");
					break;
				}
			}
		
			lpTotalBytesAvail.fill( 0 );
				
			bFlag = ffi_kernel32.PeekNamedPipe( child.hStdOutputReadPipe , null , 0 , null , lpTotalBytesAvail , null );
			if ( !bFlag )
			{
				break;
			}
				
			TotalBytesAvail = lpTotalBytesAvail.readUInt32LE( 0 );
			if ( 0 != TotalBytesAvail )
			{
				// peek Stdout
				SingleReadedBytes = 0;
		
				SingleLeftBytes = TotalBytesAvail;
				
				while( SingleReadedBytes < TotalBytesAvail )
				{
					nNumberOfBytesToRead = Math.min( StdOutQuotaLeftSize ,  SingleLeftBytes , 1024  );
							
					lpFrameBuffer.fill( 0 );
					lpNumberOfBytesRead.fill( 0 );
							
					bFlag = ffi_kernel32.ReadFile( child.hStdOutputReadPipe , lpFrameBuffer , nNumberOfBytesToRead , lpNumberOfBytesRead , null );
					if ( !bFlag )
					{
						bNeedExit = true;
						break;
					}
							
					NumberOfBytesRead = lpNumberOfBytesRead.readUInt32LE(0);
					if ( 0 == NumberOfBytesRead )
					{
						bNeedExit = true;
						break;
					}
						
					StdOutQuotaLeftSize -= NumberOfBytesRead;
					SingleLeftBytes -= NumberOfBytesRead;
					SingleReadedBytes += NumberOfBytesRead;
			
					capture.stdout += lpFrameBuffer.toString( option_encoding , 0 , NumberOfBytesRead);
					
					if ( 0 == StdOutQuotaLeftSize )
					{
						bNeedExit = true;
						break;
					}
					
					if ( 0 == SingleLeftBytes )
					{
						break;
					}
				}
				
				if ( bNeedExit )
				{
					break;
				}
			}
			else
			{
				// peek StdError
					
				lpTotalBytesAvail.fill( 0 );
				bFlag = ffi_kernel32.PeekNamedPipe( child.hStdErrorReadPipe , null , 0 , null , lpTotalBytesAvail , null );
				if ( !bFlag )
				{
					break;
				}
				
				SingleReadedBytes = 0;
					
				TotalBytesAvail = lpTotalBytesAvail.readUInt32LE( 0 );
				
				SingleLeftBytes = TotalBytesAvail;
				
				if ( 0 != TotalBytesAvail )
				{
					while( SingleReadedBytes <= TotalBytesAvail )
					{
						nNumberOfBytesToRead = Math.min( StdErrorQuotaLeftSize ,  SingleLeftBytes , 1024 );
							
						lpFrameBuffer.fill( 0 );
						lpNumberOfBytesRead.fill( 0 );
							
						bFlag = ffi_kernel32.ReadFile( child.hStdErrorReadPipe , lpFrameBuffer , nNumberOfBytesToRead , lpNumberOfBytesRead , null );
						if ( !bFlag )
						{
							bNeedExit = true;
							break;
						}
							
						NumberOfBytesRead = lpNumberOfBytesRead.readUInt32LE(0);
						if ( 0 == NumberOfBytesRead )
						{
							bNeedExit = true;
							break;
						}
						
						StdErrorQuotaLeftSize -= NumberOfBytesRead;
						SingleLeftBytes -= NumberOfBytesRead;
						SingleReadedBytes += NumberOfBytesRead;
			
						capture.stderr += lpFrameBuffer.toString( option_encoding , 0 , NumberOfBytesRead);
					
						if ( 0 == StdErrorQuotaLeftSize )
						{
							bNeedExit = true;
							break;
						}
						
					}
					
					if ( bNeedExit )
					{
						break;
					}
				}
				else
				{
					if ( childHadExit )
					{
						break;
					}
				}
			}
			
			nWait = ffi_kernel32.WaitForSingleObject( child.hProcess , 100 );
			if ( 0 == nWait )
			{
				childHadExit = true;
			}

		}
		

	}while(false);
	
	if ( lpFrameBuffer )
	{
		lpFrameBuffer.free();
		lpFrameBuffer = null;
	}
	
	if ( lpTotalBytesAvail )
	{
		lpTotalBytesAvail.free();
		lpTotalBytesAvail = null;
	}
	
	if ( lpNumberOfBytesRead )
	{
		lpNumberOfBytesRead.free();
		lpNumberOfBytesRead = null;
	}
	

	return capture;
	
}

function help_close_handles( child )
{
	// hStdInput
	if ( child.hStdInputReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdInputReadPipe ) ;
		child.hStdInputReadPipe = null;
	}
		
	if ( child.hStdInputWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdInputWritePipe ) ;
		child.hStdInputWritePipe = null;
	}
		
	// hStdOutput
	if ( child.hStdOutputReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdOutputReadPipe ) ;
		child.hStdOutputReadPipe = null;
	}
		
	if ( child.hStdOutputWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdOutputWritePipe ) ;
		child.hStdOutputWritePipe = null;
	}
		
	// hStdError
	if ( child.hStdErrorReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdErrorReadPipe ) ;
		child.hStdErrorReadPipe = null;
	}
		
	if ( child.hStdErrorWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdErrorWritePipe ) ;
		child.hStdErrorWritePipe = null;
	}
		
	// hProcess
	if ( child.hProcess )
	{
		ffi_kernel32.CloseHandle( child.hProcess ) ;
		child.hProcess = null;
	}
		
	// hThread
	if ( child.hThread )
	{
		ffi_kernel32.CloseHandle( child.hThread ) ;
		child.hThread = null;
	}

}

function help_close_handles_all_but_hProcess( child )
{
	// hStdInput
	if ( child.hStdInputReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdInputReadPipe ) ;
		child.hStdInputReadPipe = null;
	}
		
	if ( child.hStdInputWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdInputWritePipe ) ;
		child.hStdInputWritePipe = null;
	}
		
	// hStdOutput
	if ( child.hStdOutputReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdOutputReadPipe ) ;
		child.hStdOutputReadPipe = null;
	}
		
	if ( child.hStdOutputWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdOutputWritePipe ) ;
		child.hStdOutputWritePipe = null;
	}
		
	// hStdError
	if ( child.hStdErrorReadPipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdErrorReadPipe ) ;
		child.hStdErrorReadPipe = null;
	}
		
	if ( child.hStdErrorWritePipe ) 
	{
		ffi_kernel32.CloseHandle( child.hStdErrorWritePipe ) ;
		child.hStdErrorWritePipe = null;
	}

	// hThread
	if ( child.hThread )
	{
		ffi_kernel32.CloseHandle( child.hThread ) ;
		child.hThread = null;
	}

}

// winExec
function winExec( commandline , uCmdShow )
{
	return ffi_kernel32.WinExec( commandline , uCmdShow || 1 );
}
exports.winExec = winExec;

// raw spawn , return child
function spawn( commandline )
{
	return help_child_process_spawn.apply(this , arguments);
}
exports.spawn = spawn;

function spawnSync( commandline , arg_options )
{
	var child = help_child_process_spawn( commandline , { useStdHandles : true } );
	var capture = null;
	
	if( child )
	{
		capture = help_child_process_capture( child , arg_options);
	
		// hProcess
		if ( child.hProcess )
		{
			if ( capture.timeout )
			{
				ffi_kernel32.TerminateProcess( child.hProcess , 258 );
			}
		}

		help_close_handles( child );
		
		child = null;
	}
	
	return capture;
}
exports.spawnSync = spawnSync;

// without shell , not wait
function exec( commandline )
{
	var child = help_child_process_spawn( commandline  );
	
	if( child )
	{
		help_close_handles( child );
		
		child = null;
		
		return 0;
	}
	
	return -1;
}
exports.exec = exec;

// withoutshell , wait , return output
function execSync( commandline , options )
{
	var child = help_child_process_spawn( commandline , { useStdHandles : true } );
	var capture = null;
	
	if( child )
	{
		capture = help_child_process_capture( child , options);
		
		// hProcess
		if ( child.hProcess )
		{
			if ( capture.timeout )
			{
				ffi_kernel32.TerminateProcess( child.hProcess , 258 );
			}
		}
		
		help_close_handles( child );
		
		child = null;
	}
	
	return capture.stdout;
}
exports.execSync = execSync;

// use shell , not wait , not output 
function shell_exec( commandline  )
{
	var child = help_child_process_spawn( commandline , { useStdHandles : true , shell : true } );

	
	if ( child )
	{
		help_close_handles( child );
		
		child = null;
		
		return 0;
	}
	
	return -1;
}
exports.shell_exec = shell_exec;

function shell_execSync( commandline , options )
{
	var child = help_child_process_spawn( commandline , { useStdHandles : true  , shell : true } );
	var capture = null;
	
	if( child )
	{
		capture = help_child_process_capture( child , options);
		
		// hProcess
		if ( child.hProcess )
		{
			if ( capture.timeout )
			{
				ffi_kernel32.TerminateProcess( child.hProcess , 258 );
			}
		}
		
		help_close_handles( child );
		
		child = null;
	}
	
	return capture.stdout;
}
exports.shell_execSync = shell_execSync;


// multi
function WaitForMultipleObjects( handleArray , bWaitAll  , timeout )
{
	var lpHandleArray = null;
	var pointerSize = ("x64" == process.arch) ? 8 : 4;
	var index = 0;
	var waitRet = 0;
	
	do
	{
		assert( _.isArray(handleArray) , "handleArray must be array" );
		
		assert( ( 0 != handleArray.length ) , "handleArray must not empty" );
		
		lpHandleArray = Buffer.alloc( pointerSize * handleArray.length ).fill(0);
		
		for ( index = 0; index < handleArray.length; index++ )
		{
			lpHandleArray.writePointer( handleArray[index] , index * pointerSize );
		}
		
		waitRet = ffi_kernel32.WaitForMultipleObjects(
				handleArray.length , 
				lpHandleArray , 
				bWaitAll ,
				timeout || -1
		);
				
	}while(false);
	
	
	if ( lpHandleArray )
	{
		lpHandleArray.free();
		lpHandleArray = null;
	}

	return waitRet;
}

// no output
function multi_exec( fnProvider ,  arg_maxInstances )
{
	assert( _.isFunction(fnProvider) , "provider must be function" );

	var childArray = [];
	var child = null;
	var handleArray = [];
	var maxInstances = arg_maxInstances || 63;

	var waitRet = 0;
	
	var signalHandle = null;
	var index = 0;
	
	var provideInfo = null;
	
	var finalRet = true;
	
	while( true )
	{
		if ( handleArray.length >= maxInstances )
		{
			waitRet = WaitForMultipleObjects( handleArray , false , 1000 );
			
			if ( 0 == Number64.compareSigned32( waitRet , -1 ) )
			{	
				// wait faild
				finalRet = false;
				break;
			}
			else if ( 0x102 == waitRet )
			{
				// WAIT_TIMEOUT
				base.sleep( 1000 );
				continue;
			}
			else
			{
				assert(  ( waitRet <=  ( handleArray.length - 1) , "invalid wait ret" ) );
				
				// find and remove handle
				
				// close handle handle
				signalHandle = handleArray[ waitRet ];
				handleArray.splice( waitRet , 1 );
				ffi_kernel32.CloseHandle( signalHandle ) ;
				
				// remove from childArray
				childArray.splice( waitRet , 1 );
			
			}
		}
	
	
		if ( handleArray.length < maxInstances )
		{
			provideInfo = fnProvider( );
			if ( !provideInfo )
			{
				break;
			}
			
			if ( _.isString(provideInfo) )
			{
				child = help_child_process_spawn( provideInfo );
			}
			else
			{
				assert( _.isObject(provideInfo) );
				
				child = help_child_process_spawn( provideInfo.commandline , provideInfo.option  );
			}
	
			if ( !child )
			{
				break;
			}
			
			help_close_handles_all_but_hProcess( child );
			
			childArray.push( child );
			handleArray.push( child.hProcess );
		}
	}
	

	// wait left all childs
	if ( handleArray.length > 0 )
	{
		waitRet = WaitForMultipleObjects( handleArray , true , -1 );
		
		for( index = 0; index < handleArray.length; index++ )
		{
			// find and remove handle
					
			// close handle handle
			signalHandle = handleArray[ index ];
			handleArray.splice( index , 1 );
			ffi_kernel32.CloseHandle( signalHandle ) ;
					
			// remove from childArray
			childArray.splice( index , 1 );
		}
	}
	
	return finalRet;
}
exports.multi_exec = multi_exec;




function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}