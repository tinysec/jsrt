'use strict';


const _ = require("underscore");
const assert = require("assert");
const path = require("path");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;


// fs
function fs_readTextFile(arg_filename) 
{
    var param_codepage = 65001;
    var param_method = 0;
    var param_offset = 0;
    var param_length = -1;

    return process.reserved.bindings.fs_readTextFile(arg_filename, param_codepage, param_method, param_offset, param_length);
}



//-------------------------------------------------

function Module(id, parent) {
    this.id = id;
    this.exports = {};
    this.parent = parent;

    if (parent && parent.children) 
	{
        parent.children.push(this);
    }

    this.filename;
    this.children = [];
    this.searchPaths = [];
}

Module._cache = {};

const BUILTIN_MODULE_NAME_TABLE = [
	
	
	// depend
	"underscore" , 

	// core
    "assert",
	"base" ,
	"cprintf" ,
	"ffi" ,
	"fs" ,
	"path" ,
	"serialize" ,
	"intrinsic" ,
	
	// std
	"os" ,
	"child_process" ,
	"thread" ,
	
	// 3rd
	"3rd/capstone" ,
	"3rd/keystone" ,
	"3rd/unicorn" ,
	
	"3rd/sqlite3" ,
	
	// win32
	"win32/native" , 
	
	"win32/pdb" ,
	
	"win32/auth" ,
	
	"win32/toolhelp" ,
	
	"win32/ioctl" ,
	
	"win32/sysinfo",
	
	"win32/message" ,
	
	"win32/pe" ,
	
	"win32/fileversion"
	

];
process.builtInModules = BUILTIN_MODULE_NAME_TABLE;

function stripBOM(content) 
{
    if (content.charCodeAt(0) === 0xFEFF) 
	{
        content = content.slice(1);
    }

    return content;
}

function removeSheBang(content) 
{
    if (content.charCodeAt(0) === 0xFEFF) 
	{
        content = content.slice(1);
    }

    return content;
}


function addEnvPaths(destPaths, envKeyName) 
{
    var envPaths = null;
    var envValue = process.env[envKeyName];

    if (!envValue) 
	{
        return destPaths;
    }

    envPaths = envValue.split(";");

    envPaths = _.map(envPaths, function (item) 
	{
        return path.normalize(item.trim().toLowerCase());
    });

    envPaths = _.map(envPaths, function (item) 
	{
        return path.removeBackslash(item);
    });

    destPaths = _.union(destPaths, envPaths);

    return destPaths;
}

function buildSearchPaths(arg_name, arg_searchPaths) 
{
    var searchPaths = [];
    var testPath = '';

	
	// system module first
	searchPaths = addEnvPaths(searchPaths, "JSRT_SYSTEM_MODULE_PATH" );
	
	testPath = path.combine( process.execDirectory.toLowerCase() , "jsrt_modules" );
    if (-1 == searchPaths.indexOf(testPath)) 
	{
        searchPaths.push(testPath);
    }


	var findname = path.normalize(arg_name);

    if ( path.folderExists(findname) ) 
	{
        searchPaths.push(findname.toLowerCase() );
    }

    if (arg_searchPaths) 
	{
        searchPaths = _.union(searchPaths, arg_searchPaths);
    }

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

    if ("windbg" == host.type) 
	{
        searchPaths = addEnvPaths(searchPaths, "JSRT_WINDBG_MODULE_PATH");
    }
    else if ("ida" == host.type) 
	{
        searchPaths = addEnvPaths(searchPaths, "JSRT_IDA_MODULE_PATH");
    }
    else 
	{

    }

    searchPaths = addEnvPaths(searchPaths, "JSRT_MODULE_PATH");

    searchPaths = _.filter(searchPaths, function (item) 
	{
        return (0 != item.length) && path.folderExists(item);
    });

    searchPaths.forEach(function (item, index, thisArray) 
	{
        var newItem = path.combine(item, "jsrt_modules");

        if ( path.folderExists(newItem) ) 
		{
            if (-1 == thisArray.indexOf(newItem)) 
			{
                thisArray.splice(index + 1, 0, newItem);
            }

        }
    });

    return searchPaths;
}

function getMainFileFromDirectory(basefolder) 
{
    var package_json_filename = path.combine(basefolder, "package.json");
    var package_json_filecontent = '';
    var package_json_object = null;
    var package_json_main_value = '';
    var package_json_main_filename = '';

    var index_filename = '';

    if (path.fileExists(package_json_file)) 
	{
        package_json_filecontent = fs_readTextFile(package_json_file);
        if (0 == package_json_filecontent.length) 
		{
            throw new Error(sprintf("empty package.json file %s\n", basefolder));
        }

        package_json_object = JSON.parse(package_json_filecontent);
        if (!package_json_object) 
		{
            throw new Error(sprintf("invalid package.json file %s\n", basefolder));
        }

        if (_.has(package_json_object, "main")) 
		{
            package_json_main_value = package_json_object["main"];

            if (!_.isString(package_json_main_value)) 
			{
                throw new Error(sprintf("invalid package.json file %s\n", basefolder));
            }

            if (0 == package_json_main_value.length) 
			{
                throw new Error(sprintf("invalid package.json file %s\n", basefolder));
            }

            package_json_main_value = path.normalize(package_json_main_value);

            if (path.fileExists(package_json_main_value)) 
			{
                return package_json_main_value;
            }
            else 
			{
                package_json_main_filename = path.combine(basefolder, package_json_main_value);
                if (path.fileExists(package_json_main_filename)) 
				{
                    return package_json_main_filename;
                }

                package_json_main_filename = package_json_main_filename + ".js";
                if (path.fileExists(package_json_main_filename)) 
				{
                    return package_json_main_filename;
                }
            }

            throw new Error(sprintf("not foud %s in %s", package_json_object["main"], package_json_filename));
        }
    }

    index_filename = path.combine(src_path, "index.js");
    if (path.fileExists(index_filename)) {
        return index_filename;
    }

    return;
}

Module._resolveFile = function (arg_name, arg_parent, arg_isMain) 
{
    var searchPaths = [];
    var mainFileName = '';
    var index = 0;
    var testFileName = '';

    assert(_.isString(arg_name));

    var findName = path.toWin32Style(arg_name);
	
    if ( path.fileExists(findName) ) 
	{
        return findName;
    }

    searchPaths = buildSearchPaths(findName, arg_parent ? arg_parent.searchPaths : null);

    KdPrint("find %s use searchPath: %s\n", arg_name, searchPaths);

    // add 
    for (index = 0; index < searchPaths.length; index++) 
	{
        testFileName = path.combine(searchPaths[index], findName);

        if (path.fileExists(testFileName)) 
		{
            return testFileName;
        }
        else if (path.folderExists(testFileName)) 
		{
            mainFileName = getMainFileFromDirectory(searchPaths[index]);
            if (mainFileName) 
			{
                return mainFileName;
            }
        }
        else 
		{
            testFileName = path.combine(searchPaths[index], findName + ".js");
            if (path.fileExists(testFileName)) 
			{
                return testFileName;
            }
        }
    }

    return;
}

Module.staticLoadFile = function (arg_requestName, arg_parent, arg_isMain) 
{
    if (!arg_requestName)
	{
        return;
    }

    var requestName = arg_requestName.toLowerCase();
    var filename = null;
    var cachedModule = null;
	
    filename = Module._resolveFile(requestName, arg_parent, arg_isMain);

    cachedModule = null;

    if (!filename) 
	{
        throw new Error(sprintf("not found %s", arg_requestName));
    }

    filename = filename.toLowerCase();

    if (!arg_isMain) 
	{
        cachedModule = Module._cache[filename];
        if (cachedModule) 
		{
            return cachedModule.exports;
        }
    }

    var NewModule = new Module(filename, arg_parent);

    if (arg_isMain) 
	{
        process.mainModule = NewModule;
        NewModule.id = '.';
    }
    else 
	{
        Module._cache[filename] = NewModule;
    }

    var execRet;

    try 
	{
        execRet = NewModule._loadFile(filename);
    }
    catch (err) 
	{
        delete Module._cache[filename];
        printf("load file %s error %s\n", filename, err);
    }

    if (arg_isMain) 
	{
        return execRet;
    }
    else 
	{
        return NewModule.exports;
    }
}

Module.staticRunMainFile = function () 
{
    return Module.staticLoadFile(process.argv[1], null, true);
}


Module.staticRunEval = function () 
{
    var filecontent = process.argv[1];

    if (!filecontent) 
	{
        return;
    }

    var NewModule = new Module();

    process.mainModule = NewModule;
    NewModule.id = '.';

    var execRet;

    try 
	{
        execRet = NewModule._loadFromContent(filecontent, "eval code");
    }
    catch (err) 
	{
        printf("eval error %s\n", err);
    }

    return execRet;
}

Module.staticRunContentWithFilename = function ( filecontent , fileName ) 
{
    var NewModule = new Module();

    process.mainModule = NewModule;
    NewModule.id = '#';
	NewModule.parent = {};
	
    NewModule._loadFromContent(filecontent , fileName);
   
    return NewModule.exports;
}


Module._staticLoadBuildInModule = function (requestName, arg_parent, arg_isMain) 
{
    var cachedModule = null;

    cachedModule = Module._cache[requestName];
    if (cachedModule) 
	{
        return cachedModule.exports;
    }

    var buildInFileInfo = process.reserved.bindings.module_findInternalFile(requestName);
    if (!buildInFileInfo) 
	{
        throw new Error(sprintf("not found build-in lib %s", requestName));
    }

    var NewModule = new Module(requestName, arg_parent);

    if (arg_isMain) 
	{
        process.mainModule = NewModule;
        NewModule.id = '.';
    }

    Module._cache[requestName] = NewModule;

    try 
	{
        NewModule._loadFromContent(buildInFileInfo.content, buildInFileInfo.name);
    }
    catch (err) 
	{
        delete Module._cache[requestName];

        throw err;
    }

    return NewModule.exports;
}

Module.prototype._loadFile = function (arg_filename) 
{
    this.searchPaths.push(path.removeFileSpec(arg_filename));

    var fileContent = fs_readTextFile(arg_filename, "utf-8");
	
	var extname = path.extname(arg_filename);
	
	if ( ".json" == extname )
	{
		this.exports = JSON.parse( fileContent );
		
		return this.exports;
	}
	else
	{
		 return this._loadFromContent(fileContent, arg_filename);
	}
}



Module.prototype._loadFromContent = function (fileContent, arg_filename) {
    var self = this;
    var dirname;

    if (arg_filename) 
	{
        dirname = path.removeFileSpec(arg_filename);
        this.filename = arg_filename;
    }

    if (this.parent && this.parent.searchPaths)
	 {
        this.searchPaths = _.union(this.searchPaths, this.parent.searchPaths);
    }

    if (0 == fileContent.length) 
	{
        return;
    }

    var fileAsRoutine = Module.prototype._compile(fileContent, arg_filename);

    var param0_this = {};

    var param2_require = function require(arg_requestName) 
	{
        assert(_.isString(arg_requestName));
        assert(0 != arg_requestName.length);

        var requestName = arg_requestName.toLowerCase();
        var cachedModule = null;
		var newExports = null;

		cachedModule = process.reserved.NativeModule._cache[requestName];
        if (cachedModule) 
		{
             return cachedModule.exports;
        }

		cachedModule = Module._cache[requestName];
        if (cachedModule) 
		{
             return cachedModule.exports;
        }

		if ( -1 != BUILTIN_MODULE_NAME_TABLE.indexOf( requestName ) )
		{
			return process.reserved.NativeModule.require(requestName);
		}
		else
		{
			return Module.staticLoadFile(requestName, self, false);
		}
		
    };


    return fileAsRoutine.call(
        param0_this,
        this.exports,
        param2_require,
        this,
        this.filename,
        dirname
    );
}



const MODULE_WRAPPER = [
    '"use strict";\n(function(exports, require, module, __filename, __dirname) { ',
    '\n});'
];

function wrap_source(script) 
{
    return MODULE_WRAPPER[0] + script + MODULE_WRAPPER[1];
};

Module.prototype._compile = function (fileContent, filename) 
{
    if (0 == fileContent.length) {
        return;
    }

    var wrappedContent = wrap_source(fileContent);

    return process.reserved.bindings.chakra_runScript(wrappedContent, filename);
}


module.exports = Module;
//---------------------------------------------------------
	
	
function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}
