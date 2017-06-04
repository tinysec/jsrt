'use strict';


const assert = require("assert");
const _ = require("underscore");


//---------------------------------------------------------
function path_toWin32Style(arg_src_path) 
{
    assert(_.isString(arg_src_path), "arg_src_path must be a string");

    return arg_src_path.replace(/\//g, '\\');
}
exports.toWin32Style = path_toWin32Style;

function path_removePrefix(arg_src_path) 
{
    if (0 == arg_src_path.indexOf("\\\\?\\")) 
	{
        return arg_src_path.substring("\\\\?\\".length);
    }
    else 
	{
        return arg_src_path;
    }
}

//---------------------------------------------------------
function path_normalize(src_path) 
{
    assert(_.isString(src_path));

    if (0 == src_path.length) 
	{
        return src_path;
    }

    var dest_path = path_toWin32Style(src_path);
	
    dest_path = dest_path.trim();

    dest_path = process.reserved.bindings.path_normalize(dest_path);

    return path_removePrefix(dest_path);
}
exports.normalize = path_normalize;


function path_basename( arg_src_path ) 
{
	var src_path = path_normalize( arg_src_path );
	
	src_path = path_removeBackslash( src_path );
	
	var lastPos = src_path.lastIndexOf('\\');
	
	if ( -1 == lastPos )
	{
		return "";
	}
	
	return src_path.substring( lastPos + 1 ,  src_path.length );
}
exports.basename = path_basename;

function path_dirname(arg_src_path) 
{
	var src_path = path_normalize( arg_src_path );
	return path_combine( src_path , "..");
}
exports.dirname = path_dirname;


// path.resolve([...paths])
function path_resolve( ) 
{
	var index = 0;
	var testPath = '';
	
	assert( arguments.length >= 1 );
	
	testPath = process.currentDirectory;
	
	for ( index = 0; index < arguments.length ; index++ )
	{
		testPath = path_combine(  testPath , arguments[index] );
	}

	return testPath;
	
}
exports.resolve = path_resolve;

// path.relative(from, to)
function relative( ) 
{

}
// exports.relative = relative;

function path_fileExists(arg_src_path) 
{
    assert(_.isString(arg_src_path));

    if (0 == arg_src_path.length)
	{
        return false;
    }

    var src_path = path_normalize(arg_src_path);

    return process.reserved.bindings.path_fileExists("\\\\?\\" + src_path);
}
exports.fileExists = path_fileExists;
exports.existsFile = path_fileExists;

function path_folderExists(arg_src_path) 
{
    assert(_.isString(arg_src_path));

    if (0 == arg_src_path.length)
	{
        return false;
    }

    var src_path = path_normalize(arg_src_path);

    return process.reserved.bindings.path_folderExists("\\\\?\\" + src_path);
}
exports.folderExists = path_folderExists;
exports.existsFolder = path_folderExists;

function path_removeBackslash(arg_src_path) 
{
    assert(_.isString(arg_src_path));

    if (0 == arg_src_path.length) 
	{
        return "";
    }

    if ('\\' == arg_src_path.charAt(arg_src_path.length - 1)) 
	{
        return arg_src_path.substring(0, arg_src_path.length - 1);
    }

    if ('/' == arg_src_path.charAt(arg_src_path.length - 1)) 
	{
        return arg_src_path.substring(0, arg_src_path.length - 1);
    }

    return arg_src_path;
}
exports.removeBackslash = path_removeBackslash;

function path_extname(arg_src_path) 
{
    assert(_.isString(arg_src_path));

    if (0 == arg_src_path.length) 
	{
        return "";
    }

    var src_path = path_normalize(arg_src_path);
    if (0 == src_path.length) 
	{
        return "";
    }

    var dotPost = src_path.lastIndexOf(".");
    if (-1 == dotPost) 
	{
        return "";
    }

    return src_path.substring(dotPost);
}
exports.extname = path_extname;

function path_isRoot(arg_src_path) 
{
    assert(_.isString(arg_src_path));
    if (0 == arg_src_path.length) 
	{
        return false;
    }

    var src_path = path_normalize(arg_src_path);
    if (0 == src_path.length) 
	{
        return false;
    }

    return process.reserved.bindings.path_isRoot(src_path);
}
exports.isRoot = path_isRoot;

function path_removeFileSpec(arg_src_path) 
{
    assert(_.isString(arg_src_path));

    if (0 == arg_src_path.length) 
	{
        return "";
    }

    var src_path = path_normalize(arg_src_path);
    if (0 == src_path.length) 
	{
        return "";
    }

    return process.reserved.bindings.path_removeFileSpec(src_path);
}
exports.removeFileSpec = path_removeFileSpec;

function path_combine(arg_path1, arg_path2) 
{
    assert(_.isString(arg_path1));
    assert(_.isString(arg_path2));

    var path1 = path_normalize(arg_path1);


    path1 = path_removeBackslash(path1);

    var path2 = path_toWin32Style(arg_path2);

    if ((0 == path1.length) && (0 == path2.length)) 
	{
        return "";
    }

    var dest_path = process.reserved.bindings.path_combine(path1, path2);

    return path_normalize(dest_path);
}
exports.combine = path_combine;



function main(  )
{
	console.log( path_normalize("../../osver.js") );
	
	return 0;
}

if ( !module.parent )
{
	main();
}