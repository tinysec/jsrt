'use strict';

const _ = require("underscore");
const assert = require("assert");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


const encoding2codepage = base.encoding2codepage;




process.reserved.tables.bufferTable = {};

function add_to_buffer_table( address, length , auto_free  )
{
	var address_text = sprintf( "0x%p" , address );

	assert(0 != length, "invalid buffer length");

	// save to process.reserved.tables.bufferTable
	process.reserved.tables.bufferTable[address_text] = {
		"address": address_text,
		"length": length,
		"stack": base.stackTrace(0) ,
		"auto_free" : auto_free ? true : false 
	};
}



function Buffer()
{

	if (!(this instanceof Buffer))
	{
		throw new Error("invalid usage , use new Buffer instead");
	}


	this.__TYPE__ = "Buffer";
	this.address = Number64(0);
	this.length = 0;
	this.alreadyFreed = null;

	if (1 == arguments.length)
	{
		if (_.isNumber(arguments[0]))
		{
			if (arguments[0] <= 0)
			{
				throw new Error("invalid buffer size");
			}

			this.length = arguments[0];
		
			var helper = process.reserved.bindings.buffer_alloc(this.length);
			if ( !helper )
			{
				throw new Error(sprintf("alloc %d bytes faild" , length ) );
			}
			
			this.address = Number64(helper);

			add_to_buffer_table(this.address, this.length);


		}
		else if (_.isString(arguments[0]))
		{
			throw new Error("Deprecated usage");
		}
		else if (_.isArray(arguments[0]))
		{
			throw new Error("Deprecated usage");
		}
		else if (Buffer.isBuffer(arguments[0]))
		{
			throw new Error("Deprecated usage");
		}
	}
	else if (2 == arguments.length)
	{
		if (_.isNumber(arguments[0]))
		{
			if (arguments[0] < 0)
			{
				throw new Error("invalid buffer size");
			}

			if (0 != arguments[0])
			{
				this.length = arguments[0];
			}

			this.address = Number64(arguments[1]);

		}
		else if (_.isString(arguments[0]))
		{
			throw new Error("Deprecated usage");
		}
		else
		{
			throw new Error("invalid param");
		}
	}
	else
	{
		throw new Error("invalid usage , Buffer must had param");
	}

	Object.defineProperty(this, '__TYPE__',
	{
		enumerable: false,
		writable: false
	});

	Object.defineProperty(this, 'address',
	{
		enumerable: false,
		writable: false
	});

	Object.defineProperty(this, 'length',
	{
		enumerable: false,
		writable: false
	});

	Object.defineProperty(this, 'alreadyFreed',
	{
		enumerable: false
	});

}


Buffer.isBuffer = function(obj)
{
	if (!obj)
	{
		return false;
	}

	if (obj instanceof Buffer)
	{
		return true;
	}

	if (_.isObject(obj))
	{
		if ("Buffer" == obj.__TYPE__)
		{
			return true;
		}
	}

	return false;
}


Buffer.prototype.free = function()
{
	if (0 == this.length)
	{
		throw new Error("try to free zero bytes memory");
	}

	if (this.alreadyFreed)
	{
		throw new Error("double-free");
	}


	var address_text = sprintf( "0x%p" , this.address );

	var bufferNode = process.reserved.tables.bufferTable[address_text];

	if (!bufferNode)
	{
		throw new Error(sprintf("free a buffer %s not alloc by jsrt", address_text));
	}

	process.reserved.bindings.buffer_free(this.address, this.length);

	delete process.reserved.tables.bufferTable[address_text];

	this.alreadyFreed = base.stackTrace();
}

Buffer.alloc = function( length  , arg_noTrack )
{
	var address = null;
	var pNewBuf = null;

	assert(_.isNumber(length), "invalid buffer length");

	if (length <= 0)
	{
		throw new Error("invalid param");
	}

	var helper =  process.reserved.bindings.buffer_alloc(length) ;
	
	if ( !helper )
	{
		return null;
	}
	
	address = Number64(helper);
	
	pNewBuf = new Buffer(length, address);
	
	if ( !arg_noTrack )
	{
		add_to_buffer_table(address, length);
	}


	return pNewBuf;
}

Buffer.allocEx = function( length , arg_noTrack )
{
	var address = null;
	var pNewBuf = null;

	assert(_.isNumber(length), "invalid buffer length");

	if (length <= 0)
	{
		throw new Error("invalid param");
	}

	var helper = Number64(process.reserved.bindings.buffer_allocEx(length));
	
	if ( !helper )
	{
		return null;
	}
	
	address = Number64(helper);
	
	pNewBuf = new Buffer(length, address);
	
	if ( !arg_noTrack )
	{
		add_to_buffer_table(address, length);
	}

	return pNewBuf;
}


Buffer.alloc_auto_free = function( length  )
{
	var address = null;
	var pNewBuf = null;

	assert(_.isNumber(length), "invalid buffer length");

	if (length <= 0)
	{
		throw new Error("invalid param");
	}

	var helper = Number64(process.reserved.bindings.buffer_alloc(length));
	
	if ( !helper )
	{
		return null;
	}
	
	address = Number64(helper);
	
	pNewBuf = new Buffer(length, address);
	
	add_to_buffer_table(address, length , true );

	return pNewBuf;
}


Buffer.attachNative = function(arg_address, arg_length)
{
	assert(arguments.length >= 1, "invalid arguments");

	var param_address = Number64(arg_address);
	var param_length = 0;

	if (2 == arguments.length)
	{
		param_length = arguments[1];
	}

	assert(_.isNumber(param_length), "invalid buffer length");

	var pNewBuf = null;

	pNewBuf = new Buffer(param_length, param_address);

	add_to_buffer_table(param_address, param_length);

	return pNewBuf;
}

Buffer.attachUnsafe = function(arg_address, arg_length)
{
	assert(arguments.length >= 1, "invalid arguments");

	var param_address = Number64(arg_address);
	var param_length = 0;

	if (2 == arguments.length)
	{
		param_length = arguments[1];
	}


	assert(_.isNumber(param_length), "invalid buffer length");

	var pNewBuf = null;

	pNewBuf = new Buffer(param_length, param_address);

	return pNewBuf;
}

Buffer.from = function (arg_string, arg_encoding)
{
	var param_codepage = 0;
	var helper = null;
	var NewBuffer = null;
	var index = 0;

	assert((arguments.length > 0), "arguments must not empty");

	if (_.isString(arguments[0]))
	{
		assert(arguments[0].length != 0);

		if (arguments.length >= 2)
		{

			var param_encoding = '';

			if (_.isString(arguments[1]))
			{
				param_encoding = arguments[1];
			}
			else
			{
				param_encoding = 'ascii';
			}

			if ("hex" == param_encoding)
			{
				// CRYPT_STRING_HEX
				helper = process.reserved.bindings.buffer_fromBinaryString(arguments[0], 4);
				if (!helper)
				{
					throw new Error(sprintf("buffer from string faild"));
				}

				return Buffer.attachNative(helper.address, helper.length);

			}
			else if ("base64" == param_encoding)
			{
				// CRYPT_STRING_BASE64
				helper = process.reserved.bindings.buffer_fromBinaryString(arguments[0], 1);
				if (!helper)
				{
					throw new Error(sprintf("buffer from string faild"));
				}

				return Buffer.attachNative(helper.address, helper.length);
			}
			else
			{
				param_codepage = encoding2codepage(param_encoding);

				if (1200 == param_codepage)
				{
					helper = process.reserved.bindings.buffer_fromWString(arguments[0]);
					if (!helper)
					{
						throw new Error(sprintf("buffer from string faild"));
					}

					return Buffer.attachNative(helper.address, helper.length);
				}
				else
				{
					helper = process.reserved.bindings.buffer_fromString(arguments[0], param_codepage);
					if (!helper)
					{
						throw new Error(sprintf("buffer from string '%s' faild" , arguments[0] ));
					}
					return Buffer.attachNative(helper.address, helper.length);
				}
			}
		}
		else
		{
			helper = process.reserved.bindings.buffer_fromString(arguments[0], 0);
			if (!helper)
			{
				throw new Error(sprintf("buffer from string faild"));
			}

			return Buffer.attachNative(helper.address, helper.length);
		}
	}
	else if (_.isArray(arguments[0]))
	{
		assert(arguments[0].length != 0, "invalid array length");

		NewBuffer = Buffer.alloc(arguments[0].length);
		for (index = 0; index < arguments[0].length; index++)
		{
			assert(_.isNumber(arguments[0][index]));

			NewBuffer.writeUInt8(arguments[0][index], index);
		}

		return NewBuffer;
	}
	else
	{
		throw new Error("invalid usage");
	}
}



Buffer.prototype.isValid = function()
{
	if ((0 == this.length) || (this.address.equal(0)))
	{
		return false;
	}

	if (this.alreadyFreed)
	{
		return false;
	}

	return true;
}

Buffer.prototype.isFreed = function()
{
	if (this.alreadyFreed)
	{
		return true;
	}

	return false;
}

Buffer.prototype.compare = function(arg_target, arg_targetStart, arg_targetEnd, arg_sourceStart, arg_sourceEnd)
{
	var param_targetStart = 0;
	var param_targetEnd = 0;
	var param_sourceStart = 0;
	var param_sourceEnd = 0;

	var param_targetSize = 0;
	var param_sourceSize = 0;
	var param_compareSize = 0;

	var compareRet = 0;

	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(arguments.length >= 1, "invalid arguments");

	assert(Buffer.isBuffer(arg_target), "target must be buffer");

	if (arguments.length >= 2)
	{
		param_targetStart = arguments[1];
	}

	if (arguments.length >= 3)
	{
		param_targetEnd = arguments[2];
	}
	else
	{
		param_targetEnd = arg_target.length;
	}

	if (arguments.length >= 4)
	{
		param_sourceStart = arguments[3];
	}

	if (arguments.length >= 5)
	{
		param_sourceEnd = arguments[4];
	}
	else
	{
		param_sourceEnd = this.length;
	}


	assert(_.isNumber(param_targetStart), "invalid target start");
	assert(_.isNumber(param_targetEnd), "invalid target end");
	assert(_.isNumber(param_sourceStart), "invalid source start");
	assert(_.isNumber(param_sourceEnd), "invalid source end");

	assert((param_targetStart >= 0) && (param_targetStart <= arg_target.length));

	assert((param_targetEnd >= 0) && (param_targetEnd <= arg_target.length));

	assert((param_sourceStart >= 0) && (param_sourceStart <= this.length));

	assert((param_sourceEnd >= 0) && (param_sourceEnd <= this.length));

	assert((param_targetStart <= param_targetEnd));

	assert((param_sourceStart <= param_sourceEnd));

	param_targetSize = param_targetEnd - param_targetStart;

	param_sourceSize = param_sourceEnd - param_sourceStart;

	param_compareSize = Math.min(param_targetSize, param_sourceSize);

	compareRet = process.reserved.bindings.buffer_compare(this.address, arg_target.address, param_compareSize);

	if (0 == compareRet)
	{
		if (param_sourceSize < param_targetSize)
		{
			compareRet = -1;
		}
		else if (param_sourceSize > param_targetSize)
		{
			compareRet = 1;
		}
		else
		{
			// nop
		}
	}
	else
	{
		// nop
	}


	return compareRet;
}

Buffer.prototype.copy = function(arg_target, arg_targetStart, arg_sourceStart, arg_sourceEnd)
{

	var param_targetStart = 0;
	var param_sourceStart = 0;
	var param_sourceEnd = this.length;

	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(Buffer.isBuffer(arguments[0]), "target must be a buffer");

	if (arguments.length >= 2)
	{
		assert(_.isNumber(arguments[1]), "target start must be number");

		param_targetStart = arguments[1];
	}

	if (arguments.length >= 3)
	{
		assert(_.isNumber(arguments[2]), "source start must be number");

		param_sourceStart = arguments[2];
	}

	if (arguments.length >= 4)
	{
		assert(_.isNumber(arguments[3]), "source end must be number");

		param_sourceEnd = arguments[3];
	}

	assert(((param_targetStart >= 0) && (param_targetStart <= arg_target.length)), "invalid target start");

	assert(((param_sourceStart >= 0) && (param_sourceStart <= this.length)), "invalid source start");

	assert(((param_sourceEnd >= param_sourceStart) && (param_sourceEnd <= this.length)), "invalid source end");

	process.reserved.bindings.buffer_copy(arg_target.address, this.address, param_targetStart, param_sourceStart, param_sourceEnd);

	return this;
}

Buffer.prototype.equal = function(arg_target)
{
	var compareRet = 0;

	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(Bufer.isBuffer(arg_target));

	if ((this.length != arg_target.length))
	{
		return false;
	}

	compareRet = this.compare(arg_target, 0, arg_target.length, 0, this.length);

	if (0 == compareRet)
	{
		return true;
	}

	return false;
}


Buffer.prototype.fill = function(arg_value, arg_offset, arg_end)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	var param_value = 0;
	var param_offset = 0;
	var param_end = this.length;

	var index = 0;

	if (0 == arguments.length)
	{
		throw new Error("invalid usage");
	}

	if (arguments.length >= 1)
	{
		if (_.isNumber(arguments[0]))
		{
			param_value = arguments[0];
		}
		else if (_.isString(arguments[0]))
		{
			assert(arguments[0].length == 1);

			param_value = arguments[0].charCodeAt(0);
		}
	}

	if (arguments.length >= 2)
	{
		assert(_.isNumber(arguments[1]), "offset must be number");

		param_offset = arguments[1];
	}

	if (arguments.length >= 3)
	{
		assert(_.isNumber(arguments[2]), "end must be number");

		param_end = arguments[2];
	}

	assert(((param_offset >= 0) && (param_offset <= this.length)), "invalid offset");
	assert(((param_end >= param_offset) && (param_end <= this.length)), "invalid end");

	process.reserved.bindings.buffer_fill(this.address, param_offset, param_end, param_value);

	return this;
}

Buffer.prototype.readDoubleBE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isUndefined(offset) || _.isNumber(offset));

	return process.reserved.bindings.buffer_readDoubleBE(this.address, offset || 0);
}

Buffer.readDoubleBE = function(arg_address, offset)
{
	var address = null;
	
	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) );

	return process.reserved.bindings.buffer_readDoubleBE(address, offset || 0);
}

Buffer.prototype.readDoubleLE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) );
	
	return process.reserved.bindings.buffer_readDoubleLE(this.address, offset || 0);
}

Buffer.readDoubleLE = function(arg_address, offset)
{
	var address = null;
	
	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) );
	
	return process.reserved.bindings.buffer_readDoubleLE(address, offset || 0);
}

Buffer.prototype.readFloatBE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );
	
	return process.reserved.bindings.buffer_readFloatBE(this.address, offset || 0);
}

Buffer.readFloatBE = function(arg_address, offset)
{
	var address = null; 
	
	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );
	
	return process.reserved.bindings.buffer_readFloatBE(address, offset || 0);
}

Buffer.prototype.readFloatLE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readFloatLE(this.address, offset || 0);
}

Buffer.readFloatLE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readFloatLE(address, offset || 0);
}

Buffer.prototype.readInt8 = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}


	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readInt8(this.address, offset || 0);
}

Buffer.readInt8 = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isUndefined(offset) || _.isNumber(offset));

	return process.reserved.bindings.buffer_readInt8(address, offset || 0);
}

Buffer.prototype.readInt8Array = function(offset, count)
{
	return Buffer.readInt8Array(this.address, offset, count);
}

Buffer.readInt8Array = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readInt8( address, param_offset.add(  1 ) ) );
	}

	return valueArray;
}

Buffer.prototype.readUInt8 = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readUInt8(this.address, offset || 0);
}

Buffer.readUInt8 = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readUInt8(address, offset || 0);
}

Buffer.prototype.readUInt8Array = function(offset, count)
{	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Buffer.readUInt8Array(this.address, offset, count);
}

Buffer.readUInt8Array = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUInt8(address, param_offset.add( 1 )  )  );
	}

	return valueArray;
}


Buffer.prototype.readInt16BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readInt16BE(this.address, offset || 0);
}

Buffer.readInt16BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readInt16BE(address, offset || 0);
}

Buffer.prototype.readInt16BEArray = function(offset, count)
{
	return Buffer.readInt16BEArray(this.address, offset, count);
}

Buffer.readInt16BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readInt16BE(address, param_offset.add( 2  ) ));
	}

	return valueArray;
}


Buffer.prototype.readInt16LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readInt16LE(this.address, offset || 0);
}

Buffer.readInt16LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readInt16LE(address, offset || 0);
}

Buffer.prototype.readInt16LEArray = function(offset, count)
{
	return Buffer.readInt16LEArray(this.address, offset, count);
}

Buffer.readInt16LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readInt16LE(address, param_offset.add( 2  ) ));
	}

	return valueArray;
}


Buffer.prototype.readUInt16BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readUInt16BE(this.address, offset || 0);
}

Buffer.readUInt16BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_readUInt16BE(address, offset || 0);
}

Buffer.prototype.readUInt16BEArray = function(offset, count)
{
	return Buffer.readUInt16BEArray(this.address, offset, count);
}

Buffer.readUInt16BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );
	
	
	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUInt16BE(address, param_offset.add( 2  ) ));
	}

	return valueArray;
}


Buffer.prototype.readUInt16LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) );

	return process.reserved.bindings.buffer_readUInt16LE(this.address, offset || 0);
}

Buffer.readUInt16LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) );

	return process.reserved.bindings.buffer_readUInt16LE(address, offset || 0);
}


Buffer.prototype.readUInt16LEArray = function(offset, count)
{
	return Buffer.readUInt16LEArray(this.address, offset, count);
}

Buffer.readUInt16LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUInt16LE(address, param_offset.add( 2  ) ));
	}

	return valueArray;
}



Buffer.prototype.readInt32BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32BE(this.address, offset || 0) ).toJSNumber();
}

Buffer.readInt32BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32BE(address, offset || 0) ).toJSNumber();
}

Buffer.prototype.readInt32BEArray = function(offset, count)
{
	return Buffer.readInt32BEArray(this.address, offset, count);
}

Buffer.readInt32BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readInt32BE(address, param_offset.add(  4  ) ) );
	}

	return valueArray;
}

Buffer.prototype.readInt32LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32LE(this.address, offset || 0) ).toJSNumber();
}

Buffer.readInt32LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32LE(address, offset || 0) ).toJSNumber();
}

Buffer.prototype.readInt32LEArray = function(offset, count)
{
	return Buffer.readInt32LEArray(this.address, offset, count);
}

Buffer.readInt32LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readInt32LE(address, param_offset.add(  4  ) ) );
	}

	return valueArray;
}


Buffer.prototype.readUInt32BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32BE(this.address, offset || 0) ).toJSNumber();
}

Buffer.readUInt32BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32BE(address, offset || 0) ).toJSNumber();
}



Buffer.prototype.readUInt32BEArray = function(offset, count)
{
	return Buffer.readUInt32BEArray(this.address, offset, count);
}

Buffer.readUInt32BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readUInt32BE(address, param_offset.add(  4  ) ) );
	}

	return valueArray;
}


Buffer.prototype.readUInt32LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32LE(this.address, offset || 0) ).toJSNumber();
}

Buffer.readUInt32LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32LE(address, offset || 0) ).toJSNumber();
}

Buffer.prototype.readUInt32LEArray = function(offset, count)
{
	return Buffer.readUInt32LEArray(this.address, offset, count);
}

Buffer.readUInt32LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readUInt32LE(address , param_offset.add(  4  ) ) );
	}

	return valueArray;
}




Buffer.prototype.readNumber32BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32BE(this.address, offset || 0) );
}

Buffer.readNumber32BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32BE(address, offset || 0) );
}



Buffer.prototype.readNumber32BEArray = function(offset, count)
{
	return Buffer.readNumber32BEArray(this.address, offset, count);
}

Buffer.readNumber32BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readNumber32BE(address , param_offset.add(  4  ) ));
	}

	return valueArray;
}

Buffer.prototype.readNumber32LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32LE(this.address, offset || 0) );
}

Buffer.readNumber32LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readInt32LE(address, offset || 0) );
}


Buffer.prototype.readNumber32LEArray = function(offset, count)
{
	return Buffer.readNumber32LEArray(this.address, offset, count);
}

Buffer.readNumber32LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readNumber32LE(address , param_offset.add(  4  ) ));
	}

	return valueArray;
}


Buffer.prototype.readUNumber32BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32BE(this.address, offset || 0) );
}

Buffer.readUNumber32BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32BE(address, offset || 0) );
}

Buffer.prototype.readUNumber32BEArray = function(offset, count)
{
	return Buffer.readUNumber32BEArray(this.address, offset, count);
}

Buffer.readUNumber32BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );
	
	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUNumber32BE(address , param_offset.add(  4  ) ));
	}

	return valueArray;
}

Buffer.prototype.readUNumber32LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32LE(this.address, offset || 0) );
}

Buffer.readUNumber32LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number32( process.reserved.bindings.buffer_readUInt32LE(address, offset || 0) );
}


Buffer.prototype.readUNumber32LEArray = function(offset, count)
{
	return Buffer.readUNumber32LEArray(this.address, offset, count);
}

Buffer.readUNumber32LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );
	
	for (index = 0; index < arg_count; index++)
	{
		valueArray.push( Buffer.readUNumber32LE(address, param_offset.add(  4  ) ) );
	}

	return valueArray;
}





Buffer.prototype.readInt64BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readInt64BE(this.address, offset || 0));
}

Buffer.readInt64BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readInt64BE(address, offset || 0));
}

Buffer.prototype.readInt64BEArray = function(offset, count)
{
	return Buffer.readInt64BEArray(this.address, offset, count);
}

Buffer.readInt64BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readInt64BE(address , param_offset.add(  8  ) ) );
	}

	return valueArray;
}

Buffer.prototype.readInt64LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );
	
	return Number64(process.reserved.bindings.buffer_readInt64LE(this.address, offset || 0));
}

Buffer.readInt64LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );
	
	return Number64(process.reserved.bindings.buffer_readInt64LE(address, offset || 0));
}

Buffer.prototype.readInt64LEArray = function(offset, count)
{
	return Buffer.readInt64LEArray(this.address, offset, count);
}

Buffer.readInt64LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];
	
	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readInt64LE(address , param_offset.add(  8  ) ));
	}

	return valueArray;
}

Buffer.prototype.readUInt64BE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readUInt64BE(this.address, offset || 0));
}

Buffer.readUInt64BE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readUInt64BE(address, offset || 0));
}

Buffer.prototype.readUInt64BEArray = function(offset, count)
{
	return Buffer.readUInt64BEArray(this.address, offset, count);
}

Buffer.readUInt64BEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUInt64BE(address , param_offset.add(  8  ) ));
	}

	return valueArray;
}

Buffer.prototype.readUInt64LE = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readUInt64LE(this.address, offset || 0));
}

Buffer.readUInt64LE = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return Number64(process.reserved.bindings.buffer_readUInt64LE(address, offset || 0));
}

Buffer.prototype.readUInt64LEArray = function(offset, count)
{
	return Buffer.readUInt64LEArray(this.address, offset, count);
}

Buffer.readUInt64LEArray = function(arg_address, arg_offset, arg_count)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( _.isUndefined(arg_offset) || _.isNumber(arg_offset) || Number64.isNumber64(arg_offset) , "invalid offset" );
	
	assert(_.isNumber(arg_count));

	var index = 0;
	var valueArray = [];

	var param_offset = Number64( arg_offset );

	for (index = 0; index < arg_count; index++)
	{
		valueArray.push(Buffer.readUInt64LE(address , param_offset.add(  8  ) ));
	}

	return valueArray;
}


Buffer.prototype.slice = function(arg_start, arg_end)
{

	var param_start = 0;
	var param_end = this.length;

	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	if (arguments.length >= 1)
	{
		assert(_.isNumber(arguments[0]), "invalid slice  start");
		param_start = arguments[0];
	}

	if (arguments.length >= 2)
	{
		assert(_.isNumber(arguments[1]), "invalid slice length");
		param_end = arguments[1];
	}

	assert(param_start >= 0);
	assert(param_end <= this.length, "");
	assert(param_end >= param_start);

	if (param_end == param_start)
	{
		return Buffer.alloc(0);
	}
	else
	{
		var NewBuffer = Buffer.alloc(param_end - param_start);

		this.copy(NewBuffer, 0, param_start, param_end);

		return NewBuffer;
	}

}

Buffer.prototype.toString = function(arg_encoding, arg_start, arg_end)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	var argv = Array.prototype.slice.call(arguments);

	argv.unshift(this.address);

	return Buffer.toString.apply(this, argv);
}


Buffer.toString = function(arg_address, arg_encoding, arg_start, arg_end)
{
	
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	
	var encoding = 'ascii';

	var param_codepage = 0;
	var param_start = 0;
	var param_end = -1;

	var helperText = '';

	if (arguments.length >= 2)
	{
		if (_.isString(arguments[1]))
		{
			encoding = arguments[1].trim().toLowerCase();

			if (("hex" != encoding) && ("dump" != encoding) && ("base64" != encoding))
			{
				param_codepage = encoding2codepage(arguments[1]);
			}
		}
		else if (_.isNumber(arguments[1]))
		{
			param_codepage = arguments[1];
		}
	}

	if (arguments.length >= 3)
	{
		assert(_.isNumber(arguments[2]), "start must be number");
		param_start = arguments[2];
	}

	if (arguments.length >= 4)
	{
		assert(_.isNumber(arguments[3]), "end must be number");
		param_end = arguments[3];

		if (param_end > 0)
		{
			assert(param_end >= param_start);

			if (param_end == param_start)
			{
				return "";
			}
		}

	}

	assert(param_start >= 0);


	if ("dump" == encoding)
	{
		// CRYPT_STRING_HEXASCIIADDR
		return process.reserved.bindings.buffer_toBinaryString(address, 0x0000000b, param_start, param_end);
	}
	else if ("hex" == encoding)
	{
		// CRYPT_STRING_HEX
		var helper = process.reserved.bindings.buffer_toBinaryString(address, 4, param_start, param_end);


		var tempArray = helper.split("\r\n");

		tempArray = _.filter(tempArray, function(item)
		{
			return (item.length != 0)
		});

		helper = tempArray.join(" ");

		tempArray = helper.split(" ");
		tempArray = _.filter(tempArray, function(item)
		{
			return (item.length != 0)
		});

		helper = tempArray.join("");

		return helper;
	}
	else if ("base64" == encoding)
	{
		// CRYPT_STRING_BASE64
		helperText = process.reserved.bindings.buffer_toBinaryString(address, 1, param_start, param_end);
	}
	else
	{
		// specail for unicode
		if (1200 == param_codepage)
		{
			helperText = process.reserved.bindings.buffer_toWString(address, param_start, param_end);
		}
		else
		{
			helperText = process.reserved.bindings.buffer_toString(address, param_codepage, param_start, param_end);
		}
	}

	if (!helperText)
	{
		return "";
	}

	return helperText;
}

Buffer.prototype.toArray = function(arg_start, arg_end)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	var param_start = 0;
	var param_end = this.length;

	if (arguments.length >= 1)
	{
		assert(_.isNumber(arguments[0]), "start must be number");
		param_start = arguments[0];
	}

	if (arguments.length >= 2)
	{
		assert(_.isNumber(arguments[1]), "end must be number");
		param_end = arguments[1];
	}

	assert(param_start >= 0);
	assert(param_end >= param_start, "end offset must large then start");

	assert(param_end <= this.length);

	if (param_end == param_start)
	{
		return [];
	}

	var helper = [];
	var index = 0;

	for (index = param_start; index < param_end; index++)
	{
		helper.push(this.readUInt8(index));
	}

	return helper;
}

// buf.write(string[, offset[, length]][, encoding])
Buffer.prototype.write = function(arg_string, arg_offset, arg_length, arg_encoding)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isString(arg_string), "invalid arg_string");
	assert((arg_string.length != 0), "invalid arg_string");

	var param_lpStringBuffer = null;
	var param_offset = 0;
	var param_bytes = 0; //  How many bytes to write. Default: buf.length - offset

	if (1 == arguments.length)
	{
		param_lpStringBuffer = Buffer.from(arg_string, 'ascii');

		assert((param_lpStringBuffer.length <= this.length), "buffer is too small");

		param_bytes = Math.min(param_lpStringBuffer.length, this.length);
	}
	else if (2 == arguments.length)
	{
		param_lpStringBuffer = Buffer.from(arg_string, arguments[1]);

		assert((param_lpStringBuffer.length <= this.length), "buffer is too small");

		param_bytes = Math.min(param_lpStringBuffer.length, this.length);
	}
	else if (3 == arguments.length)
	{
		param_lpStringBuffer = Buffer.from(arg_string, arguments[2]);

		param_offset = arguments[1];

		assert(_.isNumber(param_offset), "invalid offset");
		assert((param_offset <= this.length), "invalid offset");

		assert((param_lpStringBuffer.length <= (this.length - param_offset)), "buffer is too small");

		param_bytes = Math.min(param_lpStringBuffer.length, (this.length - param_offset));
	}
	else if (4 == arguments.length)
	{
		param_lpStringBuffer = Buffer.from(arg_string, arguments[3]);

		param_offset = arguments[1];

		assert(_.isNumber(param_offset), "invalid offset");
		assert((param_offset <= this.length), "invalid offset");

		assert((param_lpStringBuffer.length <= (this.length - param_offset)), "buffer is too small");

		param_bytes = Math.min(param_lpStringBuffer.length, (this.length - param_offset), arguments[2]);
	}

	// arg_target_address ,  arg_source_address , arg_target_start , arg_source_start , arg_source_end
	process.reserved.bindings.buffer_copy(this.address, param_lpStringBuffer.address, param_offset, 0, param_bytes);

	param_lpStringBuffer.free();
	param_lpStringBuffer = null;

	return param_bytes;
}

Buffer.prototype.writeDoubleBE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeDoubleBE(this.address, offset || 0, value);
	return this;
}

Buffer.writeDoubleBE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	assert((_.isUndefined(offset) || _.isNumber(offset)), "invalid offset");

	return process.reserved.bindings.buffer_writeDoubleBE(address, offset || 0, value);
}

Buffer.prototype.writeDoubleLE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeDoubleLE(this.address, offset || 0, value);
	return this;
}

Buffer.writeDoubleLE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeDoubleLE(address, offset || 0, value);
}

Buffer.prototype.writeFloatBE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeFloatBE(this.address, offset || 0, value);
	return this;
}

Buffer.writeFloatBE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeFloatBE(address, offset || 0, value);
}

Buffer.prototype.writeFloatLE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeFloatLE(this.address, offset || 0, value);
	return this;
}

Buffer.writeFloatLE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeFloatLE(address, offset || 0, value);
}

Buffer.prototype.writeInt8 = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt8(this.address, offset || 0, value);
	return this;
}

Buffer.writeInt8 = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt8(address, offset || 0, value);
}

Buffer.prototype.writeUInt8 = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt8(this.address, offset || 0, value);
	return this;
}

Buffer.writeUInt8 = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt8(address, offset || 0, value);
}


Buffer.prototype.writeInt16BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt16BE(this.address, offset || 0, value);
	return this;
}

Buffer.writeInt16BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt16BE(address, offset || 0, value);
}

Buffer.prototype.writeInt16LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt16LE(this.address, offset || 0, value);
	return this;
}

Buffer.writeInt16LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt16LE(address, offset || 0, value);
}

Buffer.prototype.writeUInt16BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt16BE(this.address, offset || 0, value);
	return this;
}

Buffer.writeUInt16BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt16BE(address, offset || 0, value);
}

Buffer.prototype.writeUInt16LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt16LE(this.address, offset || 0, value);
	return this;
}

Buffer.writeUInt16LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert(_.isNumber(value), "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );
	
	return process.reserved.bindings.buffer_writeUInt16LE(address, offset || 0, value);
}

Buffer.prototype.writeInt32BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt32BE(this.address, offset || 0, Number32(value));
	return this;
}

Buffer.writeInt32BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt32BE(address, offset || 0, Number32(value));
}


Buffer.prototype.writeInt32LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt32LE(this.address, offset || 0, Number32(value));
	return this;
}

Buffer.writeInt32LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt32LE(address, offset || 0, Number32(value));
}

Buffer.prototype.writeUInt32BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt32BE(this.address, offset || 0, Number32(value));
	return this;
}

Buffer.writeUInt32BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt32BE(address, offset || 0, Number32(value));
}


Buffer.prototype.writeUInt32LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt32LE(this.address, offset || 0, Number32(value));
	return this;
}

Buffer.writeUInt32LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isNumber(value) || Number32.isNumber32(value) || Number64.isNumber64(value)  ) , "value must be number");
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt32LE(address, offset || 0, Number32(value));
}

Buffer.prototype.writeInt64BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt64BE(this.address, offset || 0, Number64(value));

	return this;
}

Buffer.writeInt64BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt64BE(address, offset || 0, Number64(value));
}

Buffer.prototype.writeInt64LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeInt64LE(this.address, offset || 0, Number64(value));

	return this;
}

Buffer.writeInt64LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeInt64LE(address, offset || 0, Number64(value));
}

Buffer.prototype.writeUInt64BE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt64BE(this.address, offset || 0, Number64(value));

	return this;
}

Buffer.writeUInt64BE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt64BE(address, offset || 0, Number64(value));
}

Buffer.prototype.writeUInt64LE = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	process.reserved.bindings.buffer_writeUInt64LE(this.address, offset || 0, Number64(value));

	return this;
}

Buffer.writeUInt64LE = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	return process.reserved.bindings.buffer_writeUInt64LE(address, offset || 0, Number64(value));
}

//--------------------------------------
// extend

Buffer.prototype.readStringFromANSI_STRING = function(arg_offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	var offset = Number64(arg_offset);

	var field_length = 0;
	var field_buffer = 0;

	field_length = this.readUInt16LE(offset);

	if ('x64' == process.arch)
	{
		field_buffer = this.readUInt64LE(offset.add(8));
	}
	else
	{
		field_buffer = this.readUInt32LE(offset.add(4));
	}

	if (0 == field_length)
	{
		return "";
	}

	return process.reserved.bindings.buffer_toString(field_buffer, 0, 0, field_length);
}


Buffer.prototype.readStringFromUNICODE_STRING = function(arg_offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	var offset = Number64(arg_offset);

	var field_length = 0;
	var field_buffer = 0;

	field_length = this.readUInt16LE(offset);

	if ('x64' == process.arch)
	{
		field_buffer = this.readUInt64LE(offset.add(8));
	}
	else
	{
		field_buffer = this.readUInt32LE(offset.add(4));
	}

	if (0 == field_length)
	{
		return "";
	}

	return process.reserved.bindings.buffer_toWString(field_buffer, 0, field_length);
}



//------------------------------------
module.exports = Buffer;


process.reserved.dumpBufferLeaks = function dumpBufferLeaks()
{
	var address_text = '';
	var mem_node = null;

	for (address_text in process.reserved.tables.bufferTable)
	{
		mem_node = process.reserved.tables.bufferTable[address_text];
		
		if ( mem_node.auto_free )
		{
			delete process.reserved.tables.bufferTable[mem_node.address];
			
			process.reserved.bindings.buffer_free( Number64( mem_node.address ) , mem_node.length );
		}
		else
		{
			printf("[mem-leak] leak %d bytes , stack : %s\n",
				mem_node.length, mem_node.stack
			);
		}

	}
}

Buffer.prototype.writeULONG_PTR = function( arg_value , offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}
	
	var value = null;
	
	if ( Buffer.isBuffer(arg_value) )
	{
		value = arg_value.address;
	}
	else
	{
		if ( !arg_value )
		{
			value = Number64(0);
		}
		else if ( 'function' == typeof arg_value )
		{
			value = arg_value.__ADDRESS__;
		}
		else
		{
			assert(    ( _.isNumber(arg_value) || Number64.isNumber64(arg_value) || Number32.isNumber32(arg_value) ) , sprintf('[Buffer.prototype.writeULONG_PTR]type is %s' , typeof arg_value) );
			
			value = arg_value;	
		}
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		process.reserved.bindings.buffer_writeUInt64LE(this.address, offset || 0, value );
	}
	else
	{
		process.reserved.bindings.buffer_writeUInt32LE(this.address, offset || 0, value );
	}

	return this;
}
Buffer.prototype.writePointer = Buffer.prototype.writeULONG_PTR;

Buffer.writeULONG_PTR = function(arg_address, arg_value, offset)
{
	var address = null;
	
	var value = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	if (Buffer.isBuffer(arg_value))
	{
		value = arg_value.address;
	}
	else
	{
		if ( !arg_value )
		{
			value = Number64(0);
		}
		else if ( 'function' == typeof arg_value )
		{
			value = arg_value.__ADDRESS__;
		}
		else
		{
			assert( ( _.isNumber(arg_value) || Number64.isNumber64(arg_value) || Number32.isNumber32(arg_value)  ) , sprintf('[Buffer.writeULONG_PTR ]type is %s' , typeof arg_value) );
			value = arg_value;	
		}
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		process.reserved.bindings.buffer_writeUInt64LE(address, offset || 0, value );
	}
	else
	{
		process.reserved.bindings.buffer_writeUInt32LE(address, offset || 0, value );
	}
}
Buffer.writePointer = Buffer.writeULONG_PTR;

Buffer.prototype.readULONG_PTR = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		return Number64(process.reserved.bindings.buffer_readUInt64LE(this.address, offset || 0));
	}
	else
	{
		return Number32(process.reserved.bindings.buffer_readUInt32LE(this.address, offset || 0));
	}
}
Buffer.prototype.readPointer = Buffer.prototype.readULONG_PTR;


Buffer.readPointer = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		return Number64(process.reserved.bindings.buffer_readUInt64LE(address, offset || 0));
	}
	else
	{
		return Number32(process.reserved.bindings.buffer_readUInt32LE(address, offset || 0));
	}
}


// as wow64 , will read 8bytes
// as x64 will read 8 bytes
// as ia32 will read 4 bytes
Buffer.prototype.readNativePointer = function(offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		return Number64(process.reserved.bindings.buffer_readUInt64LE(this.address, offset || 0));
	}
	else
	{
		if (process.wow64)
		{
			return Number64(process.reserved.bindings.buffer_readUInt64LE(this.address, offset || 0));
		}
		else
		{
			return Number32(process.reserved.bindings.buffer_readUInt32LE(this.address, offset || 0));
		}

	}
}

Buffer.readNativePointer = function(arg_address, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		return Number64(process.reserved.bindings.buffer_readUInt64LE(address, offset || 0));
	}
	else
	{
		if (process.wow64)
		{
			return Number64(process.reserved.bindings.buffer_readUInt64LE(address, offset || 0));
		}
		else
		{
			return Number32(process.reserved.bindings.buffer_readUInt32LE(address, offset || 0));
		}
	}
}

Buffer.prototype.writeNativePointer = function(value, offset)
{
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}

	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		process.reserved.bindings.buffer_writeUInt64LE(this.address, offset || 0, Number64(value));
	}
	else
	{
		if (process.wow64)
		{
			process.reserved.bindings.buffer_writeUInt64LE(this.address, offset || 0, Number32(value));
		}
		else
		{
			process.reserved.bindings.buffer_writeUInt32LE(this.address, offset || 0, Number32(value));
		}
	}

	return this;
}


Buffer.writeNativePointer = function(arg_address, value, offset)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}
	
	
	assert( ( _.isUndefined(offset) || _.isNumber(offset) || Number64.isNumber64(offset) || Number32.isNumber32(offset) ) , "invalid offset" );

	if ('x64' == process.arch)
	{
		process.reserved.bindings.buffer_writeUInt64LE(address, offset || 0, Number64(value));
	}
	else
	{
		if (process.wow64)
		{
			process.reserved.bindings.buffer_writeUInt64LE(address, offset || 0, Number32(value));
		}
		else
		{
			process.reserved.bindings.buffer_writeUInt32LE(address, offset || 0, Number32(value));
		}
	}
}


// 


//------------------------------------

Buffer.dump = function(arg_address, length)
{
	var address = null;

	if (Buffer.isBuffer(arg_address))
	{
		address = arg_address.address;
	}
	else
	{
		assert(Number64.isNumber64(arg_address));
		address = arg_address;
	}

	var alignLength = base.ALIGN_UP_BY(length, 16);
	var offset = 0;
	var offsetText = '';
	var lineText = '';

	var valueChar = '';
	var charCode = 0;

	var hexCharCode = '';

	var sideBar = '';

	printf("dump of 0x%p - 0x%p with 0x%x bytes\n", address, Number64.add(address, length), length);

	for (offset = 0; offset < alignLength; offset++)
	{
		if (0 == (offset % 16))
		{
			offsetText = sprintf("0x%05X\t0x%p\t", offset , Number64.add(address, offset) );

			lineText += offsetText;
		}

		if (offset >= length)
		{
			lineText += '   ';
			valueChar = ' ';
		}
		else
		{
			try
			{
				charCode = Buffer.readUInt8(address, offset);

				hexCharCode = sprintf("%02x ", charCode);

				lineText += hexCharCode;

				valueChar = ((charCode >= 32 && charCode < 127) ? String.fromCharCode(charCode) : '.');
			}
			catch (err)
			{
				lineText += '?? ';
				valueChar = '?'
			}
		}

		sideBar += valueChar;

		if (0 == ((offset + 1) % 16))
		{
			lineText += '\t' + sideBar + '\n';
			sideBar = '';

			printf(lineText);
			lineText = '';
		}
	}

	return 0;
}

Buffer.prototype.dump = function( length )
{
	var arg_length = 0;
	
	if (!this.isValid())
	{
		throw new Error("try to operate with invalid buffer");
	}
	
	if ( arguments.length < 1 )
	{
		arg_length = this.length;
	}
	else
	{
		assert( _.isNumber(length)  , "length must be number" );
		
		arg_length = length;
	}


	return Buffer.dump( this.address  , arg_length );
}



function main()
{

	return 0;
}

if (!module.parent)
{
	main();
}
