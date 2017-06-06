'use strict';


// config here
var MAX_RECU_LEVEL = 5;


function escapeDoubleQuotes(str)
{
	return str.replace(/\\([\s\S])|(")/g, "\\$1$2");
}

function serialize_from_undefined(input)
{
	return {
		"t": "uf"
	};
}

function unserialize_to_undefined(input)
{
	return undefined
}

function serialize_from_null(input)
{
	return {
		"t": "nu"
	};
}

function unserialize_to_null(input)
{

	return null;
}

function serialize_from_error(input)
{
	var ret = {
		"t": "er",
		"v":
		{
			"n": input.name,
			"m": input.message,
			"s": input.stack
		}
	};

	return ret;
}

function unserialize_to_error(input)
{
	var err = new Error();

	if ("object" != typeof input.v)
	{

		throw new Error('invalid error data object');
	}

	if ("string" != typeof input.v.n)
	{

		throw new Error('invalid error data name object');
	}

	if ("string" != typeof input.v.m)
	{
		throw new Error('invalid error data message object');
	}

	if ("string" != typeof input.v.s)
	{
		throw new Error('invalid error data stack object');
	}

	err.name = input.v.n;
	err.message = input.v.m;
	err.stack = input.v.s;

	return err;
}

function serialize_from_nan(input, cb)
{
	return {
		"t": "na"
	};

}

function unserialize_to_nan(input)
{
	return NaN;
}

function serialize_from_infinity(input)
{
	return {
		"t": "if"
	};
}

function unserialize_to_infinity(input)
{
	return Infinity;
}

function serialize_from_number(input)
{

	return {
		"t": "nb",
		"v": input
	};
}

function unserialize_to_number(input)
{
	if ("number" != typeof input.v)
	{
		throw new Error('bad input data number');
	}


	return input.v;

}

function serialize_from_string(input)
{
	return {
		"t": "st",
		"v": escapeDoubleQuotes(input)
	};

}

function unserialize_to_string(input)
{
	if ("string" != typeof input.v)
	{
		throw new Error('invalid string');
	}


	return input.v;

}

function serialize_from_boolean(input)
{
	return {
		"t": "bl",
		"v": input
	};

}

function unserialize_to_boolean(input)
{
	if ("boolean" != typeof input.v)
	{
		throw new Error('invalid boolean');
	}


	return input.v;

}

function serialize_from_date(input)
{
	return {
		"t": "dt",
		"v": input.toUTCString()
	};

}

function unserialize_to_date(input)
{
	var data = null;

	if ("string" != typeof input.v)
	{
		throw new Error('invalid date string');
	}

	return new Date(input.v);
}

function serialize_from_regexp(input)
{

	return {
		"t": "re",
		"v":
		{
			's': input.source,
			'g': input.global,
			'i': input.ignoreCase,
			'm': input.multiline
		}
	};


}

function unserialize_to_regexp(input)
{
	var config = "";

	if ("object" != typeof input.v)
	{
		throw new Error('invalid regexp');
	}

	if (input.v.g)
	{
		config += "g";
	}

	if (input.v.i)
	{
		config += "i";
	}

	if (input.v.m)
	{
		config += "m";
	}

	return new RegExp(input.v.s, config);

}

function serialize_from_buffer(input)
{
	var data = null;


	return {
		"t": "bf",
		"v": input.toString("hex")
	};

}

function unserialize_to_buffer(input)
{
	var data = null;

	if ("string" != typeof input.v)
	{

		throw new Error('invalid data');


	}

	return Buffer.from(input.v, "hex");
}

function serialize_from_Number64(input)
{
	return {
			"t": "n6",
			"v": '0x' + input.toString(16)
	};
}

function unserialize_to_Number64(input)
{
	if ("string" != typeof input.v)
	{
		throw new Error('invalid data');
	}

	return Number64(input.v);
}

function serialize_from_array(input, level)
{
	var output = [];
	var index = 0;
	var final_err = null;

	if (0 == input.length)
	{

		return {
			"t": "ar",
			"v": []
		};

	}

	for (index = 0; index < input.length; index++)
	{

		if (isItemNeedIncLevel(input[index]))
		{
			if ((level + 1) >= MAX_RECU_LEVEL)
			{
				// drop
			}
			else
			{
				if (isItemNeedIgnore(input[index]))
				{
					// ignore
				}
				else
				{
					output[index] = recu_serialize(input[index], level + 1);
				}

			}
		}
		else
		{
			if (isItemNeedIgnore(input[index]))
			{

			}
			else
			{
				output[index] = recu_serialize(input[index], level);
			}
		}

	}


	return {
		"t": "ar",
		"v": output
	};

}

function unserialize_to_array(input)
{
	var output = [];
	var index = 0;
	var final_err = null;

	if (!Array.isArray(input.v))
	{

		throw new Error('not array');

	}

	if (0 == input.v.length)
	{
		return [];
	}

	for (index = 0; index < input.v.length; index++)
	{

		output[index] = recu_unserialize(input.v[index]);

	}

	return output;

}


function serialize_from_object(input, level)
{
	var key = null;
	var index = 0;
	var final_err = null;
	var output = {};

	var keyCount = 0;

	if ("function" == typeof input.getOwnPropertyNames)
	{
		try
		{
			keyCount = input.getOwnPropertyNames().length;
		}
		catch (err)
		{
			//nop
		}
	}
	else
	{
		try
		{
			keyCount = Object.getOwnPropertyNames(input).length;
		}
		catch (err)
		{
			//nop
		}
	}

	if (0 == keyCount)
	{

		return {
			"t": "ob",
			"v":
			{}
		};

	}

	for (key in input)
	{

		if (isItemNeedIncLevel(input[key]))
		{
			if ((level + 1) >= MAX_RECU_LEVEL)
			{
				// drop
			}
			else
			{
				if (isItemNeedIgnore(input[key]))
				{

				}
				else
				{
					output[key] = recu_serialize(input[key], level + 1);
				}

			}
		}
		else
		{
			if (isItemNeedIgnore(input[key]))
			{

			}
			else
			{
				output[key] = recu_serialize(input[key], level);
			}
		}

	}


	return {
		"t": "ob",
		"v": output
	};

}

function unserialize_to_object(input)
{
	var key = null;
	var index = 0;
	var final_err = null;
	var output = {};
	var keyCount = 0;

	if ("object" != typeof input.v)
	{

		throw new Error('invalid data');

	}

	if ("function" == typeof input.v.getOwnPropertyNames)
	{
		try
		{
			keyCount = input.v.getOwnPropertyNames().length;
		}
		catch (err)
		{
			//nop
		}
	}
	else
	{
		try
		{
			keyCount = Object.getOwnPropertyNames(input.v).length;
		}
		catch (err)
		{
			//nop
		}
	}

	if (0 == keyCount)
	{
		return {};
	}

	for (key in input.v)
	{

		output[key] = recu_unserialize(input.v[key]);

	}

	return output;

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
	else if ("string" == typeof input)
	{
		return false;
	}
	else if ("boolean" == typeof input)
	{
		return false;
	}
	else if ("number" == typeof input)
	{
		return false;
	}
	else if ("function" == typeof input)
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
		return true;
	}
	else if ("object" == typeof input)
	{
		if ("function" == typeof Buffer)
		{
			if (Buffer.isBuffer(input))
			{
				return false;
			}
		}

		if ( Number64.isNumber64( input ) )
		{
			return false;
		}

		if ('function' == typeof input.isNumber64)
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

function isItemNeedIgnore(input)
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
	else if ("string" == typeof input)
	{
		return false;
	}
	else if ("boolean" == typeof input)
	{
		return false;
	}
	else if ("number" == typeof input)
	{
		return false;
	}
	else if ("function" == typeof input)
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
		return false;
	}
	else if ("object" == typeof input)
	{
		if ("function" == typeof Buffer)
		{
			if (Buffer.isBuffer(input))
			{
				return false;
			}
		}

		if ( Number64.isNumber64( input ) )
		{
			return false;
		}

		if ('function' == typeof input.isNumber64)
		{
			return false;
		}

		return false;
	}
	else if ("undefined" == typeof input)
	{
		return false;
	}
	else
	{
		return true;
	}

	return true;
}


function recu_serialize(input, level)
{
	if (undefined === input)
	{
		return serialize_from_undefined(input);
	}
	else if (null === input)
	{
		return serialize_from_null(input);
	}
	else if (NaN === input)
	{
		return serialize_from_nan(input);
	}
	else if (Infinity === input)
	{
		return serialize_from_infinity(input);
	}
	else if ("number" == typeof input)
	{
		return serialize_from_number(input);
	}
	else if ("string" == typeof input)
	{
		return serialize_from_string(input);
	}
	else if ("boolean" == typeof input)
	{
		return serialize_from_boolean(input);
	}

	// complex
	else if (input instanceof RegExp)
	{
		return serialize_from_regexp(input);
	}
	else if (input instanceof Date)
	{
		return serialize_from_date(input);
	}
	else if (input instanceof Error)
	{
		return serialize_from_error(input);
	}
	else if (Array.isArray(input))
	{
		return serialize_from_array(input, level);
	}
	else if ("object" == typeof input)
	{
		if ("function" == typeof Buffer)
		{
			if (Buffer.isBuffer(input))
			{
				return serialize_from_buffer(input);
			}
		}

		if ( Number64.isNumber64( input ) )
		{
			return serialize_from_Number64(input);
		}

		return serialize_from_object(input, level);
	}
	else if ("undefined" == typeof input)
	{
		return serialize_from_undefined(input);
	}
	else
	{

		throw new Error('unsupported type' + typeof input);

	}
}

function recu_unserialize(input)
{
	if (("object" != typeof input) || ("string" != typeof input.t))
	{
		throw new Error('bad unserialize input');
	}

	if ("uf" === input.t)
	{
		return unserialize_to_undefined(input);
	}
	else if ("nu" === input.t)
	{
		return unserialize_to_null(input);
	}
	else if ("nn" === input.t)
	{
		return unserialize_to_nan(input);
	}
	else if ("if" === input.t)
	{
		return unserialize_to_infinity(input);
	}
	else if ("st" === input.t)
	{
		return unserialize_to_string(input);
	}
	else if ("bl" === input.t)
	{
		return unserialize_to_boolean(input);
	}
	else if ("nb" === input.t)
	{
		return unserialize_to_number(input);
	}
	else if ("re" === input.t)
	{
		return unserialize_to_regexp(input);
	}
	else if ("dt" === input.t)
	{
		return unserialize_to_date(input);
	}
	else if ("er" === input.t)
	{
		return unserialize_to_error(input);
	}
	else if ("ar" === input.t)
	{
		return unserialize_to_array(input);
	}
	else if ("bf" === input.t)
	{
		if ("function" == typeof Buffer)
		{
			return unserialize_to_buffer(input);
		}
		else
		{

			throw new Error('unsupported type Buffer');

		}
	}
	else if ("n6" === input.t)
	{
		return unserialize_to_Number64(input);

	}
	else if ("ob" === input.t)
	{
		return unserialize_to_object(input);
	}
	else
	{

		throw new Error('unknown type');

	}
}

function serialize(input, arg_replacer, arg_space)
{
	var argv = Array.prototype.slice.call(arguments);

	argv.shift();

	argv.unshift(recu_serialize(input, 0));

	return JSON.stringify.apply(this, argv);

}
exports.serialize = serialize;

function unserialize(input)
{
	var argv = Array.prototype.slice.call(arguments);

	var obj = null;


	obj = JSON.parse(input);

	return recu_unserialize(obj);
}
exports.unserialize = unserialize;




function main()
{


	return 0;
}

if (!module.parent)
{
	main();
}
