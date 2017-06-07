(function boot(__GLOBAL) {

    function runAtRootNamespace(name) 
	{
        var fileinfo = process.reserved.bindings.module_findInternalFile(name);
        if (!fileinfo) 
		{
            throw new Error("not found " + name);
        }

        process.reserved.bindings.chakra_runScript(fileinfo.content, fileinfo.name);
    }

    function NativeModule(id , parent ) 
	{
        this.id = id;
        this.exports = {};
		this.parent = parent;
    }

    NativeModule._cache = {};

    function removeSheBang(content) 
	{
        if (content.charCodeAt(0) === 0xFEFF) 
		{
            content = content.slice(1);
        }

        return content;
    }

    NativeModule.require = function (requestName , parent ) 
	{
        var cachedModule = null;

        cachedModule = NativeModule._cache[requestName];
        if (cachedModule) 
		{
            return cachedModule.exports;
        }

        var buildInFileInfo = process.reserved.bindings.module_findInternalFile(requestName);
        if (!buildInFileInfo) 
		{
            throw new Error("not found build-in lib " + requestName);
        }
		
		// dummy
        var NewModule = new NativeModule(requestName , parent || {} );


        NativeModule._cache[requestName] = NewModule;

        try 
		{
            NewModule._loadFromContent(buildInFileInfo.content, buildInFileInfo.name);
        }
        catch (err) 
		{
            delete NativeModule._cache[requestName];
            throw err;
        }
		
		buildInFileInfo.content = null;
		buildInFileInfo = null;
		
        return NewModule.exports;
    }


    NativeModule.prototype._loadFromContent = function (fileContent, arg_filename) 
	{
        var self = this;

        if (0 == fileContent.length) 
		{
            return;
        }

        var fileAsRoutine = NativeModule.prototype._compile(fileContent, arg_filename);

        var param0_this = {};
        var param2_require = function require(arg_requestName) 
		{
            var requestName = arg_requestName.toLowerCase();
            var cachedModule = null;

            cachedModule = NativeModule._cache[requestName];
            if (cachedModule) 
			{
                return cachedModule.exports;
            }

            return NativeModule.require(requestName , self);
        };


        return fileAsRoutine.call(
            param0_this,
            this.exports,
            param2_require,
            this
        );
    }


    const MODULE_WRAPPER = [
        '"use strict";\n(function(exports, require, module) { ',
        '\n});'
    ];

    function wrap_source(script) 
	{
        return MODULE_WRAPPER[0] + script + MODULE_WRAPPER[1];
    };

    NativeModule.prototype._compile = function (fileContent, filename) 
	{
        if (0 == fileContent.length) 
		{
            return;
        }

        var wrappedContent = wrap_source(fileContent);

        return process.reserved.bindings.chakra_runScript(wrappedContent, filename);
    }


    function pre_init_process() 
	{
        // zero-depends
        process.reserved.wrapper = {};
        process.reserved.entryContext = {};

        process.reserved.tables = {};
		process.reserved.runtime = {};

        // exitCode
        process.exitCode = undefined;

        // verbose
        process.verbose = false;

        // version
        process.version = "";
        process.versionNumber = process.reserved.bootContext.version;

        // arch
        process.arch = process.reserved.bootContext.arch;

        // platform
        process.platform = process.reserved.bootContext.platform;

        // wow64
        process.wow64 = process.reserved.bootContext.wow64;
		
		// OS info
		process.OSMajorVersion = process.reserved.bootContext.OSMajorVersion;
		process.OSMinorVersion = process.reserved.bootContext.OSMinorVersion;
		process.OSBuildNumber = process.reserved.bootContext.OSBuildNumber;
		process.OSServicePackMajor = process.reserved.bootContext.OSServicePackMajor;
		process.OSServicePackMinor = process.reserved.bootContext.OSServicePackMinor;
		process.OSPlatformId = process.reserved.bootContext.OSPlatformId;
		process.OSSuiteMask = process.reserved.bootContext.OSSuiteMask;
		process.OSProductType = process.reserved.bootContext.OSProductType;
		
		process.OSArch = process.reserved.bootContext.OSArch;

        // compiledArch
        process.compiledArch = process.reserved.bootContext.compiledArch;

        // __TIME__
        process.compiledTime = process.reserved.bootContext.__TIME__;

        // __DATE__
        process.compiledDate = process.reserved.bootContext.__DATE__;

        // pid
        process.pid = process.reserved.bootContext.pid;

        // __DATE__
        process.tid = process.reserved.bootContext.tid;
		
		// ppid
        process.ppid = process.reserved.bootContext.ppid;
		
		// pebAddress
        process.pebAddress = process.reserved.bootContext.pebAddress;

        // execPath
        process.execPath = process.reserved.bootContext.execPath;
        process.execDirectory = "";

        // engine
        process.engine = process.reserved.bootContext.engine;

        // enginePath
        process.enginePath = process.reserved.bootContext.enginePath;
        process.engineDirectory = "";

        // currentDirectory
        process.currentDirectory = process.reserved.bootContext.currentDirectory;
		
        // env
        process.env = process.reserved.bootContext.env;

        // init 
        process.compiledType = process.reserved.bootContext.compiledType;
        process.hostVersionNumber = process.reserved.bootContext.hostVersionNumber || 0;

        // argv
        process.argv = [process.execPath];

        delete process.reserved.bootContext;
    }
	
	function pre_init_host() 
	{
        // zero-depends
   
		if ("console" == process.compiledType) 
		{
            if ( process.env["GATEWAY_INTERFACE"] ) 
			{
                host.type = "cgi";
            }
            else 
			{
                host.type = "console";
            }
        }
        else if ( "window" == process.compiledType ) 
		{
            host.type = "window";
        }
        else if ( "windbg" == process.compiledType ) 
		{
            host.type = "windbg";
        }
        else if ( "ida" == process.compiledType ) 
		{
            host.type = "ida";
        }
        else 
		{
            throw new Error( "unknown host type" );
        }
		
        
    }
	
	
	function post_init_process() 
	{
		const path = NativeModule.require("path");
		
		const base = NativeModule.require("base");

		const printf = NativeModule.require("cprintf").printf;
        const sprintf = NativeModule.require("cprintf").sprintf;
		
		process.execDirectory = path.removeFileSpec( process.execPath );
		
		process.engineDirectory = path.removeFileSpec( process.enginePath );

        process.version = sprintf("%d.%d.%d.%d",
            base.HIBYTE(base.HIWORD(process.versionNumber)),
            base.LOBYTE(base.HIWORD(process.versionNumber)),
            base.HIBYTE(base.LOWORD(process.versionNumber)),
            base.LOBYTE(base.LOWORD(process.versionNumber))
        );
		
		process.reserved.NativeModule = NativeModule;
		
		Object.defineProperty(process, 'reserved', {
			enumerable: false
		});
    }
	
	function init_console() 
	{
		// console
		const printf = NativeModule.require("cprintf").printf;
        const sprintf = NativeModule.require("cprintf").sprintf;
		const _ = NativeModule.require("underscore");
		const assert = NativeModule.require("assert");
		
		
		__GLOBAL["alert"] = function alert() 
		{
			var totaltext = sprintf.apply(this , arguments);
			process.reserved.bindings.host_alert(totaltext);
		}
		
		__GLOBAL["console"] = {};
		console.log = function console_log() 
		{
			var totaltext = sprintf.apply(this , arguments);
			printf(totaltext + "\n");
		}
        
		console.input = function( )
		{
			var argv = Array.prototype.slice.call(arguments);
			var maxLength = 1024;
			
			if ( 0 != arguments.length )
			{
				if ( _.isNumber( arguments[0] ) )
				{
					assert( ( 0 < arguments[0] ) , "invalid max input length");
				
					maxLength = arguments[0];
					
					argv.shift();
					printf.apply(this , argv);
				}
				else
				{
					printf.apply(this , arguments);
				}
			}
			
			var text = process.reserved.bindings.host_input(maxLength);
			
			// remove last \n
			if ( 0 != text.length )
			{
				if ( '\n' == text.charAt( text.length - 1 ) )
				{
					text = text.substr( 0 , text.length - 1 );
				}
			}
			
			return text;
		}
    }

    function startup()
	{
		// zero-depends
        pre_init_process();
		
		// zero-depends
		pre_init_host();

		__GLOBAL["Number64"] = NativeModule.require("number64");
		
		init_console();
	
		__GLOBAL["Buffer"] = NativeModule.require("Buffer");
		
		// post init process
		post_init_process();
	
		// extend
		NativeModule.require("internal/extend");

		NativeModule.require("host/common");

        return 0;
    }

    return startup();
})(this);
