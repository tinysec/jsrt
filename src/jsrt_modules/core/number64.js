'use strict';


function cast2Number64(arg_1) 
{
    if ('object' == typeof arg_1) 
	{
        if (arg_1) 
		{
            if (arg_1 instanceof Number64) 
			{
                return arg_1;
            }
        }
    }

    return Number64.apply(this, arguments);
}

function Number64(arg_1, arg_2)
{
    if (!(this instanceof Number64)) 
	{
        return new Number64(arg_1, arg_2);
    }

    this.__TYPE__ = "Number64";
    this.hexText = "0x0000000000000000";

    if (0 == arguments.length) 
	{

    }
    else 
	{
        if (
            (NaN === arguments[0])
            || (Infinity === arguments[0])
            || (undefined === arguments[0])
            || (null === arguments[0])
            || (false === arguments[0])
        ) {
            //nop
        }
        else if ('number' == typeof arguments[0]) 
		{
            this.hexText = process.reserved.bindings.Number64_toString(arguments[0], 16);
        }
        else if ('boolean' == typeof arguments[0]) 
		{
            if (arguments[0]) 
			{
                this.hexText = "0x0000000000000001";
            }
            else 
			{
                //nop
            }
        }
        else if ('string' == typeof arguments[0]) 
		{
            var input_text = arguments[0].toLowerCase().trim();
            var nRadix = 10;

            if (0 == input_text.length) 
			{
                throw new Error("invalid param");
            }

            if ('h' == input_text.charAt(input_text.length - 1)) 
			{
                nRadix = 16;

                input_text = input_text.substring(0, input_text.length - 1);
            }

            if (0 == input_text.indexOf('0x')) 
			{
                nRadix = 16;
            }
            else 
			{
                nRadix = 10;
            }

            if (16 == nRadix) 
			{
                if (0 != input_text.indexOf('0x')) 
				{
                    input_text = '0x' + input_text;
                }
            }

            this.hexText = process.reserved.bindings.Number64_fromString(input_text, nRadix);
        }
        else if ('object' == typeof arguments[0]) 
		{
            if ( Number64.isNumber64( arguments[0] ) ) 
			{
                this.hexText = arguments[0].hexText;
            }
            else 
			{
                throw new Error("invalid param");
            }
        }
        else 
		{
            throw new Error("invalid param");
        }
    }

    Object.defineProperty(
        this,
        "HighPart",
        {
            get: function () {
                var HighPartText = "0x" + this.hexText.substring(0, 10);
                return parseInt(HighPartText)
            }
        }
    );

    Object.defineProperty(
        this,
        "LowPart",
        {
            get: function () {
                var LowPartText = "0x" + this.hexText.substring(10, 18);
                return parseInt(LowPartText);
            }
        }
    );
}


Number64.isNumber64 = function (obj)
 {
    if (!obj) 
	{
        return false;
    }

    if ( "object" == typeof obj ) 
	{
        if ("Number64" == obj.__TYPE__) 
		{
            return true;
        }
    }

    return false;
}

Number64.prototype.toString = function (arg_radix) 
{
    var radix = arg_radix || 10;

    if (16 == radix) 
	{
        return this.hexText.substring(2);
    }
    else 
	{
        return process.reserved.bindings.Number64_toString(this.hexText, 10);
    }
}

Number64.prototype.toShortString = function (arg_radix) 
{
    var radix = arg_radix || 10;

    if (16 == radix) 
	{
		return process.reserved.bindings.Number64_toShortString(this.hexText, 16);
    }
    else 
	{
        return process.reserved.bindings.Number64_toShortString(this.hexText, 10);
    }
}

Number64.prototype.toJSNumber = function () 
{
    return process.reserved.bindings.Number64_toJSNumber(this.hexText);
}

Number64.prototype.toNumber = function () 
{
    return process.reserved.bindings.Number64_toJSNumber(this.hexText);
}

Number64.prototype.isZero = function () 
{
    return (0 == this.compare(0));
}

Number64.isZero = function ( item ) 
{
    return Number64(item).isZero();
}

Number64.prototype.isZero32 = function () 
{
    return (0 == this.compare32(0));
}

Number64.isZero32 = function ( item ) 
{
    return Number64(item).isZero32();
}

Number64.prototype.isNegative = function () 
{
    return (0 > this.compareSigned(0));
}

Number64.prototype.isNegative32 = function () 
{
    return (0 > this.compareSigned32(0));
}

Number64.prototype.isZeroOrNegative = function () 
{
    return (0 >= this.compareSigned(0));
}

Number64.prototype.isZeroOrNegative32 = function () 
{
    return (0 >= this.compareSigned32(0));
}

Number64.prototype.equals = function (arg_other) 
{
    return (0 == this.compare(arg_other));
}

Number64.prototype.equals32 = function (arg_other) 
{
    return (0 == this.compare32(arg_other));
}

Number64.equals32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 == Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.notEquals = function (arg_other) 
{
    return (0 != this.compare(arg_other));
}

Number64.notEquals = function ( arg_1 , arg_2 ) 
{
   return ( 0 != Number64.compare(arg_1 , arg_2 ) );
}

Number64.prototype.notEquals32 = function (arg_other) 
{
    return (0 != this.compare32(arg_other));
}

Number64.notEquals32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 != Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.lessThan = function (arg_other) 
{
    return (0 > this.compare(arg_other));
}

Number64.lessThan = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number64.compare(arg_1 , arg_2 ) );
}

Number64.prototype.lessThan32 = function ( arg_1 , arg_2) 
{
    return (0 > this.compare32(arg_other));
}

Number64.lessThan32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.lessThanSigned = function (arg_other) 
{
    return (0 > this.compareSigned(arg_other));
}

Number64.lessThanSigned = function (arg_1 , arg_2) 
{
    return ( 0 > Number64.compareSigned(arg_1 , arg_2 ) );
}

Number64.prototype.lessThanSigned32 = function (arg_other) 
{
    return (0 > this.compareSigned32(arg_other));
}

Number64.lessThanSigned32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number64.compareSigned32(arg_1 , arg_2 ) );
}

Number64.prototype.lessThanOrEqual = function (arg_other)
{
    return (0 >= this.compare(arg_other));
}

Number64.lessThanOrEqual = function ( arg_1 , arg_2 )
{
    return (0 >= this.compare( arg_1 , arg_2 ));
}

Number64.prototype.lessThanOrEqual32 = function (arg_other)
{
    return (0 >= this.compare32(arg_other));
}

Number64.lessThanOrEqual32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 >= Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.lessThanOrEqualSigned = function (arg_other)
{
    return (0 >= this.compareSigned(arg_other));
}

Number64.lessThanOrEqualSigned = function (arg_other)
{
   return ( 0 >= Number64.compareSigned(arg_1 , arg_2 ) );
}

Number64.prototype.lessThanOrEqualSigned32 = function (arg_other)
{
    return (0 >= this.compareSigned32(arg_other));
}

Number64.lessThanOrEqualSigned32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 >= Number64.compareSigned32(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThan = function (arg_other) 
{
    return (0 < this.compare(arg_other));
}

Number64.greaterThan = function (arg_other) 
{
     return ( 0 < Number64.compare(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThan32 = function (arg_other) 
{
    return (0 < this.compare32(arg_other));
}

Number64.greaterThan32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanSigned = function (arg_other) 
{
    return (0 < this.compareSigned(arg_other));
}

Number64.greaterThanSigned = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compareSigned(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanSigned32 = function (arg_other) 
{
    return (0 < this.compareSigned32(arg_other));
}

Number64.greaterThanSigned32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compareSigned32(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanOrEqual = function (arg_other) 
{
    return (0 <= this.compare(arg_other));
}

Number64.greaterThanOrEqual = function (arg_1 , arg_2) 
{
    return ( 0 <= Number64.compare(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanOrEqual32 = function (arg_other) 
{
    return (0 <= this.compare32(arg_other));
}

Number64.greaterThanOrEqual32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 <= Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanOrEqualSigned = function (arg_other) 
{
    return (0 <= this.compareSigned(arg_other));
}

Number64.greaterThanOrEqualSigned = function (arg_1 , arg_2) 
{
    return ( 0 <= Number64.compareSigned(arg_1 , arg_2 ) );
}

Number64.prototype.greaterThanOrEqualSigned32 = function (arg_other) 
{
    return (0 <= this.compareSigned32(arg_other));
}

Number64.greaterThanOrEqualSigned32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 <= Number64.compareSigned32(arg_1 , arg_2 ) );
}

Number64.prototype.compare = function (arg_other) 
{
    return process.reserved.bindings.Number64_cmp(this.hexText, cast2Number64(arg_other).hexText);
}
Number64.prototype.cmp = Number64.prototype.compare;

Number64.compare = function ( arg_1 , arg_2 ) 
{
    var n1 = Number64( arg_1 );
	var n2 = Number64( arg_2 );
	
	return process.reserved.bindings.Number64_cmp(n1.hexText, n2.hexText);
}

Number64.prototype.compareSigned = function (arg_other) 
{
    return process.reserved.bindings.Number64_scmp(this.hexText, cast2Number64(arg_other).hexText);
}

Number64.compareSigned = function ( arg_1 , arg_2 ) 
{
    var n1 = Number64( arg_1 );
	var n2 = Number64( arg_2 );
	
	return process.reserved.bindings.Number64_scmp(n1.hexText, n2.hexText);
}

Number64.prototype.compare32 = function (arg_other) 
{
    return process.reserved.bindings.Number64_cmp32(this.hexText, cast2Number64(arg_other).hexText);
}

Number64.compare32 = function ( arg_1 , arg_2 ) 
{
    var n1 = Number64( arg_1 );
	var n2 = Number64( arg_2 );
	
	return process.reserved.bindings.Number64_cmp32(n1.hexText, n2.hexText);
}

Number64.prototype.compareSigned32 = function (arg_other) 
{
    return process.reserved.bindings.Number64_scmp32(this.hexText, cast2Number64(arg_other).hexText);
}

Number64.compareSigned32 = function ( arg_1 , arg_2 ) 
{
    var n1 = Number64( arg_1 );
	var n2 = Number64( arg_2 );
	
	return process.reserved.bindings.Number64_scmp32(n1.hexText, n2.hexText);
}
Number64.compareSigned32 = Number64.compareSigned32;


Number64.prototype.add = function (arg_other)
{
    this.hexText = process.reserved.bindings.Number64_add(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.add = function ( item , other ) 
{
    return Number64(item).add(other);
}

Number64.prototype.addSigned = function (arg_other)
{
    this.hexText = process.reserved.bindings.Number64_addSigned(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.addSigned = function ( item , other ) 
{
    return Number64(item).addSigned(other);
}


Number64.prototype.sub = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_sub(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.sub = function ( item , other ) 
{
    return Number64(item).sub(other);
}

Number64.prototype.subSigned = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_subSigned(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.subSigned = function ( item , other ) 
{
    return Number64(item).subSigned(other);
}

Number64.prototype.mul = function (arg_other)
 {
    this.hexText = process.reserved.bindings.Number64_mul(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.mul = function ( item , other ) 
{
    return Number64(item).mul(other);
}

Number64.prototype.div = function (arg_other)
 {
    this.hexText = process.reserved.bindings.Number64_div(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.div = function ( item , other ) 
{
    return Number64(item).div(other);
}

Number64.prototype.mod = function (arg_other) 
{
	if ( 0 == arg_other )
	{
		throw new Error("arg_other must not be zero");
	}
	
    this.hexText = process.reserved.bindings.Number64_mod(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.mod = function ( item , other ) 
{
	if ( 0 == other )
	{
		throw new Error("other must not be zero");
	}
	
    return Number64(item).mod(other);
}

Number64.prototype.not = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_not(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.not = function ( item , other ) 
{
    return Number64(item).not(other);
}

Number64.prototype.and = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_and(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.and = function ( item , other ) 
{
    return Number64(item).and(other);
}

Number64.prototype.or = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_or(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.or = function ( item , other ) 
{
    return Number64(item).or(other);
}

Number64.prototype.xor = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_xor(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}

Number64.xor = function ( item , other ) 
{
    return Number64(item).xor(other);
}

Number64.prototype.shl = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_shl(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}
Number64.prototype.shiftLeft = Number64.prototype.shl;

Number64.shiftLeft = function ( item , other ) 
{
    return Number64(item).shiftLeft(other);
}
Number64.shl = Number64.shiftLeft;

Number64.prototype.shr = function (arg_other) 
{
    this.hexText = process.reserved.bindings.Number64_shr(this.hexText, cast2Number64(arg_other).hexText);

    return this;
}
Number64.prototype.shiftRight = Number64.prototype.shr;

Number64.shiftRight = function ( item , other ) 
{
    return Number64(item).shiftRight(other);
}
Number64.shr = Number64.shiftRight;


Number64.prototype.isNumber32 = function () 
{
    return (0 == parseInt(this.hexText.substring(0, 10)));
}

Number64.prototype.setBit = function ( index ) 
{
    return this.or( Number64(1).shiftLeft(index) );
}

Number64.setBit = function ( item , index ) 
{
    return Number64(item).setBit(index);
}

Number64.prototype.clearBit = function ( index ) 
{
    return this.and( Number64(1).shiftLeft(index).not() );
}

Number64.clearBit = function ( item , index ) 
{
    return Number64(item).clearBit(index);
}

Number64.prototype.negBit = function ( index ) 
{
    return this.xor( Number64(1).shiftLeft(index).not() );
}

Number64.negBit = function ( item , index ) 
{
    return Number64(item).negBit(index);
}

Number64.prototype.testBit = function ( index ) 
{
	return ( 1 == Number64(this).shiftRight(index).and(1).toUInt8() );
}

Number64.testBit = function ( item , index ) 
{
    return Number64(item).testBit(index);
}


Number64.prototype.cast2Number32 = function () 
{
    return this.and("0x00000000FFFFFFFF");
}

// cast
Number64.prototype.toInt8 = function () 
{
    return process.reserved.bindings.Number64_toInt8(this.hexText);
}

Number64.prototype.toUInt8 = function () 
{
    return process.reserved.bindings.Number64_toUInt8(this.hexText);
}

Number64.prototype.toInt16LE = function () 
{
    return process.reserved.bindings.Number64_toInt16LE(this.hexText);
}

Number64.prototype.toInt16BE = function () 
{
    return process.reserved.bindings.Number64_toInt16BE(this.hexText);
}

Number64.prototype.toUInt16LE = function () 
{
    return process.reserved.bindings.Number64_toUInt16LE(this.hexText);
}

Number64.prototype.toUInt16BE = function () 
{
    return process.reserved.bindings.Number64_toUInt16BE(this.hexText);
}


Number64.prototype.toInt32LE = function () 
{
    return process.reserved.bindings.Number64_toInt32LE(this.hexText);
}

Number64.prototype.toInt32BE = function () 
{
    return process.reserved.bindings.Number64_toInt32BE(this.hexText);
}

Number64.prototype.toUInt32LE = function () 
{
    return process.reserved.bindings.Number64_toUInt32LE(this.hexText);
}

Number64.prototype.toUInt32BE = function () 
{
    return process.reserved.bindings.Number64_toUInt32BE(this.hexText);
}


Number64.prototype.toFloatLE = function () 
{
    return process.reserved.bindings.Number64_toFloatLE(this.hexText);
}

Number64.prototype.toFloatBE = function () 
{
    return process.reserved.bindings.Number64_toFloatBE(this.hexText);
}

Number64.prototype.toDoubleLE = function () 
{
    return process.reserved.bindings.Number64_toDoubleLE(this.hexText);
}

Number64.prototype.toDoubleBE = function () 
{
    return process.reserved.bindings.Number64_toDoubleBE(this.hexText);
}

// swap
Number64.swap16 = function Number64_swap16(value) 
{
    return process.reserved.bindings.Number64_swap16(Number64(16).hexText);
}

Number64.swap32 = function Number64_swap32(value) 
{
    return process.reserved.bindings.Number64_swap32(Number64(16).hexText);
}

Number64.swap64 = function Number64_swap64(value) 
{
    return Number64(process.reserved.bindings.Number64_swap64(Number64(16).hexText));
}



Number64.IS_ALIGN_BY = function ( value , align ) 
{
	if ( 0 == align )
	{
		throw new Error("align must not be zero");
	}
	
    return ( 0 == Number64.mod( value , align) );
}








//--------------------------------
module.exports = Number64;

function main(  )
{
	
	
	return 0;
}

if ( !module.parent )
{
	main();
}