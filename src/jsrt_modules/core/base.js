'use strict';

const _ = require("underscore");
const assert = require("assert");

function LOBYTE(v) 
{
    return (v & 0xff);
}
exports.LOBYTE = LOBYTE;

function HIBYTE(v) 
{
    return ((v >> 8) & 0xff);
}
exports.HIBYTE = HIBYTE;

function LOWORD(v) 
{
    return (v & 0xffff);
}
exports.LOWORD = LOWORD;

function HIWORD(v) 
{
    return ((v >> 16) & 0xffff);
}
exports.HIWORD = HIWORD;

function ALIGN_DOWN_BY(length, alignment) 
{
    return (length) & ~(alignment - 1);
}
exports.ALIGN_DOWN_BY = ALIGN_DOWN_BY;

function ALIGN_UP_BY(length, alignment)
{
    return ALIGN_DOWN_BY(length + alignment - 1, alignment);
}
exports.ALIGN_UP_BY = ALIGN_UP_BY;


function stackTrace(arg_skip) 
{
    var skips = arg_skip || 0;
    var index = 0;

    assert(skips >= 0 , "invalid stack skip" );

    var tempError = new Error();

    var tempArray = _.map(tempError.stack.substring(5).trim().split("\n"), function (item) {
        return item.trim();
    });

    tempArray.shift();

    for (index = 0; index < skips; index++) 
	{
        tempArray.shift();
    }

    tempError = null;

    return tempArray;
}
exports.stackTrace = stackTrace;



var ENCODING_CODEPAGE_MAP = {

    "ascii": 0,
    "ansi": 0,

    "utf7": 65000,
    "utf-7": 65000,

    "utf8": 65001,
    "utf-8": 65001,

    "utf-16": 1200,
    "utf16": 1200,

    "ucs2": 1200,
    "unicode": 1200,

    "utf16le": 1200,
    "utf16be": 1201,

    "gb2312": 936,
    "big5": 950,

    "windows-1250": 1250,
    "windows-1251": 1251,
    "windows-1252": 1252,
    "windows-1253": 1253,
    "windows-1254": 1254,
    "windows-1255": 1255,
    "windows-1256": 1256,
    "windows-1257": 1257,
    "windows-1258": 1258
};

function encoding2codepage(arg_encoding) 
{
    var encoding = 'ascii';
    var codepage = 0;

    assert(_.isString(arg_encoding), "encoding must be string");

    encoding = arg_encoding.trim().toLowerCase();

    if (!_.has(ENCODING_CODEPAGE_MAP, encoding)) 
	{
        throw new Error(sprintf("not supported encoding", encoding));
    }

    return ENCODING_CODEPAGE_MAP[encoding];
}
exports.encoding2codepage = encoding2codepage;

function cmdlineToArgv( arg_cmdline ) 
{
    if (0 == arg_cmdline.length) 
	{
         return [];
    }

    return process.reserved.bindings.host_cmdlineToArgv(arg_cmdline);
}
exports.cmdlineToArgv = cmdlineToArgv;

function escapeDoubleQuotes(str)
{
    return str.replace(/\\([\s\S])|(")/g, "\\$1$2");
}
exports.escapeDoubleQuotes = escapeDoubleQuotes;

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}


