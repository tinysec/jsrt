'use strict';


var arch_x64 = ("x64" == process.arch);
var MAX_RECU_LEVEL = 10;

function escapeDoubleQuotes(str)
{
	return str.replace(/\\([\s\S])|(")/g, "\\$1$2");
}

function sprintf()
{
	if (0 == arguments.length)
	{
		return '';
	}

	if ('string' == typeof arguments[0])
	{
		if (0 === arguments[0].length)
		{
			return '';
		}

		if (-1 === arguments[0].indexOf('%'))
		{
			return arguments[0];
		}

		return _internal_sprintf.apply(this , arguments);
	}
	else
	{
		return _inspect( arguments[0], 0, 0 );
	}
}
exports.sprintf = sprintf;

function printf()
{
	var totaltext = sprintf.apply(this, arguments);
	if (0 == totaltext.length)
	{
		totaltext = null;
		return;
	}

	var singletext = '';
	var offset = 0;
	var singlelength = 0;
	var leftLength = totaltext.length;

	for (offset = 0; offset < totaltext.length; offset += singlelength)
	{
		singlelength = Math.min(1024, leftLength);

		singletext = totaltext.substring(offset, offset + singlelength);

		if (0 != singletext.length)
		{
			process.reserved.bindings.host_output(singletext);
		}

		leftLength -= singlelength;

		if (0 == leftLength)
		{
			break;
		}

		singletext = null;
	}
}
exports.printf = printf;

function vprintf()
{
	if ( process.verbose )
	{
		return printf.apply(this, arguments);
	}
}
exports.vprintf = vprintf;

function DbgPrint()
{
	var totaltext = sprintf.apply(this, arguments);
	if (0 == totaltext.length)
	{
		totaltext = null;
		return;
	}

	var singletext = '';
	var offset = 0;
	var singlelength = 0;
	var leftLength = totaltext.length;

	for (offset = 0; offset < totaltext.length; offset += singlelength)
	{
		singlelength = Math.min(1024, leftLength);

		singletext = totaltext.substring(offset, offset + singlelength);

		if (0 != singletext.length)
		{
			process.reserved.bindings.host_dbgprint(singletext);
		}

		leftLength -= singlelength;

		if (0 == leftLength)
		{
			break;
		}

		singlelength = null;
	}
}
exports.DbgPrint = DbgPrint;

function KdPrint()
{
	if ( process.verbose )
	{
		return DbgPrint.apply(this, arguments);
	}
}
exports.KdPrint = KdPrint;

//-----------------------------------------------------------------------------------------------------------------------

function _internal_sprintf()
{
	var argv = Array.prototype.slice.call(arguments);
	var format = argv[0];
	var index = 0;
	var final_text = '';
	var option = null;

	argv.shift();

	for (index = 0; index < format.length;)
	{
		if ('%' == format.charAt(index))
		{
			if (index != (format.length - 1))
			{
				if ('%' == format.charAt(index + 1))
				{
					final_text += '%';
					index += 2;
					continue;
				}
				else
				{
					// format.
					option = _parse_single_format(format.substring(index + 1, format.length));

					if ('' == option.type)
					{
						final_text += '%';
						index += 1;
						continue;
					}
					else
					{
						if (0 == argv.length)
						{
							final_text += format.substring(index, index + option.len + 1);
						}
						else
						{
							final_text += _handle_single_type(option , argv);
							argv.shift();
						}
					}

					index += 1 + option.len;
				}
			}
			else
			{
				final_text += '%';
				break;
			}
		}
		else
		{
			final_text += format.charAt(index);
			index += 1;
			continue;
		}
	}
	
	argv = null;
	
	return final_text;
}

// %[flags][field width][.precision][length]type
function _parse_single_format(format)
{
	var index = 0;

	var field_width = '';
	var precision = '';
	var left = '';

	var option = {

		// flags
		'prefix': '',
		'sign': false,
		'leftAlign': false,
		'blankPadding': false,
		'sharp': false,
		'zeroPadding': false,

		'fieldWidth': 0,
		'precision': 0,

		// [length] type
		'hh': false,
		'h': false,
		'l': false,
		'll': false,
		'L': false,
		'z': false,
		'j': false,
		't': false,
		'I': false,
		'I32': false,
		'I64': false,
		'q': false,

		// format char 
		'type': ''
	};

	do 
	{
		option.len = 0;
		option.type = '';

		// [flags]
		while (index < format.length)
		{
			if ('+' === format.charAt(index))
			{
				option.sign = true;
				index++;
			}
			else if (' ' === format.charAt(index))
			{
				option.blankPadding = true;
				index++;
			}
			else if ('-' === format.charAt(index))
			{
				option.leftAlign = true;
				index++;
			}
			else if ('#' === format.charAt(index))
			{
				option.sharp = true;
				index++;
			}
			else if ('0' === format.charAt(index))
			{
				option.zeroPadding = true;
				index++;
			}
			else
			{
				break;
			}
		}

		left = format.substring(index, format.length);
		if (left.length <= 0)
		{
			break;
		}

		// [field width]
		while (index < format.length)
		{
			if (('0' > format.charAt(index)) || ('9' < format.charAt(index)))
			{
				break;
			}

			field_width += format.charAt(index);
			index++;
		}


		left = format.substring(index, format.length);
		if (left.length <= 0)
		{
			break;
		}

		if (field_width.length > 0)
		{
			option.fieldWidth = parseInt(field_width);
		}
		else
		{
			option.fieldWidth = 0;
		}

		// [.precision]
		if ('.' === format.charAt(index))
		{
			// Calc Precision Length
			index++;

			while (index < format.length)
			{
				if (('0' > format.charAt(index)) || ('9' < format.charAt(index)))
				{
					break;
				}

				precision += format.charAt(index);
				index++;
			}


			left = format.substring(index, format.length);
			if (left.length <= 0)
			{
				break;
			}

			if (precision.length > 0)
			{
				option.precision = parseInt(precision);
			}
			else
			{
				option.precision = 0;
			}
		}
		else
		{
			option.precision = 0;
		}

		left = format.substring(index, format.length);
		if (left.length <= 0)
		{
			break;
		}

		// [length] type
		if (left.length >= 3)
		{
			if ('I64' === left.substring(0, 3))
			{
				option.I64 = true;

				index += 3;
			}
			else if ('I32' === left.substring(0, 3))
			{
				option.I32 = true;

				index += 3;
			}
		}
		else if (left.length >= 2)
		{
			if ('hh' === left.substring(0, 2))
			{
				option.hh = true;

				index += 2;
			}
			else if ('ll' === left.substring(0, 2))
			{
				option.ll = true;

				index += 2;
			}
		}
		else if (left.length >= 1)
		{
			if ('h' === left.substring(0, 1))
			{
				option.h = true;

				index += 1;
			}
			else if ('l' === left.substring(0, 1))
			{
				option.l = true;

				index += 1;
			}
			else if ('L' === left.substring(0, 1))
			{
				option.L = true;

				index += 1;
			}
			else if ('z' === left.substring(0, 1))
			{
				option.z = true;

				index += 1;
			}
			else if ('j' === left.substring(0, 1))
			{
				option.j = true;

				index += 1;
			}
			else if ('t' === left.substring(0, 1))
			{
				option.x = true;

				index += 1;
			}
			else if ('I' === left.substring(0, 1))
			{
				option.I = true;

				index += 1;
			}
			else if ('q' === left.substring(0, 1))
			{
				option.q = true;

				index += 1;
			}
		}

		left = format.substring(index, format.length);
		if (left.length <= 0)
		{
			break;
		}

		// type

		var xx_type = format.charAt(index);

		xx_type = xx_type.toLowerCase();

		if (('a'.charCodeAt(0) <= xx_type.charCodeAt(0)) &&
			('z'.charCodeAt(0) >= xx_type.charCodeAt(0))
		)
		{
			option.type = format.charAt(index);
			index += 1;
		}
		else
		{
			break;
		}

		left = format.substring(index, format.length);

	} while (false);

	option.len = index;

	return option;
}

function _handle_single_type(option, argv)
{
	var strText = '';
	var strFinal = '';
	var nIndex = 0;

	do 
	{
		if ('a' == option.type.toLowerCase())
		{
			strText = _handle_type_a(option, argv);
		}
		else if ('b' == option.type.toLowerCase())
		{
			strText = _handle_type_b(option, argv);
		}
		else if ('c' == option.type.toLowerCase())
		{
			strText = _handle_type_c(option, argv);
		}
		else if ('d' == option.type.toLowerCase())
		{
			strText = _handle_type_d(option, argv);
		}
		else if ('e' == option.type.toLowerCase())
		{
			strText = _handle_type_e(option, argv);
		}
		else if ('f' == option.type.toLowerCase())
		{
			strText = _handle_type_f(option, argv);
		}
		else if ('g' == option.type.toLowerCase())
		{
			strText = _handle_type_g(option, argv);
		}
		else if ('h' == option.type.toLowerCase())
		{
			strText = _handle_type_h(option, argv);
		}
		else if ('i' == option.type.toLowerCase())
		{
			strText = _handle_type_i(option, argv);
		}
		else if ('j' == option.type.toLowerCase())
		{
			strText = _handle_type_j(option, argv);
		}
		else if ('k' == option.type.toLowerCase())
		{
			strText = _handle_type_k(option, argv);
		}
		else if ('l' == option.type.toLowerCase())
		{
			strText = _handle_type_l(option, argv);
		}
		else if ('m' == option.type.toLowerCase())
		{
			strText = _handle_type_m(option, argv);
		}
		else if ('n' == option.type.toLowerCase())
		{
			strText = _handle_type_n(option, argv);
		}
		else if ('o' == option.type.toLowerCase())
		{
			strText = _handle_type_o(option, argv);
		}
		else if ('p' == option.type.toLowerCase())
		{
			strText = _handle_type_p(option, argv);
		}
		else if ('q' == option.type.toLowerCase())
		{
			strText = _handle_type_q(option, argv);
		}
		else if ('r' == option.type.toLowerCase())
		{
			strText = _handle_type_r(option, argv);
		}
		else if ('s' == option.type.toLowerCase())
		{
			strText = _handle_type_s(option, argv);
		}
		else if ('t' == option.type.toLowerCase())
		{
			strText = _handle_type_t(option, argv);
		}
		else if ('u' == option.type.toLowerCase())
		{
			strText = _handle_type_u(option, argv);
		}
		else if ('v' == option.type.toLowerCase())
		{
			strText = _handle_type_v(option, argv);
		}
		else if ('w' == option.type.toLowerCase())
		{
			strText = _handle_type_w(option, argv);
		}
		else if ('x' == option.type.toLowerCase())
		{
			strText = _handle_type_x(option, argv);
		}
		else if ('y' == option.type.toLowerCase())
		{
			strText = _handle_type_y(option, argv);
		}
		else if ('z' == option.type.toLowerCase())
		{
			strText = _handle_type_z(option, argv);
		}
		else
		{
			//nop
		}

	} while (false);

	if (option.fieldWidth <= strText.length)
	{
		if (0 == option.fieldWidth)
		{
			strFinal = strText;
		}
		else
		{
			strFinal = strText.substring(strText.length - option.fieldWidth, strText.length);
		}
	}
	else
	{
		for (nIndex = 0; nIndex < option.fieldWidth - strText.length; nIndex++)
		{
			if (option.blankPadding)
			{
				strFinal += ' ';
			}
			else if (option.zeroPadding)
			{
				strFinal += '0';
			}
		}
		strFinal += strText;
	}

	strFinal = option.prefix + strFinal;
	
	strText = null;

	return strFinal;
}

// %a
function _handle_type_a(option, argv)
{

}

// %b
function _handle_type_b(option, argv)
{

}

// %c the character with that ASCII value
function _handle_type_c(option, argv)
{
	var strFinal = '';
	var nCharCode = 0;

	do 
	{
		if ('number' === typeof argv[0])
		{
			nCharCode = argv[0];
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nCharCode = 0;
			}
			else
			{
				nCharCode = argv[0].charCodeAt(0);
			}
		}
		else
		{
			nCharCode = 0;
		}

		strFinal = String.fromCharCode(nCharCode);

		if ('C' === option.type)
		{
			strFinal = strFinal.toUpperCase();
		}

	} while (false);

	return strFinal;
}

// %d
function _handle_type_d(option, argv)
{
	var strFinal = '';
	var nValue = 0;

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];

			strFinal = nValue.toString();
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}

			strFinal = nValue.toString();
		}
		else if (null === argv[0])
		{
			nValue = 0;
			strFinal = nValue.toString();
		}
		else if ('object' == typeof argv[0])
		{
			if ( Number64.isNumber64( argv[0]) )
			{
				strFinal = argv[0].toShortString(10);
			}
			else if ('function' === typeof argv[0].toString)
			{
				strFinal = argv[0].toString(10);
			}
			else
			{
				nValue = Number(argv[0]);
				strFinal = nValue.toString(10);
			}
		}
		else
		{
			nValue = Number(argv[0]);
			strFinal = nValue.toString();
		}

	} while (false);

	return strFinal;
}

// %e
function _handle_type_e(option, argv)
{
	
}

// %f
function _handle_type_f(option, argv)
{
	var strFinal = '';
	var nValue = 0;

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}
		}
		else
		{
			nValue = 0;
		}

		strFinal = nValue.toString();

	} while (false);

	return strFinal;
}

// %g
function _handle_type_g(option, argv)
{
	
}

// %h
function _handle_type_h(option, argv)
{
	
}

// %i
function _handle_type_i(option, argv)
{
	var strFinal = '';
	var nValue = 0;

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];
			strFinal = nValue.toString();
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}
			strFinal = nValue.toString();
		}
		else if (null === argv[0])
		{
			nValue = 0;
			strFinal = nValue.toString();
		}
		else if ('object' == typeof argv[0])
		{
			if ( Number64.isNumber64( argv[0] ) )
			{
				strFinal = argv[0].toString(10);
			}
			else
			{
				nValue = Number(argv[0]);
				strFinal = nValue.toString(10);
			}
		}
		else
		{
			nValue = Number(argv[0]);
			strFinal = nValue.toString();
		}

	} while (false);

	return strFinal;
}

// %j
function _handle_type_j(option, argv)
{
	
}

// %k
function _handle_type_k(option, argv)
{
	
}

// %l
function _handle_type_l(option, argv)
{
	
}

// %m
function _handle_type_m(option, argv)
{

}

// %n
function _handle_type_n(option, argv)
{

}

// %o
function _handle_type_o(option, argv)
{
	var strFinal = '';
	var nValue = 0;

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}
		}
		else
		{
			nValue = 0;
		}

		strFinal = nValue.toString(8);

	} while (false);

	return strFinal;
}

// %p
function _handle_type_p(option, argv)
{
	var strFinal = '';
	var strText = '';
	var nValue = 0;

	do {
		if (arch_x64)
		{
			option.fieldWidth = 16;
		}
		else
		{
			option.fieldWidth = 8;
		}

		option.zeroPadding = true;

		if ('string' === typeof argv[0])
		{
			if (0 === argv[0].toLowerCase().indexOf('0x'))
			{
				strFinal = argv[0].toLowerCase();
			}
			else
			{
				strFinal = parseInt(argv[0], 10).toString(16).toLowerCase();
			}
		}
		else if ('number' === typeof argv[0])
		{
			strFinal = argv[0].toString(16).toLowerCase();
		}
		else if (null === argv[0])
		{
			nValue = 0;
			strFinal = nValue.toString(16).toLowerCase();
		}
		else if ('object' == typeof argv[0])
		{
			if ( Buffer.isBuffer(argv[0]) )
			{
				strFinal = argv[0].address.toString(16);
			}
			else if ( Number64.isNumber64( argv[0] ) )
			{
				strFinal = argv[0].toString(16);

				if ('X' === option.type)
				{
					strFinal = strFinal.toUpperCase();
					break;
				}
			}
			else
			{
				nValue = Number(argv[0]);
				strFinal = nValue.toString(16);
			}
		}
		else
		{
			nValue = Number(argv[0]);
			strFinal = nValue.toString(16);
		}

	} while (false);

	return strFinal;
}

// %q
function _handle_type_q(option, argv)
{
	
}

// %r
function _handle_type_r(option, argv)
{

}

// %s
function _handle_type_s(option, argv)
{
	var strFinal = '';
	var strText = '';

	do {
		if ('string' === typeof argv[0])
		{
			strFinal = argv[0];
		}
		else if ('undefined' === typeof argv[0])
		{
			strFinal = 'undefined';
		}
		else if ('number' === typeof argv[0])
		{
			if (argv[0] < 0)
			{
				strText = argv[0].toString(10);
			}
			else
			{
				strText = argv[0].toString(10);
			}

			strFinal = strText;
		}
		else
		{
			strFinal = _inspect(argv[0]);
		}

		if ('S' === option.type)
		{
			strFinal = strFinal.toUpperCase();
		}

	} while (false);

	return strFinal;
}

// %t
function _handle_type_t(option, argv)
{

}

// %u
function _handle_type_u(option, argv)
{
	var strFinal = '';
	var nValue = 0;

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];
			nValue = nValue >>> 0;
			strFinal = nValue.toString();
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}

			nValue = nValue >>> 0;
			strFinal = nValue.toString();
		}
		else if (null === argv[0])
		{
			nValue = 0;
			strFinal = nValue.toString();
		}
		else if ('object' == typeof argv[0])
		{
			if ( Number64.isNumber64() )
			{
				strFinal = argv[0].toShortString(10);
			}
			else if ('function' === typeof argv[0].toString)
			{
				strFinal = argv[0].toString(10);
			}
			else
			{
				nValue = Number(argv[0]);
				strFinal = nValue.toString(10);
			}
		}
		else
		{
			nValue = Number(argv[0]);
			nValue = nValue >>> 0;
			strFinal = nValue.toString();
		}

	} while (false);

	return strFinal;
}

// %v
function _handle_type_v(option, argv)
{

}

// %w
function _handle_type_w(option, argv)
{

}

// %x
function _handle_type_x(option, argv)
{
	var strFinal = '';
	var nValue = 0;
	var strText = '';

	do {
		if ('number' === typeof argv[0])
		{
			nValue = argv[0];

			if (nValue < 0)
			{
				strFinal = Number64(nValue).toString(16);
			}
			else
			{
				strFinal = nValue.toString(16);
			}
		}
		else if ('string' === typeof argv[0])
		{
			if (0 === argv[0].length)
			{
				nValue = 0;
			}
			else
			{
				nValue = argv[0].charCodeAt(0);
			}

			strFinal = nValue.toString(16);
		}
		else if (null === argv[0])
		{
			nValue = 0;
			strFinal = nValue.toString(16);
		}
		else if ('object' === typeof argv[0])
		{
			if ( Buffer.isBuffer(argv[0]) )
			{
				strFinal = argv[0].address.toString(16);
			}
			else if ( Number64.isNumber64( argv[0] ) )
			{
				strFinal = argv[0].toShortString(16);
			}
			else
			{
				nValue = Number(argv[0]);
				strFinal = nValue.toString(16);
			}
		}
		else
		{
			nValue = 0;
			strFinal = nValue.toString(16);
		}

		if ('X' === option.type)
		{
			strFinal = strFinal.toUpperCase();
		}

	} while (false);

	return strFinal;
}

// %y
function _handle_type_y(option, argv)
{
}

// %z
function _handle_type_z(option, argv)
{
	
}

function _inspect_Function(input, level)
{
	var strTab = '';
	var index = 0;
	var key = null;
	var item = null;

	var strItem = '';
	var strText = '';
	var strFullText = '';

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	for (key in input)
	{
		item = input[key];

		if (isItemNeedIncLevel(item))
		{
			if ((level + 1) >= MAX_RECU_LEVEL)
			{
				strItem = '[' + typeof item + ']';
			}
			else
			{
				strItem = _inspect(item, level + 1);
			}
		}
		else
		{
			strItem = _inspect(item, 0);
		}

		if (isItemNeedQuota(item))
		{
			strItem = '"' + escapeDoubleQuotes(strItem) + '"';
		}

		strText += strTab + '\t"' + key + '" : ' + strItem + ' ,\n';
	}

	if (0 == strText.length)
	{
		strFullText = "[function]";
	}
	else
	{
		strFullText = "{\n" + strText + strTab + "}";
	}
	
	strText= null;

	return strFullText;
}

function _inspect_Date(input, level)
{
	var strTab = '';
	var index = 0;

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	return strTab + input.toUTCString();
}

function _inspect_RegExp(input, level)
{
	var strTab = '';
	var index = 0;

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	return strTab + input.toString();
}

function _inspect_Error(input, level)
{
	var strTab = '';
	var index = 0;
	var key = null;
	var item = null;

	var strItem = '';
	var strText = '';

	var stack_array = null;
	var error_stack = '';

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	strText += '{\n';

	for (key in input)
	{
		item = input[key];

		if (isItemNeedIncLevel(item))
		{
			if ((level + 1) >= MAX_RECU_LEVEL)
			{
				strItem = '[' + typeof item + ']';
			}
			else
			{
				strItem = _inspect(item, level + 1);
			}
		}
		else
		{
			strItem = _inspect(item, 0);
		}

		if (isItemNeedQuota(item))
		{
			strItem = '"' + escapeDoubleQuotes(strItem) + '"';
		}

		strText += strTab + '\t"' + key + '" : ' + strItem + ' ,\n';
	}
	
	if ( input.stack )
	{
		stack_array = input.stack.split('\n');

		stack_array.shift();

		for (index = 0; index < stack_array.length; index++)
		{
			item = stack_array[index].trim();

			if (0 == index)
			{
				error_stack += '\t\t"' + strTab + item + '\n';
			}
			else if (index == stack_array.length - 1)
			{
				error_stack += '\t\t' + strTab + item + '"\n';
			}
			else
			{
				error_stack += '\t\t' + strTab + item + '\n';
			}
		}
	}


	strText += strTab + '\t"name" : "' + input.name + '" , \n';
	strText += strTab + '\t"message" : "' + input.message + '" , \n';
	strText += strTab + '\t"stack" : \n' + error_stack;

	strText += strTab + '}';

	return strText;
}

function ALIGN_DOWN_BY(length, alignment)
{
	return (length) & ~(alignment - 1);
}

function ALIGN_UP_BY(length, alignment)
{
	return ALIGN_DOWN_BY(length + alignment - 1, alignment);
}


function _inspect_Buffer(buf, level)
{
	var strText = '';

	var nLine = 0;

	var strLine = '';
	var strRow = '';

	var nChar = 0;
	var strChar = '';
	var strHex = '';
	var strOffset = '';

	var strTemp = '';

	var nAlignLength = 0;

	do {
		var strTab = '';
		var index = 0;

		for (index = 0; index < level; index++)
		{
			strTab += '\t';
		}

		strTemp = buf.length.toString(16).toUpperCase();
		if (1 == strTemp.length)
		{
			strTemp = '0' + strTemp;
		}

		if (!buf.isValid())
		{
			if (buf.isFreed())
			{
				strText = strTab + '<Buffer (freed) at 0x' + buf.address.toString(16) + ' with 0x' + strTemp + ' bytes>\n';
			}
			else
			{
				strText = strTab + '<Buffer Pointer at 0x' + buf.address.toString(16) + '>\n';
			}

			break;
		}


		strText = strTab + '<Buffer at 0x' + buf.address.toString(16) + ' with 0x' + strTemp + ' bytes>\n';

		nAlignLength = ALIGN_UP_BY(buf.length, 16);

		nAlignLength = Math.min(nAlignLength, 1024);

		for (nLine = 0; nLine < nAlignLength; nLine++)
		{
			if (0 === nLine % 16)
			{
				strOffset = nLine.toString(16).toUpperCase();
				if (1 == strOffset.length)
				{
					strOffset = '0000' + strOffset;
				}
				else if (2 == strOffset.length)
				{
					strOffset = '000' + strOffset;
				}
				else if (3 == strOffset.length)
				{
					strOffset = '00' + strOffset;
				}
				else if (4 == strOffset.length)
				{
					strOffset = '0' + strOffset;
				}

				strLine += strTab + '0x' + strOffset + '\t';
			}

			if (nLine >= buf.length)
			{
				strLine += '   ';
				strChar = ' ';
			}
			else
			{
				try
				{
					nChar = (nLine < buf.length ? buf.readUInt8(nLine) : 0);

					strHex = nChar.toString(16).toUpperCase();
					if (1 == strHex.length)
					{
						strHex = '0' + strHex;
					}

					strLine += strHex + ' ';

					strChar = ((nChar >= 32 && nChar < 127) ? String.fromCharCode(nChar) : '.');
				}
				catch (err)
				{
					strLine += '??' + ' ';

					strChar = ((nChar >= 32 && nChar < 127) ? String.fromCharCode(nChar) : '?');
				}
			}


			strRow += strChar;

			if (0 === (nLine + 1) % 16)
			{
				strLine += '\t' + strRow + '\n';
				strRow = '';
			}
		}

		strText = strText + strLine;

		if (0 != strRow.length)
		{
			strText += '\t' + strRow;
		}


	} while (false);

	return strText;
}

function _inspect_Number64(input, level)
{
	var strTab = '';
	var index = 0;

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	return strTab + "0x" + input.toString(16);
}

function _inspect_moment(input, level)
{
	var strTab = '';
	var index = 0;

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	return strTab + input.format("YYYY-MM-DD hh:mm:ss:SSS") + " // moment";
}

function isItemNeedIncLevel(input)
{
	if (undefined == input)
	{
		return false;
	}
	else if (null == input)
	{
		return false;
	}
	else if (NaN === input)
	{
		return false;
	}
	else if (Infinity === input)
	{
		return false;
	}
	else if ('string' == typeof input)
	{
		return false;
	}
	else if ('boolean' == typeof input)
	{
		return false;
	}
	else if ('number' == typeof input)
	{
		return false;
	}
	else if ('function' == typeof input)
	{
		return true;
	}

	// complex
	else if (input instanceof RegExp)
	{
		return false;
	}
	else if (input instanceof Date)
	{
		return false;
	}
	else if (input instanceof Error)
	{
		return false;
	}
	else if (Array.isArray(input))
	{
		return true;
	}
	else if ('object' == typeof input)
	{
		if (Buffer.isBuffer(input))
		{
			return false;
		}
		
		if ( Number64.isNumber64( input ) )
		{
			// isNumber64
			return false;
		}

		if (input._isAMomentObject)
		{
			return false;
		}

		return true;
	}
	else
	{
		return false;
	}

	return false;
}

function isItemNeedQuota(input)
{
	if (undefined == input)
	{
		return false;
	}
	else if (null == input)
	{
		return false;
	}
	else if (NaN === input)
	{
		return false;
	}
	else if (Infinity === input)
	{
		return false;
	}
	else if ('string' == typeof input)
	{
		return true;
	}
	else if ('boolean' == typeof input)
	{
		return false;
	}
	else if ('number' == typeof input)
	{
		return false;
	}
	else if ('function' == typeof input)
	{
		return false;
	}

	// complex
	else if (input instanceof RegExp)
	{
		return false;
	}
	else if (input instanceof Date)
	{
		return false;
	}
	else if (input instanceof Error)
	{
		return false;
	}
	else if (Array.isArray(input))
	{
		return false;
	}
	else if ('object' == typeof input)
	{
		
		if (Buffer.isBuffer(input))
		{
			return false;
		}
		

		if ( Number64.isNumber64( input ) )
		{
			// isNumber64
			return false;
		}

		return false;
	}
	else
	{
		return false;
	}

	return false;
}

function _inspect_Array(input, level)
{
	var strTab = '';
	var index = 0;
	var item = null;

	var strText = '';
	var strItem = '';

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	if (0 != input.length)
	{
		strText += '[\n';

		for (index = 0; index < input.length; index++)
		{
			item = input[index];

			if (isItemNeedIncLevel(item))
			{
				if ((level + 1) >= MAX_RECU_LEVEL)
				{
					strItem = '[' + typeof item + ']';
				}
				else
				{
					strItem = _inspect(item, level + 1);
				}
			}
			else
			{
				strItem = _inspect(item, 0);
			}

			if (isItemNeedQuota(item))
			{
				strItem = '"' + escapeDoubleQuotes(strItem) + '"';
			}

			if (index == (input.length - 1))
			{
				strText += strTab + '\t' + index + ' => ' + strItem + '\n';
			}
			else
			{
				strText += strTab + '\t' + index + ' => ' + strItem + ' ,\n';
			}
		}

		strText += strTab + ']';
	}
	else
	{
		strText += '[]';
	}

	return strText;
}

function _inspect_Object(input, level)
{
	var strTab = '';
	var index = 0;
	var key = null;
	var item = null;

	var strItem = '';
	var strText = '';
	var strFullText = '';
	var strBody = '';

	for (index = 0; index < level; index++)
	{
		strTab += '\t';
	}

	for (key in input)
	{
		item = input[key];

		if (isItemNeedIncLevel(item))
		{
			if ((level + 1) >= MAX_RECU_LEVEL)
			{
				strItem = '[' + typeof item + ']';
			}
			else
			{
				strItem = _inspect(item, level + 1);
			}
		}
		else
		{
			strItem = _inspect(item, 0);
		}

		if (isItemNeedQuota(item))
		{
			strItem = '"' + escapeDoubleQuotes(strItem) + '"';
		}

		strText += strTab + '\t"' + key + '" : ' + strItem + ' ,\n';
	}

	if (' ,\n' == strText.substring(strText.length - 3, strText.length))
	{
		strText = strText.substring(0, strText.length - 3) + '\n';
	}

	if (0 == strText.length)
	{
		strFullText = "{}";
	}
	else
	{
		strFullText = "{\n" + strText + strTab + '}';
	}

	return strFullText;
}

function _inspect(input, level)
{
	var strTab = '';
	var index = 0;

	if (level)
	{
		for (index = 0; index < level; index++)
		{
			strTab += '\t';
		}
	}

	if (undefined === input)
	{
		return strTab + 'undefined';
	}
	else if (null === input)
	{
		return strTab + 'null';
	}
	else if (NaN === input)
	{
		return strTab + 'NaN';
	}
	else if (Infinity === input)
	{
		return strTab + 'Infinity';
	}
	else if ('string' == typeof input)
	{
		return strTab + input;
	}
	else if ('boolean' == typeof input)
	{
		return strTab + input.toString();
	}
	else if ('number' == typeof input)
	{
		return strTab + input.toString(10);
	}
	else if ('function' == typeof input)
	{
		return _inspect_Function(input, level);
	}

	// complex
	else if (input instanceof RegExp)
	{
		return _inspect_RegExp(input, level);
	}
	else if (input instanceof Date)
	{
		return _inspect_Date(input, level);
	}
	else if (input instanceof Error)
	{
		return _inspect_Error(input, level);
	}
	else if (Array.isArray(input))
	{
		return _inspect_Array(input, level);
	}
	else if ('object' == typeof input)
	{
		if (Buffer.isBuffer(input))
		{
			return _inspect_Buffer(input, level);
		}
	
		if ( Number64.isNumber64( input ) )
		{
			return _inspect_Number64(input);
		}

		if (input._isAMomentObject)
		{
			return _inspect_moment(input);
		}

		return _inspect_Object(input, level);
	}
	else
	{
		return "unknown";
	}
}


function main()
{


	return 0;
}

if (!module.parent)
{
	main();
}
