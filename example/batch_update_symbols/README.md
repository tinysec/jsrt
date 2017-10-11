# batch update windows symbols

![snap](snap.png)


```javascript
'use strict';

/*
	batch update windows symbols file 
*/


const CONFIG_CHECK_FOLDER = [
			"c:\\windows" ,
			"C:\\Program Files" ,
			"c:\\C:\Program Files (x86)" ,
		];
		
const CONFIG_MAX_WORKER = 20;
		
//-----------------------------------------------------------------
const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

const fs = require("fs");

const path = require("path");

const pdb = require("win32/pdb");

const isPEFile = require("win32/pe").isPEFile;

const child_process = require("child_process");

const host_console = require("host/console");


//-----------------------------------------------------------------
function build_worker_commandline( arg_filefullname , symbolpath  )
{
	return sprintf( '%s %s --worker=1 --file=%s --symbolpath="%s"' ,
		
		process.argv[0] ,
		
		__filename ,
		
		arg_filefullname ,
		
		symbolpath
	
	);
}

function sub_find_files( manager , arg_baseFolder )
{
	if ( !arg_baseFolder )
	{
		return;
	}
			
	var items = null;
			
	var fullname = null;
			
	var findNewItem = false;
			
	printf("[+] check folder %s\n" , arg_baseFolder );
	
	items = fs.readdir( arg_baseFolder );
	if ( !items )
	{
		return false;
	}
			
	_.each( items , function( basename )
	{
		fullname = path.combine( arg_baseFolder , basename );
					
		if ( path.folderExists( fullname ) )
		{
			manager.folderQueue.push( fullname );
					
			findNewItem = true;
		}
		else
		{
			manager.total_file_count++;
					
			if ( isPEFile( fullname ) )
			{
				manager.fileQueue.push( fullname );
						
		
				findNewItem = true;
						
				manager.pe_file_count++;
			}
					
			host_console.setTitle( sprintf( "[+] find %d/%d files\n" , 
						manager.pe_file_count , manager.total_file_count ) 
			);
		}
					
	});
				
	return findNewItem;
}
		
function work_as_master( )
{

	
	var index = 0;

	var manager = {};
	
	var noMoreFiles = false;
	
	var folderName = '';
	
	do
	{
		if ( process.argv.length <= 2 )
		{
			printf('batch update symbols tool.\n');
			
			printf('v0.0.0.1\n');
			
			printf('--symbolpath\tlocal symbol folder\n');
			
			printf('\n');
			
			printf('usage:\n');
			
			printf('js.exe batch_update_symbols.js --symbolpath=c:\\symbols\n' );
			
			printf('\n\n');
			
			break;
		}
		
		if ( !process.args.symbolpath )
		{
			printf("[-] need --symbolpath");
			break;
		}
		
		//init
		
		manager.fileQueue = [];
		manager.folderQueue = [];
		
		manager.pe_file_count = 0;
		manager.total_file_count = 0;
		
		manager.folderQueue = CONFIG_CHECK_FOLDER;
		
		printf("[+] recu update symbols files in %s\n" , manager.folderQueue );
		
		folderName = manager.folderQueue.shift();
		
		sub_find_files( manager , folderName );

		
		function multi_exec_provider()
		{
			var provideInfo = null;
			var filefullname = '';
			
			
			if ( 0 == manager.fileQueue.length  )
			{
				if ( 0 == manager.folderQueue.length )
				{
					return;
				}
				else
				{
					while( true )
					{
						if ( 0 == manager.folderQueue.length )
						{
							noMoreFiles = true;
							break;
						}
						
						folderName = manager.folderQueue.shift();
						
						sub_find_files( manager , folderName );
						
						if ( 0 != manager.fileQueue.length  )
						{
							break;
						}
						
					}
				}
			}
			
			if ( noMoreFiles )
			{
				return;
			}
			
			provideInfo = {};
				
			filefullname = manager.fileQueue.shift();
				
			provideInfo.commandline = build_worker_commandline( filefullname  , process.args.symbolpath );	
			
			return provideInfo;
		}
		
		
		child_process.multi_exec( multi_exec_provider ,  CONFIG_MAX_WORKER );
		
		printf("[+] done.\n");
		
	}while(false);
	
	
	return 0;
}


function work_as_worker()
{
	var bFlag = false;
	
	var filefullname = process.args.file;
	
	var symbolFileName = '';
	
	var symbols_array = [];
	
	do
	{
		symbols_array.push( process.args.symbolpath );
		
		symbols_array.push( sprintf( "SRV*%s*http://msdl.microsoft.com/download/symbols" , process.args.symbolpath ) );
		
		bFlag = pdb.init( symbols_array );
		
		if ( !bFlag )
		{
			printf("[-] pdb init faild\n");
			break;
		}
		
		symbolFileName = pdb.loadSymbolFile( filefullname );
		if ( !symbolFileName )
		{
			printf( "[-] load symbol for %s faild\n" , filefullname );
			break;
		}
		
		printf("[+] load symbol for %s ok\n" , filefullname );
		
	}while(false);
	
	
	pdb.clean();
	
	return 0;
}

function main(  )
{
	if ( process.args.worker )
	{
		work_as_worker();
	}
	else
	{
		work_as_master( );
	}
	
	return 0;
}

if ( !module.parent )
{
	main();
}

```

