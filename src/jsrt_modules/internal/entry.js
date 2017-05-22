'use strict';
(function entrypoint(__GLOBAL) {
    const require = process.reserved.NativeModule.require;

    const printf = require("cprintf").printf;
    const sprintf = require("cprintf").sprintf;
    const KdPrint = require("cprintf").KdPrint;

    const _ = require("underscore");

    const Module = require("Module");
	
	const base = require("base");

    var EXEC_ARG_OPTION_TABLE = [
        {
            "name": "version",
            "type": "boolean",
            "description": "show version"
        },

        {
            "name": "verbose",
            "type": "boolean",
            "description": "verbose mode"
        },

        {
            "name": "help",
            "type": "boolean",
            "description": "show help"
        },

        {
            "name": "eval",
            "type": "boolean",
            "description": "eval mode"
        }
    ];

   

    function findArgOption(name) 
	{
        return _.find(EXEC_ARG_OPTION_TABLE, function (item) 
		{
            if (item.name == name) 
			{
                return true;
            }
        });
    }

    function printVersion() 
	{
        var startupText = '';

        startupText += sprintf("javascript runtime(JSRT) %s(%s) version: %s build: %s %s\n",
            process.platform,
            process.arch,
            process.version,
            process.compiledDate,
            process.compiledTime
        );

        printf(startupText);
        return 0;
    }

    function printHelp() 
	{
        var arg0Name = '';

        if ("console" == process.hostType) 
		{
            arg0Name = "js";
        }
        else if ("cgi" == process.hostType) 
		{
            arg0Name = "js";
        }
        else if ("window" == process.hostType) 
		{
            arg0Name = "js";
        }
        else if ("windbg" == process.hostType) 
		{
            arg0Name = "!js";
        }
        else if ("ida" == process.hostType) 
		{
            arg0Name = "";
        }

        printf("Usage: %s [options] [--eval script or script.js] [arguments]\n\n", arg0Name);

        printf("Options: \n");

        _.each(EXEC_ARG_OPTION_TABLE, function (item) 
		{
            if (item.name.length <= 4) {
                if ("windbg" == process.hostType) {
                    printf(" --%s\t%s\n", item.name, item.description);
                }
                else {
                    printf(" --%s\t\t%s\n", item.name, item.description);
                }
            }
            else {
                printf(" --%s\t%s\n", item.name, item.description);
            }
        });

        printf("\n\n");

        printf("Environment: \n");
		printf("JSRT_SYSTEM_MODULE_PATH\t\tsystem jsrt module search path\n");
        printf("JSRT_MODULE_PATH\t\tcommon jsrt module search path\n");
        printf("JSRT_IDA_MODULE_PATH\t\tjsrt-ida module search path\n");
        printf("JSRT_WINDBG_MODULE_PATH\t\tjsrt-windbg module search path\n");

        printf("\n\n");

		printf("more info is at https://github.com/tinysec/jsrt\n");

		printf("\n\n");

        return 0;
    }


    function parseEntryCommandLine() 
	{
		var rawCmdline = '';
        var rawArgv = null;
        var index = 0;

        var argItem = '';
        var argKey = '';
        var argValue = '';

        var argEqualPos = -1;
        var argMainIndex = -1;

        var argOption = null;
		
		rawCmdline = process.reserved.entryContext.rawCmdline;
		
		delete process.reserved.entryContext;

        // reset
		
		process.argv = [process.execPath];
		process.args = {};
		
        process.execArgv = [];
        process.execArgs = {};
		
        

        if ("ida" == process.hostType) 
		{
            if (0 == rawCmdline.length) 
			{
                argValue = process.env["JSRT_BATCH_COMMANDLINE"];

                if (argValue && argValue.length != 0) 
				{
                    rawCmdline = argValue;
                }
            }
        }

        if (0 == rawCmdline.length) 
		{
            printHelp();
            return;
        }

        rawArgv = base.cmdlineToArgv(rawCmdline);

        if (0 == rawArgv.length) 
		{
            printHelp();
            return;
        }

        if (("console" == process.hostType)
            || ("cgi" == process.hostType)
            || ("window" == process.hostType)
        ) 
		{
            rawArgv.shift();

            if (0 == rawArgv.length) 
			{
                printHelp();
                return;
            }
        }

        for (index = 0; index < rawArgv.length; index++) 
		{
            argItem = rawArgv[index];

            if (-1 == argMainIndex)
			 {
                if (0 == argItem.indexOf("--")) 
				{
                    process.execArgv.push(argItem);
                }
                else 
				{
                    argMainIndex = index;

                    process.argv.push(argItem);
                }
            }
            else
			{
                process.argv.push(argItem);
            }
        }

        // convert execArgv to execArgs
        for (index = 0; index < process.execArgv.length; index++) 
		{
            argItem = process.execArgv[index];

            argEqualPos = argItem.indexOf("=");

            if (-1 == argEqualPos) 
			{
                argKey = argItem.substring(2, argItem.length).toLowerCase();
                argValue = "";
            }
            else 
			{
                argKey = argItem.substring(2, argEqualPos).toLowerCase();
                argValue = argItem.substring(argEqualPos + 1, argItem.length);
            }
			
			if ( !argKey )
			{
				continue;
			}

            argOption = findArgOption(argKey);

            if (!argOption) 
			{
                printf("unknown exec arg %s\n", argItem);
                return;
            }

            if (argOption.type) 
			{
                if ("boolean" == argOption.type) 
				{
                    if (0 == argValue.length) 
					{
                        process.execArgs[argKey] = true;
                    }
                    else 
					{
                        process.execArgs[argKey] = parseInt(argValue) ? true : false;
                    }
                }
            }
            else 
			{
                process.execArgs[argKey] = true;
            }
        }
		
		//KdPrint( "execArgv = %s\n", process.execArgv );
        //KdPrint( "execArgs = %s\n", process.execArgs );
		
        // update verbose
        if (_.has(process.execArgs, "verbose")) 
		{
            if (process.execArgs.verbose) 
			{
                printf("[jsrt] verbose mode\n");
            }
            else 
			{
                KdPrint("[jsrt] verbose mode off\n");
            }

            process.verbose = process.execArgs.verbose || false;
        }
		
		
		//
		// convert argv to args
        for (index = 2; index < process.argv.length; index++) 
		{
            argItem = process.argv[index];

            argEqualPos = argItem.indexOf("=");

            if (-1 == argEqualPos) 
			{
                argKey = argItem.substring(2, argItem.length).toLowerCase();
                argValue = "";
            }
            else 
			{
                argKey = argItem.substring(2, argEqualPos).toLowerCase();
                argValue = argItem.substring(argEqualPos + 1, argItem.length);
            }
			
			if ( argKey )
			{
				process.args[argKey] = argValue;
			}
        }
		
		// KdPrint("argv = %s\n", process.argv );
       // KdPrint("args = %s\n", process.args );
		

        // --version
        if (process.execArgs.version) 
		{
            printVersion();
        }

        // --help
        if (process.execArgs.help) 
		{
            printHelp();
        }

        // exec
        if (process.argv.length >= 1) 
		{
            // process execArgs
            if (process.execArgs.eval) 
			{
                KdPrint("eval mode\n");
                return Module.staticRunEval();
            }
            else 
			{
                return Module.staticRunMainFile()
            }
        }
    }

    function entryPostCheck() 
	{
        process.reserved.dumpBufferLeaks();

        return 0;
    }

	function entryMain()
	{


		parseEntryCommandLine();
		entryPostCheck();	
	}
   
    return entryMain();

})(this);
