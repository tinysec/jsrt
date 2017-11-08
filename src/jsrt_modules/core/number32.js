'use strict';


function cast2Number32(arg_1) 
{
    if ('object' == typeof arg_1) 
	{
        if (arg_1) 
		{
            if (arg_1 instanceof Number32) 
			{
                return arg_1;
            }
			else if ("Number32" == arg_1.__TYPE__) 
			{
				return arg_1;
			}
        }
    }

    return Number32.apply(this, arguments);
}




function Number32(arg_1, arg_2)
{
    if ( !( this instanceof Number32 ) ) 
	{
        return new Number32(arg_1, arg_2);
    }

    this.__TYPE__ = "Number32";
	this.signed = 0;

	this.byte3 = 0;
	this.byte2 = 0;
	this.byte1 = 0;
	this.byte0 = 0;


    if (0 == arguments.length) 
	{
		throw new Error("invalid usage");
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
        else if ( 'number' == typeof arguments[0] ) 
		{
			
			this.byte0 = process.reserved.bindings.Number32_getByteOfNumber.call( this , arguments[0] , 0 );
			this.byte1 = process.reserved.bindings.Number32_getByteOfNumber.call( this , arguments[0] , 1 );
			this.byte2 = process.reserved.bindings.Number32_getByteOfNumber.call( this , arguments[0] , 2 );
			this.byte3 = process.reserved.bindings.Number32_getByteOfNumber.call( this , arguments[0] , 3 );	
        }
        else if ('boolean' == typeof arguments[0]) 
		{
            if ( arguments[0] ) 
			{
                this.byte0 = process.reserved.bindings.Number32_getByteOfNumber.call( this , 1 , 0 );
            }
            else 
			{
                this.byte0 = process.reserved.bindings.Number32_getByteOfNumber.call( this , 0 , 0 );
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

            process.reserved.bindings.Number32_fromString.call( this , input_text, nRadix );
        }
        else if ('object' == typeof arguments[0]) 
		{
            if ( Number32.isNumber32( arguments[0] ) ) 
			{
				this.signed = arguments[0].signed;
				
                this.byte0 = arguments[0].byte0;
				this.byte1 = arguments[0].byte1;
				this.byte2 = arguments[0].byte2;
				this.byte3 = arguments[0].byte3;
            }
			else if ( "Number64" == arguments[0].__TYPE__ ) 
			{
				this.signed = arguments[0].signed;
				
                this.byte0 = arguments[0].byte0;
				this.byte1 = arguments[0].byte1;
				this.byte2 = arguments[0].byte2;
				this.byte3 = arguments[0].byte3;
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

}


Number32.isNumber32 = function (obj)
 {
    if (!obj) 
	{
        return false;
    }

    if ( "object" == typeof obj ) 
	{
        if ("Number32" == obj.__TYPE__) 
		{
            return true;
        }
    }

    return false;
}

Number32.prototype.toString = function (arg_radix) 
{
    var radix = arg_radix || 10;

    if ( 16 == radix ) 
	{
		return process.reserved.bindings.Number32_toString(this, 16 );
    }
    else 
	{
        return process.reserved.bindings.Number32_toString(this, 10 );
    }
}

Number32.prototype.toJSNumber = function () 
{
    return process.reserved.bindings.Number32_toJSNumber(this);
}

Number32.prototype.toNumber = function () 
{
    return process.reserved.bindings.Number32_toJSNumber(this);
}

Number32.prototype.isZero = function () 
{
    return (0 == this.compare(0));
}

Number32.isZero = function ( item ) 
{
    return cast2Number32(item).isZero();
}


Number32.prototype.isNegative = function () 
{
    return (0 > this.compareSigned(0));
}

Number32.prototype.isZeroOrNegative = function () 
{
    return (0 >= this.compareSigned(0));
}


Number32.prototype.equal = function (arg_other) 
{
    return (0 == this.compare(arg_other));
}


Number32.equal = function ( arg_1 , arg_2 ) 
{
    return ( 0 == Number32.compare(arg_1 , arg_2 ) );
}

Number32.prototype.notEqual = function (arg_other) 
{
    return (0 != this.compare(arg_other));
}

Number32.notEqual = function ( arg_1 , arg_2 ) 
{
   return ( 0 != Number32.compare(arg_1 , arg_2 ) );
}

Number32.prototype.lessThan = function (arg_other) 
{
    return (0 > this.compare(arg_other));
}
Number32.prototype.smallThan = Number32.prototype.lessThan;

Number32.lessThan = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number32.compare(arg_1 , arg_2 ) );
}
Number32.smallThan = Number32.lessThan;


Number32.prototype.lessThanSigned = function (arg_other) 
{
    return (0 > this.compareSigned(arg_other));
}

Number32.lessThanSigned = function (arg_1 , arg_2) 
{
    return ( 0 > Number32.compareSigned(arg_1 , arg_2 ) );
}

Number32.prototype.lessThanOrEqual = function (arg_other)
{
    return (0 >= this.compare(arg_other));
}

Number32.lessThanOrEqual = function ( arg_1 , arg_2 )
{
    return (0 >= this.compare( arg_1 , arg_2 ));
}

Number32.prototype.lessThanOrEqual32 = function (arg_other)
{
    return (0 >= this.compare32(arg_other));
}

Number32.prototype.lessThanOrEqualSigned = function (arg_other)
{
    return (0 >= this.compareSigned(arg_other));
}

Number32.lessThanOrEqualSigned = function (arg_other)
{
   return ( 0 >= Number32.compareSigned(arg_1 , arg_2 ) );
}


Number32.prototype.greaterThan = function (arg_other) 
{
    return (0 < this.compare(arg_other));
}
Number32.prototype.bigThan = Number32.prototype.greaterThan;
Number32.prototype.largeThan = Number32.prototype.greaterThan;


Number32.greaterThan = function (arg_other) 
{
     return ( 0 < Number32.compare(arg_1 , arg_2 ) );
}
Number32.bigThan = Number32.greaterThan;
Number32.largeThan = Number32.greaterThan;



Number32.prototype.greaterThanSigned = function (arg_other) 
{
    return (0 < this.compareSigned(arg_other));
}
Number32.prototype.bigThanSigned = Number32.prototype.greaterThanSigned;
Number32.prototype.largeThanSigned = Number32.prototype.greaterThanSigned;

Number32.greaterThanSigned = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number32.compareSigned(arg_1 , arg_2 ) );
}
Number32.bigThanSigned = Number32.greaterThanSigned;
Number32.largeThanSigned = Number32.greaterThanSigned ;



Number32.prototype.greaterThanOrEqual = function (arg_other) 
{
    return (0 <= this.compare(arg_other));
}
Number32.prototype.bigThanOrEqual = Number32.prototype.greaterThanOrEqual ;
Number32.prototype.largeThanOrEqual = Number32.prototype.greaterThanOrEqual ;

Number32.greaterThanOrEqual = function (arg_1 , arg_2) 
{
    return ( 0 <= Number32.compare(arg_1 , arg_2 ) );
}
Number32.bigThanOrEqual = Number32.greaterThanOrEqual ;
Number32.largeThanOrEqual = Number32.greaterThanOrEqual ;




Number32.prototype.greaterThanOrEqualSigned = function (arg_other) 
{
    return (0 <= this.compareSigned(arg_other));
}

Number32.greaterThanOrEqualSigned = function (arg_1 , arg_2) 
{
    return ( 0 <= Number32.compareSigned(arg_1 , arg_2 ) );
}



Number32.prototype.compare = function (arg_other) 
{
    return process.reserved.bindings.Number32_cmp(this, cast2Number32(arg_other) );
}

Number32.compare = function ( arg_1 , arg_2 ) 
{
    var n1 = cast2Number32( arg_1 );
	var n2 = cast2Number32( arg_2 );
	
	return process.reserved.bindings.Number32_cmp(n1 , n2 );
}

Number32.prototype.compareSigned = function (arg_other) 
{
    return process.reserved.bindings.Number32_scmp(this, cast2Number32(arg_other) );
}

Number32.compareSigned = function ( arg_1 , arg_2 ) 
{
    var n1 = cast2Number32( arg_1 );
	var n2 = cast2Number32( arg_2 );
	
	return process.reserved.bindings.Number32_scmp(n1 , n2 );
}

Number32.prototype.add = function (arg_other)
{
    var helper = process.reserved.bindings.Number32_add(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	
    return this;
}

Number32.add = function ( item , other ) 
{
	//  clone item and not modify it 
	
    return Number32(item).add(other);
}

Number32.prototype.addSigned = function (arg_other)
{
    var helper = process.reserved.bindings.Number32_addSigned(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.addSigned = function ( item , other ) 
{
    return Number32(item).addSigned(other);
}


Number32.prototype.sub = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_sub(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.sub = function ( item , other ) 
{
    return Number32(item).sub(other);
}

Number32.prototype.subSigned = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_subSigned(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.subSigned = function ( item , other ) 
{
    return Number32(item).subSigned(other);
}

Number32.prototype.mul = function (arg_other)
 {
    var helper = process.reserved.bindings.Number32_mul(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.mul = function ( item , other ) 
{
    return Number32(item).mul(other);
}

Number32.prototype.div = function (arg_other)
 {
    var helper = process.reserved.bindings.Number32_div(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.div = function ( item , other ) 
{
    return Number32(item).div(other);
}

Number32.prototype.mod = function (arg_other) 
{
	if ( 0 == arg_other )
	{
		throw new Error("arg_other must not be zero");
	}
	
    var helper = process.reserved.bindings.Number32_mod(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
	
    return this;
}

Number32.mod = function ( item , other ) 
{
	if ( 0 == other )
	{
		throw new Error("other must not be zero");
	}
	
    return Number32(item).mod(other);
}

Number32.prototype.not = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_not(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.not = function ( item , other ) 
{
    return Number32(item).not(other);
}

Number32.prototype.neg = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_neg(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.neg = function ( item , other ) 
{
    return Number32(item).neg(other);
}

Number32.prototype.and = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_and(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.and = function ( item , other ) 
{
    return Number32(item).and(other);
}

Number32.prototype.or = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_or(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.or = function ( item , other ) 
{
    return Number32(item).or(other);
}

Number32.prototype.xor = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_xor(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}

Number32.xor = function ( item , other ) 
{
    return Number32(item).xor(other);
}

Number32.prototype.shl = function (arg_other) 
{
    var helper = process.reserved.bindings.Number32_shl(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}
Number32.prototype.shiftLeft = Number32.prototype.shl;

Number32.shiftLeft = function ( item , other ) 
{
    return Number32(item).shiftLeft(other);
}
Number32.shl = Number32.shiftLeft;

Number32.prototype.shr = function (arg_other) 
{
    var  helper= process.reserved.bindings.Number32_shr(this, cast2Number32(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
	
    return this;
}
Number32.prototype.shiftRight = Number32.prototype.shr;

Number32.shiftRight = function ( item , other ) 
{
    return Number32(item).shiftRight(other);
}
Number32.shr = Number32.shiftRight;


Number32.prototype.setBit = function ( index ) 
{
    return this.or( cast2Number32(1).shiftLeft(index) );
}

Number32.setBit = function ( item , index ) 
{
    return Number32(item).setBit(index);
}

Number32.prototype.clearBit = function ( index ) 
{
    return this.and( cast2Number32(1).shiftLeft(index).not() );
}

Number32.clearBit = function ( item , index ) 
{
    return Number32(item).clearBit(index);
}

Number32.prototype.negBit = function ( index ) 
{
    return this.xor( cast2Number32(1).shiftLeft(index).not() );
}

Number32.negBit = function ( item , index ) 
{
    return Number32(item).negBit(index);
}

Number32.prototype.testBit = function ( index ) 
{
	return ( 1 == Number32(this).shiftRight(index).and(1).toUInt8() );
}

Number32.testBit = function ( item , index ) 
{
    return Number32(item).testBit(index);
}


// cast
Number32.prototype.toInt8 = function () 
{
    return process.reserved.bindings.Number32_toInt8(this);
}

Number32.prototype.toUInt8 = function () 
{
    return process.reserved.bindings.Number32_toUInt8(this);
}

Number32.prototype.toInt16LE = function () 
{
    return process.reserved.bindings.Number32_toInt16LE(this);
}

Number32.prototype.toInt16BE = function () 
{
    return process.reserved.bindings.Number32_toInt16BE(this);
}

Number32.prototype.toUInt16LE = function () 
{
    return process.reserved.bindings.Number32_toUInt16LE(this);
}

Number32.prototype.toUInt16BE = function () 
{
    return process.reserved.bindings.Number32_toUInt16BE(this);
}


Number32.prototype.toInt32LE = function () 
{
    return process.reserved.bindings.Number32_toInt32LE(this);
}

Number32.prototype.toInt32BE = function () 
{
    return process.reserved.bindings.Number32_toInt32BE(this);
}

Number32.prototype.toUInt32LE = function () 
{
    return process.reserved.bindings.Number32_toUInt32LE(this);
}

Number32.prototype.toUInt32BE = function () 
{
    return process.reserved.bindings.Number32_toUInt32BE(this);
}


Number32.prototype.toFloatLE = function () 
{
    return process.reserved.bindings.Number32_toFloatLE(this);
}

Number32.prototype.toFloatBE = function () 
{
    return process.reserved.bindings.Number32_toFloatBE(this);
}

Number32.prototype.toDoubleLE = function () 
{
    return process.reserved.bindings.Number32_toDoubleLE(this);
}

Number32.prototype.toDoubleBE = function () 
{
    return process.reserved.bindings.Number32_toDoubleBE(this);
}

// swap
Number32.swap16 = function Number32_swap16(value) 
{
    return process.reserved.bindings.Number32_swap16( cast2Number32(value) );
}

Number32.swap32 = function Number32_swap32(value) 
{
    return process.reserved.bindings.Number32_swap32( cast2Number32(value) );
}


Number32.IS_ALIGN_BY = function ( value , align ) 
{
	if ( 0 == align )
	{
		throw new Error("align must not be zero");
	}
	
    return ( 0 == Number32.mod( value , align) );
}

//----------------------------------------
// arg_min <= value < arg_max
var g_next_seed = 0;

Number32.srand = function(  arg_seed ) 
{
	g_next_seed = cast2Number32(arg_seed);
}

Number32.random = function( arg_min , arg_max , arg_seed ) 
{
  var min = null;
  
  var max = null;
  
  var value = 0;
  
  var helper = null;
  

  if ( arguments.length >= 2  )
  {
	  min = cast2Number32( arg_min );
	  
	  max = cast2Number32( arg_max );
  }
  else
  {
	  min = cast2Number32( 0 );
	  
	  max = cast2Number32( "0xFFFFFFFE" );
  }
  
  if ( arguments.length >= 3 )
  {
	  if ( 
		 ( Number32.isNumber32( arg_seed ) )
		 || ( Number64.isNumber64( arg_seed ) )
		 || ( 'number' == typeof arg_seed )
		)
	  {
		  //nop
	  }
	  else
	  {
		  throw new Error("invalid typeof seed");
	  }

	  helper = process.reserved.bindings.host_random( arg_seed );
	  
	  value = cast2Number32( helper.value );
	  
	  g_next_seed = cast2Number32( helper.seed );
  }
  else
  {
	  helper = process.reserved.bindings.host_random( g_next_seed );
	  
	  value = cast2Number32( helper.value );
	  
	  g_next_seed = cast2Number32( helper.seed );
  }
  
  value.mod( max.sub(min).add(1) ).add(min);
  
  return value;
}






//--------------------------------
module.exports = Number32;

function main(  )
{

	return 0;
}

if ( !module.parent )
{
	main();
}