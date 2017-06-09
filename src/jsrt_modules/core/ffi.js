'use strict';


const _ = require("underscore");
const assert = require("assert");
const path = require("path");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

// path

var ENUM_TABLE_FFI_VALUE_TYPE = {
    "char" : 1,
    "uchar" : 2,

    "short" : 3,
    "ushort" : 4,

    "long" : 5,
    "ulong" : 6,

    "longlong" : 7,
    "ulonglong" : 8,

    "long_ptr" : 9,
    "ulong_ptr" : 10,

    "handle" : 11,
    "buffer" : 12,

    "float" : 13,
    "double" : 14,

    "string" : 15,
    "wstring" : 16,

    "void" : 17 ,
	
	"VOID" : 17 ,
	
	"bool" : 18
};

var ENUM_TABLE_FFI_STACK_TYPE = {
    "__stdcall" : 1,
    "__cdecl" : 2
};

var WIN_TYPE_TO_FFI_TYPE_TABLE = {
	"byte" : "uchar",
    "BYTE" : "uchar",
    "CHAR" : "char",
    "UCHAR" : "uchar",

	"word" : "ushort",
    "WORD" : "ushort",
    "SHORT" : "short",
    "USHORT" : "ushort",

    "void*" : "buffer",

    "int" : "long",
    "uint" : "ulong",

    "INT" : "long",
    "UINT" : "ulong",

    "DWORD" : "ulong",
    "LONG" : "long",
    "ULONG" : "ulong",

	"DWORD64" : "ulonglong",
    "QWORD" : "ulonglong",
	
    "LONG64" : "longlong",
    "ULONG64" : "ulonglong",
	
    "LONGLONG" : "longlong",
    "ULONGLONG" : "ulonglong",

    "LONG_PTR" : "long_ptr",
    "ULONG_PTR" : "ulong_ptr",

    "LPARAM" : "long_ptr",
    "WPARAM" : "ulong_ptr",

    "DWORD_PTR" : "ulong_ptr",

    "INT_PTR" : "long_ptr",
    "UINT_PTR" : "ulong_ptr",

    "size_t" : "ulong_ptr", 
	"SIZE_T" : "ulong_ptr" ,
	
	"LRESULT" : "long_ptr",

    "FLOAT" : "float",
    "DOUBLE" : "DOUBLE",

    // basic pointer
    "PBYTE" : "buffer",
    "PCHAR" : "buffer",
    "PUCHAR" : "buffer",

    "PWORD" : "buffer",
    "PSHORT" : "buffer",
    "PUSHORT" : "buffer",

    "PINT" : "buffer",
    "PUINT" : "buffer",

    "PDWORD" : "buffer",
    "PLONG" : "buffer",
    "PULONG" : "buffer",

    "PQWORD" : "buffer",
    "PLONG64" : "buffer",
    "PULONG64" : "buffer",
    "PDWORD64" : "buffer",
    "PLONGLONG" : "buffer",
    "PULONGLONG" : "buffer",

    "PLONG_PTR" : "buffer",
    "PULONG_PTR" : "buffer",

    "PDWORD_PTR" : "buffer",

    "PINT_PTR" : "buffer",
    "PUINT_PTR" : "buffer",

    "PFLOAT" : "buffer",
    "PDOUBLE" : "buffer",

    // long pointer
    "LPBYTE" : "buffer",
    "LPCHAR" : "buffer",
    "LPUCHAR" : "buffer",

    "LPWORD" : "buffer",
    "LPSHORT" : "buffer",
    "LPUSHORT" : "buffer",

    "LPINT" : "buffer",
    "LPUINT" : "buffer",

    "LPDWORD" : "buffer",
    "LPLONG" : "buffer",
    "LPULONG" : "buffer",

    "LPQWORD" : "buffer",
    "LPLONG64" : "buffer",
    "LPDWORD64" : "buffer",
    "LPULONG64" : "buffer",
    "LPLONGLONG" : "buffer",
    "LPULONGLONG" : "buffer",

    "LPLONG_PTR" : "buffer",
    "LPULONG_PTR" : "buffer",

    "LPDWORD_PTR" : "buffer",

    "LPINT_PTR" : "buffer",
    "LPUINT_PTR" : "buffer",

    "LPFLOAT" : "buffer",
    "LPDOUBLE" : "buffer",
	
	"LPBOOL" : "buffer" ,
	"PBOOL" : "buffer" ,

    // string
    "LPCTSTR" : "wstring",
    "PCTSTR" : "wstring",


    "LPCSTR" : "string",
    "LPCWSTR" : "wstring",

    "PCSTR" : "string",
    "PCWSTR" : "wstring",

    // string buffer
    "LPSTR" : "buffer",
    "LPTSTR" : "buffer",
    "LPWSTR" : "buffer",

    "PSTR" : "buffer",
    "PTSTR" : "buffer",
    "PWSTR" : "buffer",

    // handle
    "PVOID" : "buffer",
    "LPVOID" : "buffer",
	"PCVOID" : "buffer" ,
	"LPCVOID" : "buffer" ,
    "PPVOID" : "buffer",
    "HANDLE" : "handle",
    "PHANDLE" : "buffer",

    "HACCEL" : "handle",
    "HBITMAP" : "handle",
    "HCURSOR" : "handle",
    "HINSTANCE" : "handle",
    "HMODULE" : "handle",
    "HCONV" : "handle",

    "HMENU" : "handle",
    "HWND" : "handle",
    "HBRUSH" : "handle",
	"HDESK" : "handle" ,
    "HENHMETAFILE" : "handle",
    "HFONT" : "handle",
    "HPALETTE" : "handle",
    "HPEN" : "handle",
    "HRGN" : "handle",
    "HDC" : "handle",


    // typedef
    "BOOL" : "bool",
    "BOOLEAN" : "bool",
		
	"NTSTATUS" : "long",
	"ACCESS_MASK" : "ulong" ,

    "COLORREF" : "ulong"

	
};

var WIN_STACK_TYPE_TO_FFI_STACK_TYPE_TABLE = {
    "WINAPI" : "__stdcall",
    "CALLBACK" : "__stdcall"
};


var EMPTY_MARCO_ARRAY = [

	 "_Inout_opt_",
	  
	 "_Outptr_opt_" ,
    
    "_Inout_",
  
    "_Outptr_",

    "_In_opt_",
  
    "_Out_opt_",
   
	"_In_",
	 "_Out_",

];

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

    searchPaths.forEach(function (item, index, thisArray) 
	{
        var newItem = null;

        if ("ia32" == process.arch) 
		{
            newItem = path.combine(item, ".\\i386");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) 
				{
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }

            newItem = path.combine(item, ".\\bin\\i386");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) {
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }

            newItem = path.combine(item, "..\\..\\bin\\i386");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) 
				{
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }
        }
        else if ("x64" == process.arch) 
		{
            newItem = path.combine(item, ".\\amd64");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) 
				{
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }

            newItem = path.combine(item, ".\\bin\\amd64");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) 
				{
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }

            newItem = path.combine(item, "..\\..\\bin\\amd64");

            if (path.folderExists(newItem)) 
			{
                if (-1 == thisArray.indexOf(newItem.toLowerCase())) 
				{
                    thisArray.splice(index + 1, 0, newItem.toLowerCase());
                }
            }
        }

    });

    return searchPaths;
}

function _resolveFile(arg_name) {
    var searchPaths = [];
    var mainFileName = '';
    var index = 0;
    var testFileName = '';

    assert(_.isString(arg_name));

    var findName = path.normalize(arg_name);

    if ( path.fileExists(findName) ) 
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
            testFileName = path.combine(searchPaths[index], findName + ".dll");
            if (path.fileExists(testFileName)) 
			{
                return testFileName;
            }
        }
    }

    return;
}



function _lex_removeEmptryMarcos(argDeclare) 
{
    var index = 0;
    var newDeclare = argDeclare;

    for (index = 0; index < EMPTY_MARCO_ARRAY.length; index++) 
	{
        if (0 == argDeclare.indexOf(EMPTY_MARCO_ARRAY[index])) 
		{
            newDeclare = argDeclare.substring(EMPTY_MARCO_ARRAY[index].length).trim();

            if (0 == newDeclare.length) 
			{
                return newDeclare;
            }

            return _lex_removeEmptryMarcos(newDeclare);
        }
    }

    return newDeclare;
}

function _lex_arg_type(temp_argDeclare) 
{
    var argDeclare = _lex_removeEmptryMarcos(temp_argDeclare);
	
    if (0 == argDeclare.length) 
	{
        return;
    }

    var itemArray = argDeclare.split(" ");

    itemArray = _.map(itemArray, function (item) 
	{
        return item.trim();
    });

    itemArray = _.filter(itemArray, function (item) 
	{
        return (item.length != 0);
    });
	
	itemArray = _.filter(itemArray, function (item) 
	{
        return ( item.toLowerCase() != "const" );
    });

    if (0 == itemArray.length) 
	{
        return;
    }

    var mainType = itemArray[0];
    var argName;

    if (1 == itemArray.length) 
	{
        return itemArray[0];
    }

    var index = 0;
    for (index = 1; index < itemArray.length; index++) 
	{
        if ("*" != itemArray[index]) 
		{
            argName = itemArray[index];
            break;
        }

        mainType += "*";
    }
	
	if ( itemArray.length >= 2 )
	{
		for ( index = 0; index < itemArray[1].length; index++ )
		{
			if ( '*' == itemArray[1].charAt(0) )
			{
				itemArray[1] = itemArray[1].substring(1 );
				mainType += "*";
				index = 0;
				continue;
			}
			else
			{
				break;
			}		
		}
		
	}

    return mainType;
}

function _lex_removeEmptryBlank(argDeclare) 
{
    var itemArray = argDeclare.split(" ");
	var declareText = "";
	
    itemArray = _.map(itemArray, function (item) 
	{
        return item.trim();
    });

    itemArray = _.filter(itemArray, function (item) 
	{
        return (item.length != 0);
    });
	
	if ( 0 == itemArray.length )
	{
		return "";
	}
	
	var index = 0;
	
	for ( index = 0; index < itemArray.length; index++ )
	{
		if ( index == itemArray.length - 1 )
		{
			declareText += itemArray[index];
		}
		else
		{
			declareText += itemArray[index] + " ";
		}
		
	}

    return declareText;
}



function _lexDeclare(arg_declareText) 
{
    var lexInfo = {};

    var declareText = arg_declareText.trim() ;

    var tempArray1 = declareText.split("(");
    var tempArray2 = declareText.split(")");

    tempArray1 = _.map(tempArray1, function (item) 
	{
        return item.trim();
    });

    if ((tempArray1.length != 2)) 
	{
        throw new Error("invalid declare");
    }

    var declareHeadArray = tempArray1[0].split(" ");
    declareHeadArray = _.map(declareHeadArray, function (item) 
	{
        return item.trim();
    });

    // int , WINAPI , MessageBox

    if (3 == declareHeadArray.length) 
	{
        lexInfo.returnType = declareHeadArray[0];
        lexInfo.stackType = declareHeadArray[1];
        lexInfo.name = declareHeadArray[2];
    }
    else if (2 == declareHeadArray.length) 
	{
        lexInfo.returnType = declareHeadArray[0];

        if (_.has(WIN_STACK_TYPE_TO_FFI_STACK_TYPE_TABLE, declareHeadArray[1])) 
		{
            lexInfo.stackType = declareHeadArray[1];
        }
        else if (_.has(ENUM_TABLE_FFI_STACK_TYPE, declareHeadArray[1])) 
		{
            lexInfo.stackType = declareHeadArray[1];
        }
        else 
		{
            lexInfo.name = declareHeadArray[1];
        }
    }
    else 
	{
        throw new Error("invalid declare");
    }

    // arg declare and ; array
    var tempArray4 = tempArray1[1].split(")");

    if ((tempArray4.length != 2)) 
	{
        throw new Error("invalid declare");
    }


    // argText
    var rawArgvDeclares = tempArray4[0].split(",");
    rawArgvDeclares = _.map(rawArgvDeclares, function (item) 
	{
        return item.trim();
    });

    rawArgvDeclares = _.filter(rawArgvDeclares, function (item) 
	{
        return (item.length != 0);
    });

    if (0 == rawArgvDeclares.length) 
	{
        lexInfo.argTypes = [];
    }
    else if (1 == rawArgvDeclares.length) 
	{
        if ("void" == rawArgvDeclares[0]) 
		{
            lexInfo.argTypes = [];
        }
        else 
		{
            lexInfo.argTypes = _.map(rawArgvDeclares, function (item) 
			{
                return _lex_arg_type(item);
            });
        }
    }
    else 
	{
        // remove empty marcos
        lexInfo.argTypes = _.map(rawArgvDeclares, function (item) 
		{
            return _lex_arg_type(item.trim());
        });
		
		
    }

    return lexInfo;
}


function ffi_cleanDeclare(arg_declareText) 
{
    var declareText = arg_declareText.trim();

    var tempArray1 = declareText.split("(");
 
    tempArray1 = _.map(tempArray1, function (item) 
	{
        return item.trim();
    });

    if ((tempArray1.length != 2)) 
	{
        throw new Error("invalid declare");
    }

    var declareHeadArray = tempArray1[0].split(" ");
    declareHeadArray = _.map(declareHeadArray, function (item) 
	{
        return item.trim();
    });
	
	declareHeadArray = _.filter(declareHeadArray, function (item) 
	{
        return (item.length != 0 );
    });

    // arg declare and ; array
    var tempArray4 = tempArray1[1].split(")");

    if ((tempArray4.length != 2)) 
	{
        throw new Error("invalid declare");
    }

    // argText
    var rawArgvDeclares = tempArray4[0].split(",");
    rawArgvDeclares = _.map(rawArgvDeclares, function (item) 
	{
        return item.trim();
    });

    rawArgvDeclares = _.filter(rawArgvDeclares, function (item) 
	{
        return (item.length != 0);
    });
	
	
	// remove empty marcos
    rawArgvDeclares = _.map(rawArgvDeclares, function (item) 
	{
        return _lex_removeEmptryBlank( item );
    });
	
	// rewrite
	declareText = "";
	
	if ( 3 == declareHeadArray.length )
	{
		declareText += sprintf("%s %s %s" , declareHeadArray[0] , declareHeadArray[1] , declareHeadArray[2] );
	}
	else if ( 2 == declareHeadArray.length )
	{
		declareText += sprintf("%s %s" , declareHeadArray[0] , declareHeadArray[1]  );
	}
	else
	{
		throw new Error(sprintf("invalid declare head array length , %s" , declareHeadArray ) );
	}
	
	if ( 0 == rawArgvDeclares.length )
	{
		declareText += "( );";
	}
	else
	{
		var index = 0;
		
		declareText += "( ";
		
		for ( index = 0; index < rawArgvDeclares.length; index++ )
		{
			if ( index == rawArgvDeclares.length - 1 )
			{
				declareText += sprintf("%s" , rawArgvDeclares[index] );
			}
			else
			{
				declareText += sprintf("%s , " , rawArgvDeclares[index] );
			}
		}
		
		declareText += " );";
		
	}
	
    return declareText;

}
exports.cleanDeclare = ffi_cleanDeclare;

function ffi_parseDeclare(arg_declareText) 
{
	var declareText = ffi_cleanDeclare( arg_declareText );
	
    var lexInfo = _lexDeclare(declareText);

    // return type
    if (_.has(WIN_TYPE_TO_FFI_TYPE_TABLE, lexInfo.returnType) ) 
	{
        lexInfo.returnType = WIN_TYPE_TO_FFI_TYPE_TABLE[lexInfo.returnType];
    }
    else if (_.has(ENUM_TABLE_FFI_VALUE_TYPE, lexInfo.returnType)) 
	{
        // nop
    }
    else 
	{
        if (-1 != lexInfo.returnType.indexOf("*")) 
		{
            lexInfo.returnType = "buffer";
        }
        else 
		{
            throw new Error(sprintf("unknown return type %s", lexInfo.returnType) );
        }
    }

    // stackType
    if (!lexInfo.stackType) 
	{
        lexInfo.stackType = "__stdcall";
    }
    else 
	{
        if (_.has(ENUM_TABLE_FFI_STACK_TYPE, lexInfo.stackType)) 
		{
            // nop
        }
        else if (_.has(WIN_STACK_TYPE_TO_FFI_STACK_TYPE_TABLE, lexInfo.stackType)) 
		{
            lexInfo.stackType = WIN_STACK_TYPE_TO_FFI_STACK_TYPE_TABLE[lexInfo.stackType];
        }
        else 
		{
            throw new Error(sprintf("unknown stack type %s", lexInfo.stackTyp));
        }

    }
		
    // argTypes
    lexInfo.argTypes = _.map(lexInfo.argTypes, function (item) 
	{
        if (_.has(WIN_TYPE_TO_FFI_TYPE_TABLE, item) ) 
		{
            return WIN_TYPE_TO_FFI_TYPE_TABLE[item];
        }
        else if ( _.has(ENUM_TABLE_FFI_VALUE_TYPE, item) ) 
		{
            return item;
        }
        else 
		{
            if (-1 != item.indexOf("*")) 
			{
                return "buffer";
            }
            else 
			{
                throw new Error(sprintf("unknown arg type %s of %s", item , arg_declareText) );
            }
        }
    });

    return lexInfo;
}
exports.parseDeclare = ffi_parseDeclare;

function _castTo_char(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt8(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue.toInt8();
    }
    else 
	{
        throw new Error(sprintf("want char but receive %s", typeof argValue));
    }
}

function _castTo_uchar(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toUInt8(argValue);
    }
    else if (_.isBoolean(argValue)) 
	{
        if (argValue) 
		{
            return 1;
        }
        else {
            return 0;
        }
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue.toUInt8;
    }
    else 
	{
        throw new Error(sprintf("want uchar but receive %s", typeof argValue));
    }
}

function _castTo_short(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt16LE(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue.toInt16LE;
    }
    else 
	{
        throw new Error(sprintf("want short but receive %s", typeof argValue));
    }
}

function _castTo_ushort(argValue)
 {
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toUInt16LE(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue.toUInt16LE;
    }
    else 
	{
        throw new Error(sprintf("want ushort but receive %s", typeof argValue));
    }
}

function _castTo_long(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt32LE(argValue);
    }
    else if (_.isBoolean(argValue)) 
	{
        if (argValue)
		{
            return 1;
        }
        else 
		{
            return 0;
        }
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want long but receive %s", typeof argValue));
    }
}

function _castTo_ulong(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt32LE(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want ulong but receive %s", typeof argValue));
    }
}

function _castTo_longlong(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return argValue;
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want longlong but receive %s", typeof argValue));
    }
}

function _castTo_ulonglong(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return argValue;
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want ulonglong but receive %s", typeof argValue));
    }
}

function _castTo_long_ptr(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return Number64(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
	else if ( Buffer.isBuffer(argValue) )
	{
        return argValue.address;
    }
    else 
	{
        throw new Error(sprintf("want long_ptr but receive %s", typeof argValue));
    }

    return castedArgValue;
}

function _castTo_ulong_ptr(argValue) 
{
    if (_.isNumber(argValue))		
	{
        return Number64(argValue);
    }
    else if ( Number64.isNumber64(argValue) ) 
	{
        return argValue;
    }
	else if ( Buffer.isBuffer(argValue) )
	{
        return argValue.address;
    }
    else 
	{
        throw new Error(sprintf("want ulong_ptr but receive %s", typeof argValue));
    }

    return castedArgValue;
}

function _castTo_buffer(argValue) 
{
    if (_.isNull(argValue)) 
	{
        return null;
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else if (Buffer.isBuffer(argValue)) 
	{
        if (!argValue.isValid()) 
		{
            throw new Error(sprintf("the Buffer is invalid"));
        }

        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want Buffer but receive %s", typeof argValue));
    }
}

function _castTo_handle(argValue) 
{
    if ( _.isNull(argValue) ) 
	{
        return null;
    }
    else if ( Number64.isNumber64(argValue) ) 
	{
        return argValue;
    }
    else if ( Buffer.isBuffer(argValue) )
	{
        return argValue.address;
    }
    else
	{
        throw new Error(sprintf("want buffer but receive %s", typeof argValue));
    }
}

function _castTo_float(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt32LE(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want float but receive %s", typeof argValue));
    }
}

function _castTo_double(argValue) 
{
    if (_.isNumber(argValue)) 
	{
        return process.reserved.bindings.Number64_toInt32LE(argValue);
    }
    else if (Number64.isNumber64(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want double but receive %s", typeof argValue));
    }
}

function _castTo_string(argValue) 
{
    if (_.isNull(argValue)) 
	{
        return null;
    }
    else if (_.isString(argValue)) 
	{
        return argValue;
    }
    else
	{
        throw new Error(sprintf("want string but receive %s", typeof argValue));
    }
}

function _castTo_wstring(argValue) 
{
    if (_.isNull(argValue)) 
	{
        return null;
    }
    else if (_.isString(argValue)) 
	{
        return argValue;
    }
    else 
	{
        throw new Error(sprintf("want wstring but receive %s", typeof argValue));
    }
}

function _castTo_bool(argValue) 
{
	if ( argValue )
	{
		return true;
	}
	else
	{
		return false;
	}
}

var TYPE_CAST_TABLE = {
    "char" : _castTo_char,
    "uchar" : _castTo_uchar,

    "short" : _castTo_short,
    "ushort" : _castTo_ushort,

    "long" : _castTo_long,
    "ulong" : _castTo_ulong,

    "longlong" : _castTo_longlong,
    "ulonglong" : _castTo_ulonglong,

    "long_ptr" : _castTo_long_ptr,
    "ulong_ptr" : _castTo_ulong_ptr,

    "buffer" : _castTo_buffer,

    "handle" : _castTo_handle,

    "float" : _castTo_float,
    "double" : _castTo_double,

    "string" : _castTo_string,
    "wstring" : _castTo_wstring ,
	
	"bool" : _castTo_bool 
};

function _castJsValueToFFISupportValue(valueType, argValue) 
{
    return TYPE_CAST_TABLE[valueType](argValue);
}


function rawArgsToTypedArgs(argTypes, rawArgs)
 {
    var typeIndex = 0;
    var neededRawArgc = 0;
    var rawIndex = 0;
    var typedArgv = [];

    var helperValue = 0;

    if (0 == argTypes.length) 
	{
        return [];
    }
	
    // calc needed rawArgs length
    for (typeIndex = 0; typeIndex < argTypes.length; typeIndex++) 
	{
        if ("char" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("uchar" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("short" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("ushort" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("long" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("ulong" == argTypes[typeIndex])
		{
            neededRawArgc++;
        }
        else if ("longlong" == argTypes[typeIndex])
		{
            neededRawArgc++;

            if ("x64" != process.arch) 
			{
                neededRawArgc++;
            }
        }
        else if ("ulonglong" == argTypes[typeIndex]) 
		{
            if ("x64" != process.arch) {
                neededRawArgc++;
            }
        }
        else if ("long_ptr" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("ulong_ptr" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("buffer" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("handle" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("float" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("double" == argTypes[typeIndex]) 
		{
            neededRawArgc++;

            if ("x64" != process.arch) 
			{
                neededRawArgc++;
            }
        }
        else if ("string" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
        else if ("wstring" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
		else if ("bool" == argTypes[typeIndex]) 
		{
            neededRawArgc++;
        }
    }

    if (neededRawArgc != rawArgs.length) 
	{
        throw new Error(sprintf("call back raw argc is not enough"));
    }

    // convert
    for (typeIndex = 0; typeIndex < argTypes.length; typeIndex++) 
	{
        if ("char" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toInt8());
            rawIndex++;
        }
        else if ("uchar" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toUInt8());
            rawIndex++;
        }
        else if ("short" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toInt16LE());
            rawIndex++;
        }
        else if ("ushort" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toUInt16LE());
            rawIndex++;
        }
        else if ("long" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toInt32LE());
            rawIndex++;
        }
        else if ("ulong" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toUInt32LE());
            rawIndex++;
        }
        else if ("longlong" == argTypes[typeIndex]) 
		{
            if ("x64" == process.arch) 
			{
                typedArgv.push(Number64(rawArgs[rawIndex]));
                rawIndex++;
            }
            else
			{
                typedArgv.push(Number64(rawArgs[rawIndex], rawArgs[rawIndex + 1]));
                rawIndex++;
                rawIndex++;
            }
        }
        else if ("ulonglong" == argTypes[typeIndex])
		{
            if ("x64" == process.arch) 
			{
                typedArgv.push(Number64(rawArgs[rawIndex]));
                rawIndex++;
            }
            else 
			{
                typedArgv.push(Number64(rawArgs[rawIndex], rawArgs[rawIndex + 1]));
                rawIndex++;
                rawIndex++;
            }
        }
        else if ("long_ptr" == argTypes[typeIndex]) 
		{
            helperValue = Number64(rawArgs[rawIndex]);

            if ("x64" != process.arch) 
			{
                helperValue.cast2Number32();
            }

            typedArgv.push(helperValue);

            rawIndex++;
        }
        else if ("ulong_ptr" == argTypes[typeIndex]) 
		{
            helperValue = Number64(rawArgs[rawIndex]);

            if ("x64" != process.arch) 
			{
                helperValue.cast2Number32();
            }

            typedArgv.push(helperValue);

            rawIndex++;
        }
        else if ("buffer" == argTypes[typeIndex]) 
		{
            // we do not unknown the size , same as handle
            helperValue = Number64(rawArgs[rawIndex]);

            if ("x64" != process.arch) 
			{
                helperValue.cast2Number32();
            }

            typedArgv.push(helperValue);

            rawIndex++;
        }
        else if ("handle" == argTypes[typeIndex]) 
		{
            helperValue = Number64(rawArgs[rawIndex]);

            if ("x64" != process.arch) 
			{
                helperValue.cast2Number32();
            }

            typedArgv.push(helperValue);

            rawIndex++;
        }
        else if ("float" == argTypes[typeIndex]) 
		{
            typedArgv.push(Number64(rawArgs[rawIndex]).toFloatLE());
            rawIndex++;
        }
        else if ("double" == argTypes[typeIndex]) 
		{
            if ("x64" == process.arch) 
			{
                typedArgv.push(Number64(rawArgs[rawIndex]).toDoubleLE());
                rawIndex++;
            }
            else 
			{
                typedArgv.push(Number64(rawArgs[rawIndex], rawArgs[rawIndex + 1]).toDoubleLE());
                rawIndex++;
                rawIndex++;
            }
        }
        else if ("string" == argTypes[typeIndex]) 
		{
            helperValue = process.reserved.bindings.buffer_toString(Number64(rawArgs[rawIndex]), 0, 0, -1);

            typedArgv.push(helperValue);

            rawIndex++;
        }
        else if ("wstring" == argTypes[typeIndex])
		{
            helperValue = process.reserved.bindings.buffer_toString(Number64(rawArgs[rawIndex]), 1200, 0, -1);
			
            typedArgv.push(helperValue);

            rawIndex++;
        }
		else if ("bool" == argTypes[typeIndex]) 
		{
            typedArgv.push( Number64(rawArgs[rawIndex]).toUInt8() ? true : false );
            rawIndex++;
        }
    }

    return typedArgv;
}

function _fixRawValueToTypedValue(returnType, rawValue) 
{
    if ("void" == returnType) 
	{
        return;
    }
    else if (("char" == returnType)
        || ("uchar" == returnType)
        || ("short" == returnType)
        || ("ushort" == returnType)
        || ("long" == returnType)
        || ("ulong" == returnType)
        || ("float" == returnType)
        || ("double" == returnType)
        || ("string" == returnType)
        || ("wstring" == returnType)
		|| ("bool" == returnType)
    ) {
        return rawValue;
    }
    else if ("handle" == returnType) 
	{
        return Number64(rawValue);
    }
    else if ("buffer" == returnType) 
	{
        return Number64(rawValue);
    }
    else if (("longlong" == returnType)
        || ("ulonglong" == returnType)
    ) 
	{
        return Number64(rawValue);
    }
    else if (("long_ptr" == returnType)
        || ("ulong_ptr" == returnType)
    )
	{
        var value64 = Number64(rawValue);

        if ("x64" != process.arch) 
		{
            value64.cast2Number32();
        }

        return value64;
    }

    return rawValue;
}


function ffi_loadLibrary(arg_name) 
{
	var hModule = null;
	
    assert(_.isString(arg_name));

    var resolvedName = _resolveFile(arg_name);
    if (!resolvedName) 
	{
        throw new Error(sprintf("not found %s", arg_name));
    }
	
	//KdPrint("[ffi] %s resolved to %s\n" , arg_name , resolvedName );

    hModule = Number64(process.reserved.bindings.ffi_loadLibrary(resolvedName));
	
	if ( hModule.isZero() )
	{
		return null;
	}
	
	return hModule;
}
exports.loadLibrary = ffi_loadLibrary;

function ffi_getModuleHandle(arg_name)
{
    assert(_.isString(arg_name));

    return Number64(process.reserved.bindings.ffi_getModuleHandle(arg_name));
}
exports.getModuleHandle = ffi_getModuleHandle;

function ffi_freeLibrary(arg_imagebase) 
{
    var imagebase = Number64(arg_imagebase);

    return Number64(process.reserved.bindings.ffi_freeLibrary(imagebase));
}
exports.freeLibrary = ffi_freeLibrary;

function ffi_getProcAddress(arg_imagebase, arg_name) 
{
    var imagebase = Number64(arg_imagebase);

    return Number64(process.reserved.bindings.ffi_getProcAddress(imagebase, arg_name));
}
exports.getProcAddress = ffi_getProcAddress;

function ffi_getLastError() 
{
	return process.reserved.bindings.ffi_getLastError();
}
exports.getLastError = ffi_getLastError;




function ffi_bindFromRoutineAddressAndDeclareInfo(arg_address, declareInfo) 
{
    var ffiHelper = {};
    var routineAddress = null;

    ffiHelper["returnType"] = ENUM_TABLE_FFI_VALUE_TYPE[declareInfo.returnType];

    ffiHelper["stackType"] = ENUM_TABLE_FFI_STACK_TYPE[declareInfo.stackType];

    ffiHelper["name"] = declareInfo.name;

    ffiHelper["argTypes"] = _.map(declareInfo.argTypes, function (item) 
	{
        assert(_.has(ENUM_TABLE_FFI_VALUE_TYPE, item));

        return ENUM_TABLE_FFI_VALUE_TYPE[item];
    });

    if (Number64.isNumber64(arg_address)) {
        routineAddress = arg_address;
    }
    else if (Buffer.isBuffer(arg_address)) {
        routineAddress = arg_address.address;
    }
    else 
	{
        throw new Error(sprintf("invalid address type %s\n", typeof arg_address));
    }

    if (routineAddress.isZero(0x10000)) 
	{
        return null;
    }

    if (routineAddress.lessThan(0x10000)) 
	{
        throw new Error(sprintf("invalid address 0x%X\n", routineAddress));
    }

    assert(ffiHelper["returnType"]);
    assert(ffiHelper["stackType"]);
    assert(ffiHelper["name"]);


    var argIndex = 0;
    var singleType = 0;

    // name
    if (!declareInfo.name) {
        declareInfo.name = "unknown";
    }

    return function _ffi_wrapper() 
	{
        var invokeArgv = Array.prototype.slice.call(arguments);
        var rawInvokeRet = 0;

        if (invokeArgv.length != declareInfo.argTypes.length) {
            throw new Error(sprintf("ffi routine require %d args but only recv %d", declareInfo.argTypes.length, invokeArgv.length));
        }
		
        var userArgvIndex = 0;
        for (userArgvIndex = 0; userArgvIndex < declareInfo.argTypes.length; userArgvIndex++) 
		{
            try 
			{
                invokeArgv[userArgvIndex] = _castJsValueToFFISupportValue(declareInfo.argTypes[userArgvIndex], invokeArgv[userArgvIndex])
            }
            catch (err) 
			{
                throw new Error(sprintf("can not convert arg_%d from %s to %s",
                    userArgvIndex + 1,
                    typeof invokeArgv[userArgvIndex],
                    declareInfo.argTypes[userArgvIndex]
                ));
            }

        }

        invokeArgv.unshift(routineAddress);
        invokeArgv.unshift(ffiHelper);

        rawInvokeRet = process.reserved.bindings.ffi_invoke.apply(this, invokeArgv);

        rawInvokeRet = _fixRawValueToTypedValue(declareInfo.returnType, rawInvokeRet);

        return rawInvokeRet;
    }
}
exports.bindFromRoutineAddressAndDeclareInfo = ffi_bindFromRoutineAddressAndDeclareInfo;

function ffi_bindRoutine(arg_address, arg_declareText) 
{
    var declareInfo = null;
	
	var declareText = ffi_cleanDeclare( arg_declareText ); 

    try 
	{
        declareInfo = ffi_parseDeclare(declareText);
    }
    catch (err) 
	{
        throw new Error(sprintf("parse declare %s error %s\n", declareText, err));
    }

    return ffi_bindFromRoutineAddressAndDeclareInfo(arg_address, declareInfo);
}
exports.bindRoutine = ffi_bindRoutine;

function ffi_bindModule(arg_hModule, arg_declareText) 
{
    var declareInfo = null;
    var routineAddress = null;

    var hModule = null;
	
	var declareText = ffi_cleanDeclare( arg_declareText ); 

    try 
	{
        declareInfo = ffi_parseDeclare(declareText);
    }
    catch (err) 
	{
        throw new Error(sprintf("parse declare %s error %s\n", declareText, err.message));
    }

    if (!declareInfo.name) 
	{
        throw new Error(sprintf("not found name from declare"));
    }

    if (Number64.isNumber64(arg_hModule)) 
	{
        hModule = arg_hModule;
    }
    else if (Buffer.isBuffer(arg_hModule)) 
	{
        hModule = arg_hModule.address;
    }
    else 
	{
        throw new Error(sprintf("invalid module type %s\n", typeof arg_hModule));
    }

    if (hModule.lessThan(0x10000)) 
	{
        throw new Error(sprintf("invalid hModule 0x%X\n", hModule.address));
    }

    routineAddress = ffi_getProcAddress(hModule, declareInfo.name);
    if (routineAddress.isZero()) 
	{
        return null;
    }

    return ffi_bindFromRoutineAddressAndDeclareInfo(routineAddress, declareInfo);
}
exports.bindModule = ffi_bindModule;

function ffi_sizeofThunk(arg_declareText) 
{
    var declareInfo = null;
    var ffiHelper = {};
    var thunkSize = 0;
	
	var declareText = ffi_cleanDeclare( arg_declareText ); 

    try 
	{
        declareInfo = ffi_parseDeclare(declareText);
    }
    catch (err) 
	{
        throw new Error(sprintf("parse declare %s error %s\n", declareText, err.message));
    }

    ffiHelper["returnType"] = ENUM_TABLE_FFI_VALUE_TYPE[declareInfo.returnType];
    ffiHelper["stackType"] = ENUM_TABLE_FFI_STACK_TYPE[declareInfo.stackType];
    ffiHelper["name"] = declareInfo.name;

    ffiHelper["argTypes"] = _.map(declareInfo.argTypes, function (item) 
	{
        assert(_.has(ENUM_TABLE_FFI_VALUE_TYPE, item));

        return ENUM_TABLE_FFI_VALUE_TYPE[item];
    });

    assert(ffiHelper["returnType"]);
    assert(ffiHelper["stackType"]);
    assert(ffiHelper["name"]);

    thunkSize = process.reserved.bindings.ffi_sizeofThunk(ffiHelper);

    return thunkSize;
}
exports.sizeofThunk = ffi_sizeofThunk;

function ffi_thunk(jsCallbackRoutine, arg_declareText, arg_thisObject, arg_reserved) 
{
    var declareInfo = null;
    var ffiHelper = {};

    var nBufferSize = 0;
    var bytesWritten = 0;
    var lpThunkBuffer = null;

    var param_thisObject = arg_thisObject || this;
    var param_reserved = arg_reserved || null;
	
	var declareText = ffi_cleanDeclare( arg_declareText ); 

    try 
	{
        declareInfo = ffi_parseDeclare(declareText);
    }
    catch (err) 
	{
        throw new Error(sprintf("parse declare %s error %s\n", declareText, err.message));
    }


    ffiHelper["returnType"] = ENUM_TABLE_FFI_VALUE_TYPE[declareInfo.returnType];
    ffiHelper["stackType"] = ENUM_TABLE_FFI_STACK_TYPE[declareInfo.stackType];
    ffiHelper["name"] = declareInfo.name;

    ffiHelper["argTypes"] = _.map(declareInfo.argTypes, function (item) 
	{
        assert(_.has(ENUM_TABLE_FFI_VALUE_TYPE, item));

        return ENUM_TABLE_FFI_VALUE_TYPE[item];
    });

    assert(ffiHelper["returnType"]);
    assert(ffiHelper["stackType"]);
    assert(ffiHelper["name"]);

    // fixed
    nBufferSize = ffi_sizeofThunk(declareText);
    if (0 == nBufferSize) {
        throw new Error(sprintf("calc thunk size faild"));
    }

    lpThunkBuffer = Buffer.allocEx(nBufferSize).fill(0);

    function _thunk_helper(reserved) 
	{
        var typedArgv = null;
        var rawArgv = Array.prototype.slice.call(arguments);
        var rawCallbackRet = 0;

        // remove reserved
        rawArgv.shift();

        typedArgv = rawArgsToTypedArgs(declareInfo.argTypes, rawArgv);

        typedArgv.push(reserved);

        rawCallbackRet = jsCallbackRoutine.apply(param_thisObject, typedArgv);

        // first fix to normal
        rawCallbackRet = _fixRawValueToTypedValue(declareInfo.returnType, rawCallbackRet);

        // then cast to ffi supported value
        rawCallbackRet = _castJsValueToFFISupportValue(declareInfo.returnType, rawCallbackRet);

        return rawCallbackRet;
    }

    bytesWritten = process.reserved.bindings.ffi_thunk(
        ffiHelper,
        lpThunkBuffer,
        _thunk_helper,
        param_thisObject,
        param_reserved
    );

    if (bytesWritten != nBufferSize) 
	{
        lpThunkBuffer.free();
        throw new Error(sprintf("make thunk faild"));
    }

    lpThunkBuffer._thunk_helper = _thunk_helper;

    return lpThunkBuffer;
}
exports.thunk = ffi_thunk;


function ffi_batchBind( arg_hModule , arg_declares )
{
	var declareInfo = null;
	
	var routineTable = {};
	
	assert( _.isArray( arg_declares ) && ( 0 != arg_declares.length ) );


	_.each( arg_declares , function( declareText ) 
	{
		try 
		{
			declareInfo = ffi_parseDeclare( declareText );
		}
		catch (err) 
		{
			throw new Error(sprintf("parse declare %s error %s\n", declareText, err.message));
		}	
		
		assert( declareInfo.name );
		
		routineTable[ declareInfo.name ] = ffi_bindModule( arg_hModule , declareText );
	});
	
	return routineTable;
}
exports.batchBind = ffi_batchBind;

function ffi_loadAndBatchBind( moduleName , arg_declares )
{
	var declareInfo = null;
	
	assert( _.isString( moduleName) );
	
	var hModule = ffi_loadLibrary( moduleName );
	
	if ( !hModule )
	{
		throw new Error(sprintf("load %s faild" , moduleName ));
	}
	
	var routineTable = {};
	
	assert( _.isArray( arg_declares ) && ( 0 != arg_declares.length ) , "declares must be array" );

	_.each( arg_declares , function( declareText ) 
	{
		declareInfo = ffi_parseDeclare( declareText );
		
		assert( declareInfo.name );
		
		routineTable[ declareInfo.name ] = ffi_bindModule( hModule , declareText );
	});
	
	return routineTable;
}
exports.loadAndBatchBind = ffi_loadAndBatchBind;



function main(  )
{


	return 0;
}

if ( !module.parent )
{
	main();
}
