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

    var tempName = path_toWin32Style(src_path).trim();

	if (0 == tempName.length) 
	{
        return tempName;
    }
	
	var mainName = tempName;
	var prefix = '';
	var index = 0;
	
	var dotPos = tempName.indexOf( '.' );

	if (  dotPos == 0 )
	{
		for ( index = 0; index < tempName.length; index++ )
		{
			if ( tempName.charAt( index) == '.' )
			{
				continue;
			}
			
			if ( tempName.charAt( index) == '\\' )
			{
				continue;
			}
			
			prefix = tempName.substring( 0 , index );
			mainName = tempName.substring( index );
			
			break;
		}
	}
	
	if ( '.\\' == prefix )
	{
		prefix = '';
	}

    mainName = process.reserved.bindings.path_normalize( mainName );
    mainName = path_removePrefix( mainName );
	
	return prefix + mainName;
}
exports.normalize = path_normalize;


function path_basename( arg_src_path , arg_extname ) 
{
	var src_path = path_normalize( arg_src_path );
	
	src_path = path_removeBackslash( src_path );
	
	var lastPos = src_path.lastIndexOf('\\');
	var tempName = '';
	var destname = '';
	
	if ( -1 == lastPos )
	{
		tempName = src_path;
	}
	else
	{
		tempName = src_path.substring( lastPos + 1 ,  src_path.length );
	}
	
	if ( ( !arg_extname ) || ( 0 == arg_extname.length ) )
	{
		return tempName;
	}
	
	if ( arg_extname.length > arg_src_path )
	{
		return tempName;
	}
	
	var testName = tempName.substring( tempName.length - arg_extname.length , tempName.length);
	
	if ( testName == arg_extname )
	{
		destname =  tempName.substring( 0 , tempName.length - arg_extname.length );
	}
	else
	{
		destname = tempName;
	}
	
	return destname;
}
exports.basename = path_basename;

function path_dirname(arg_src_path) 
{
	var src_path = path_normalize( arg_src_path );
	
	var pos = src_path.lastIndexOf('\\');
	if ( -1 == pos )
	{
		return '';
	}
	else
	{
		return src_path.substring( 0 , pos );
	}
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

    var path2 = path_normalize(arg_path2);

    if ( (0 == path1.length) && (0 == path2.length) ) 
	{
        return "";
    }

    var dest_path = process.reserved.bindings.path_combine(path1, path2);

    return path_normalize(dest_path);
}
exports.combine = path_combine;


// path.relative(from, to)
function path_relative(from , to)
 {
 	assert( _.isString(from) );
 	assert( _.isString(to) );

 	if (from === to)
 		return '';

 	var fromOrig = path_normalize(from);
 	var toOrig = path_normalize(to);

 	if (fromOrig === toOrig)
 		return '';

 	from = fromOrig.toLowerCase();
 	to = toOrig.toLowerCase();

 	if (from === to)
 		return '';

 	// Trim any leading backslashes
 	var fromStart = 0;
 	for (; fromStart < from.length; ++fromStart)
 	{
 		if (from.charCodeAt(fromStart) !== 92 /*\*/ )
 			break;
 	}
 	// Trim trailing backslashes (applicable to UNC paths only)
 	var fromEnd = from.length;
 	for (; fromEnd - 1 > fromStart; --fromEnd)
 	{
 		if (from.charCodeAt(fromEnd - 1) !== 92 /*\*/ )
 			break;
 	}
 	var fromLen = (fromEnd - fromStart);

 	// Trim any leading backslashes
 	var toStart = 0;
 	for (; toStart < to.length; ++toStart)
 	{
 		if (to.charCodeAt(toStart) !== 92 /*\*/ )
 			break;
 	}
 	// Trim trailing backslashes (applicable to UNC paths only)
 	var toEnd = to.length;
 	for (; toEnd - 1 > toStart; --toEnd)
 	{
 		if (to.charCodeAt(toEnd - 1) !== 92 /*\*/ )
 			break;
 	}
 	var toLen = (toEnd - toStart);

 	// Compare paths to find the longest common path from root
 	var length = (fromLen < toLen ? fromLen : toLen);
 	var lastCommonSep = -1;
 	var i = 0;
 	for (; i <= length; ++i)
 	{
 		if (i === length)
 		{
 			if (toLen > length)
 			{
 				if (to.charCodeAt(toStart + i) === 92 /*\*/ )
 				{
 					// We get here if `from` is the exact base path for `to`.
 					// For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
 					return toOrig.slice(toStart + i + 1);
 				}
 				else if (i === 2)
 				{
 					// We get here if `from` is the device root.
 					// For example: from='C:\\'; to='C:\\foo'
 					return toOrig.slice(toStart + i);
 				}
 			}
 			if (fromLen > length)
 			{
 				if (from.charCodeAt(fromStart + i) === 92 /*\*/ )
 				{
 					// We get here if `to` is the exact base path for `from`.
 					// For example: from='C:\\foo\\bar'; to='C:\\foo'
 					lastCommonSep = i;
 				}
 				else if (i === 2)
 				{
 					// We get here if `to` is the device root.
 					// For example: from='C:\\foo\\bar'; to='C:\\'
 					lastCommonSep = 3;
 				}
 			}
 			break;
 		}
 		var fromCode = from.charCodeAt(fromStart + i);
 		var toCode = to.charCodeAt(toStart + i);
 		if (fromCode !== toCode)
 			break;
 		else if (fromCode === 92 /*\*/ )
 			lastCommonSep = i;
 	}

 	// We found a mismatch before the first common path separator was seen, so
 	// return the original `to`.
 	if (i !== length && lastCommonSep === -1)
 	{
 		return toOrig;
 	}

 	var out = '';
 	if (lastCommonSep === -1)
 		lastCommonSep = 0;
 	// Generate the relative path based on the path difference between `to` and
 	// `from`
 	for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i)
 	{
 		if (i === fromEnd || from.charCodeAt(i) === 92 /*\*/ )
 		{
 			if (out.length === 0)
 				out += '..';
 			else
 				out += '\\..';
 		}
 	}

 	// Lastly, append the rest of the destination (`to`) path that comes after
 	// the common path parts
 	if (out.length > 0)
 		return out + toOrig.slice(toStart + lastCommonSep, toEnd);
 	else
 	{
 		toStart += lastCommonSep;
 		if (toOrig.charCodeAt(toStart) === 92 /*\*/ )
 			++toStart;
 		return toOrig.slice(toStart, toEnd);
 	}
}
exports.relative = path_relative;

function path_parse(arg_path)
{
	assert(_.isString(arg_path));

	var ret = {
		root: '',
		dir: '',
		base: '',
		ext: '',
		name: ''
	};
	
	if (arg_path.length === 0)
		return ret;

	var len = arg_path.length;
	var rootEnd = 0;
	var code = arg_path.charCodeAt(0);
	var isAbsolute = false;

	// Try to match a root
	if (len > 1)
	{
		if (code === 47 /*/*/ || code === 92 /*\*/ )
		{
			// Possible UNC root

			isAbsolute = true;

			code = arg_path.charCodeAt(1);
			rootEnd = 1;
			if (code === 47 /*/*/ || code === 92 /*\*/ )
			{
				// Matched double arg_path separator at beginning
				var j = 2;
				var last = j;
				// Match 1 or more non-arg_path separators
				for (; j < len; ++j)
				{
					code = arg_path.charCodeAt(j);
					if (code === 47 /*/*/ || code === 92 /*\*/ )
						break;
				}
				if (j < len && j !== last)
				{
					// Matched!
					last = j;
					// Match 1 or more arg_path separators
					for (; j < len; ++j)
					{
						code = arg_path.charCodeAt(j);
						if (code !== 47 /*/*/ && code !== 92 /*\*/ )
							break;
					}
					if (j < len && j !== last)
					{
						// Matched!
						last = j;
						// Match 1 or more non-arg_path separators
						for (; j < len; ++j)
						{
							code = arg_path.charCodeAt(j);
							if (code === 47 /*/*/ || code === 92 /*\*/ )
								break;
						}
						if (j === len)
						{
							// We matched a UNC root only

							rootEnd = j;
						}
						else if (j !== last)
						{
							// We matched a UNC root with leftovers

							rootEnd = j + 1;
						}
					}
				}
			}
		}
		else if ((code >= 65 /*A*/ && code <= 90 /*Z*/ ) ||
			(code >= 97 /*a*/ && code <= 122 /*z*/ ))
		{
			// Possible device root

			code = arg_path.charCodeAt(1);
			if (arg_path.charCodeAt(1) === 58 /*:*/ )
			{
				rootEnd = 2;
				if (len > 2)
				{
					code = arg_path.charCodeAt(2);
					if (code === 47 /*/*/ || code === 92 /*\*/ )
					{
						if (len === 3)
						{
							// `arg_path` contains just a drive root, exit early to avoid
							// unnecessary work
							ret.root = ret.dir = arg_path.slice(0, 3);
							return ret;
						}
						isAbsolute = true;
						rootEnd = 3;
					}
				}
				else
				{
					// `arg_path` contains just a drive root, exit early to avoid
					// unnecessary work
					ret.root = ret.dir = arg_path.slice(0, 2);
					return ret;
				}
			}
		}
	}
	else if (code === 47 /*/*/ || code === 92 /*\*/ )
	{
		// `arg_path` contains just a arg_path separator, exit early to avoid
		// unnecessary work
		ret.root = ret.dir = arg_path[0];
		return ret;
	}

	if (rootEnd > 0)
		ret.root = arg_path.slice(0, rootEnd);

	var startDot = -1;
	var startPart = 0;
	var end = -1;
	var matchedSlash = true;
	var i = arg_path.length - 1;

	// Track the state of characters (if any) we see before our first dot and
	// after any arg_path separator we find
	var preDotState = 0;

	// Get non-dir info
	for (; i >= rootEnd; --i)
	{
		code = arg_path.charCodeAt(i);
		if (code === 47 /*/*/ || code === 92 /*\*/ )
		{
			// If we reached a arg_path separator that was not part of a set of arg_path
			// separators at the end of the string, stop now
			if (!matchedSlash)
			{
				startPart = i + 1;
				break;
			}
			continue;
		}
		if (end === -1)
		{
			// We saw the first non-arg_path separator, mark this as the end of our
			// extension
			matchedSlash = false;
			end = i + 1;
		}
		if (code === 46 /*.*/ )
		{
			// If this is our first dot, mark it as the start of our extension
			if (startDot === -1)
				startDot = i;
			else if (preDotState !== 1)
				preDotState = 1;
		}
		else if (startDot !== -1)
		{
			// We saw a non-dot and non-arg_path separator before our dot, so we should
			// have a good chance at having a non-empty extension
			preDotState = -1;
		}
	}

	if (startDot === -1 ||
		end === -1 ||
		// We saw a non-dot character immediately before the dot
		preDotState === 0 ||
		// The (right-most) trimmed arg_path component is exactly '..'
		(preDotState === 1 &&
			startDot === end - 1 &&
			startDot === startPart + 1))
	{
		if (end !== -1)
		{
			if (startPart === 0 && isAbsolute)
				ret.base = ret.name = arg_path.slice(rootEnd, end);
			else
				ret.base = ret.name = arg_path.slice(startPart, end);
		}
	}
	else
	{
		if (startPart === 0 && isAbsolute)
		{
			ret.name = arg_path.slice(rootEnd, startDot);
			ret.base = arg_path.slice(rootEnd, end);
		}
		else
		{
			ret.name = arg_path.slice(startPart, startDot);
			ret.base = arg_path.slice(startPart, end);
		}
		ret.ext = arg_path.slice(startDot, end);
	}

	if (startPart > 0)
		ret.dir = arg_path.slice(0, startPart - 1);
	else if (isAbsolute)
		ret.dir = arg_path.slice(0, rootEnd);

	return ret;
}
exports.parse = path_parse;

function main(  )
{

	return 0;
}

if ( !module.parent )
{
	main();
}