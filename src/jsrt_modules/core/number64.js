'use strict';


function cast2Number64(arg_1) 
{
    if ('object' == typeof arg_1) 
	{
        if (arg_1) 
		{
            if ( arg_1 instanceof Number64 ) 
			{
                return arg_1;
            }
			else if ( "Number64" == arg_1.__TYPE__ ) 
			{
				return arg_1;
			}
        }
    }

    return Number64.apply(this, arguments);
}




function Number64(arg_1, arg_2)
{
    if ( !(this instanceof Number64) ) 
	{
		if ( 'object' == typeof arg_1 ) 
		{
			if ( arg_1 ) 
			{
				if ( arg_1 instanceof Number64 ) 
				{
					return arg_1;
				}
				else if ( "Number64" == arg_1.__TYPE__ ) 
				{
					return arg_1;
				}
			}
		}
	
        return new Number64(arg_1, arg_2);
    }

    this.__TYPE__ = "Number64";
	this.signed = 0;

	this.byte7 = 0;
	this.byte6 = 0;
	this.byte5 = 0;
	this.byte4 = 0;
	
	this.byte3 = 0;
	this.byte2 = 0;
	this.byte1 = 0;
	this.byte0 = 0;


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
        else if ( 'number' == typeof arguments[0] ) 
		{
			if (  ( 2 == arguments.length ) && (  'number' == typeof arguments[1] )  )
			{
				this.byte0 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 0 );
				this.byte1 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 1 );
				this.byte2 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 2 );
				this.byte3 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 3 );
				
				this.byte4 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[1] , 0 );
				this.byte5 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[1] , 1 );
				this.byte6 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[1] , 2 );
				this.byte7 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[1] , 3 );
			}
			else
			{
				this.byte0 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 0 );
				this.byte1 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 1 );
				this.byte2 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 2 );
				this.byte3 = process.reserved.bindings.Number64_getByteOfNumber.call( this , arguments[0] , 3 );	
			}
			
        }
        else if ('boolean' == typeof arguments[0]) 
		{
            if ( arguments[0] ) 
			{
                this.byte0 = process.reserved.bindings.Number64_getByteOfNumber.call( this , 1 , 0 );
            }
            else 
			{
                this.byte0 = process.reserved.bindings.Number64_getByteOfNumber.call( this , 0 , 0 );
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

            process.reserved.bindings.Number64_fromString.call( this , input_text, nRadix );
        }
        else if ('object' == typeof arguments[0]) 
		{
            if ( Number64.isNumber64( arguments[0] ) ) 
			{
				this.signed = arguments[0].signed;
				
                this.byte0 = arguments[0].byte0;
				this.byte1 = arguments[0].byte1;
				this.byte2 = arguments[0].byte2;
				this.byte3 = arguments[0].byte3;
				
				this.byte4 = arguments[0].byte4;
				this.byte5 = arguments[0].byte5;
				this.byte6 = arguments[0].byte6;
				this.byte7 = arguments[0].byte7;
            }
			else if ( "Number32" == arguments[0].__TYPE__ ) 
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

    if ( 16 == radix ) 
	{
		return process.reserved.bindings.Number64_toString(this, 16 );
    }
    else 
	{
        return process.reserved.bindings.Number64_toString(this, 10 );
    }
}

Number64.prototype.toJSNumber = function () 
{
    return process.reserved.bindings.Number64_toJSNumber(this);
}

Number64.prototype.toNumber = function () 
{
    return process.reserved.bindings.Number64_toJSNumber(this);
}

Number64.prototype.isZero = function () 
{
    return (0 == this.compare(0));
}

Number64.isZero = function ( item ) 
{
    return cast2Number64(item).isZero();
}

Number64.prototype.isZero32 = function () 
{
    return (0 == this.compare32(0));
}

Number64.isZero32 = function ( item ) 
{
    return cast2Number64(item).isZero32();
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

Number64.prototype.equal = function (arg_other) 
{
    return (0 == this.compare(arg_other));
}

Number64.equal = function ( arg_1 , arg_2 ) 
{
    return ( 0 == Number64.compare(arg_1 , arg_2 ) );
}



Number64.prototype.equal32 = function (arg_other) 
{
    return (0 == this.compare32(arg_other));
}


Number64.equal32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 == Number64.compare32(arg_1 , arg_2 ) );
}


Number64.prototype.notEqual = function (arg_other) 
{
    return (0 != this.compare(arg_other));
}
Number64.prototype.neq = Number64.prototype.notEqual;

Number64.notEqual = function ( arg_1 , arg_2 ) 
{
   return ( 0 != Number64.compare(arg_1 , arg_2 ) );
}
Number64.neq = Number64.notEqual;

Number64.prototype.notEqual32 = function (arg_other) 
{
    return (0 != this.compare32(arg_other));
}


Number64.notEqual32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 != Number64.compare32(arg_1 , arg_2 ) );
}

Number64.prototype.lessThan = function (arg_other) 
{
    return (0 > this.compare(arg_other));
}
Number64.prototype.smallThan = Number64.prototype.lessThan;

Number64.lessThan = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number64.compare(arg_1 , arg_2 ) );
}
Number64.smallThan = Number64.lessThan;

Number64.prototype.lessThan32 = function ( arg_1 , arg_2) 
{
    return (0 > this.compare32(arg_other));
}
Number64.prototype.smallThan32 = Number64.prototype.lessThan32;

Number64.lessThan32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 > Number64.compare32(arg_1 , arg_2 ) );
}
Number64.smallThan32 = Number64.lessThan32;

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
Number64.prototype.bigThan = Number64.prototype.greaterThan;
Number64.prototype.largeThan = Number64.prototype.greaterThan;


Number64.greaterThan = function (arg_other) 
{
     return ( 0 < Number64.compare(arg_1 , arg_2 ) );
}
Number64.bigThan = Number64.greaterThan;
Number64.largeThan = Number64.greaterThan;

Number64.prototype.greaterThan32 = function (arg_other) 
{
    return (0 < this.compare32(arg_other));
}
Number64.prototype.bigThan32 = Number64.prototype.greaterThan32;
Number64.prototype.largeThan32 = Number64.prototype.greaterThan32;


Number64.greaterThan32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compare32(arg_1 , arg_2 ) );
}
Number64.bigThan32 = Number64.greaterThan32;
Number64.largeThan32 = Number64.greaterThan32;

Number64.prototype.greaterThanSigned = function (arg_other) 
{
    return (0 < this.compareSigned(arg_other));
}
Number64.prototype.bigThanSigned = Number64.prototype.greaterThanSigned;
Number64.prototype.largeThanSigned = Number64.prototype.greaterThanSigned;

Number64.greaterThanSigned = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compareSigned(arg_1 , arg_2 ) );
}
Number64.bigThanSigned = Number64.greaterThanSigned;
Number64.largeThanSigned = Number64.greaterThanSigned ;

Number64.prototype.greaterThanSigned32 = function (arg_other) 
{
    return (0 < this.compareSigned32(arg_other));
}
Number64.prototype.bigThanSigned32 = Number64.prototype.greaterThanSigned32;
Number64.prototype.largeThanSigned32 = Number64.prototype.greaterThanSigned32;

Number64.greaterThanSigned32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 < Number64.compareSigned32(arg_1 , arg_2 ) );
}
Number64.bigThanSigned32 = Number64.greaterThanSigned32;
Number64.largeThanSigned32 = Number64.greaterThanSigned32 ;


Number64.prototype.greaterThanOrEqual = function (arg_other) 
{
    return (0 <= this.compare(arg_other));
}
Number64.prototype.bigThanOrEqual = Number64.prototype.greaterThanOrEqual ;
Number64.prototype.largeThanOrEqual = Number64.prototype.greaterThanOrEqual ;

Number64.greaterThanOrEqual = function (arg_1 , arg_2) 
{
    return ( 0 <= Number64.compare(arg_1 , arg_2 ) );
}
Number64.bigThanOrEqual = Number64.greaterThanOrEqual ;
Number64.largeThanOrEqual = Number64.greaterThanOrEqual ;


Number64.prototype.greaterThanOrEqual32 = function (arg_other) 
{
    return (0 <= this.compare32(arg_other));
}
Number64.prototype.bigThanOrEqual32 = Number64.prototype.greaterThanOrEqual32 ;
Number64.prototype.largeThanOrEqual32 = Number64.prototype.greaterThanOrEqual32 ;

Number64.greaterThanOrEqual32 = function ( arg_1 , arg_2 ) 
{
    return ( 0 <= Number64.compare32(arg_1 , arg_2 ) );
}
Number64.bigThanOrEqual32 = Number64.greaterThanOrEqual32 ;
Number64.largeThanOrEqual32 = Number64.greaterThanOrEqual32 ;

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
    return process.reserved.bindings.Number64_cmp(this, cast2Number64(arg_other) );
}


Number64.compare = function ( arg_1 , arg_2 ) 
{
    var n1 = cast2Number64( arg_1 );
	var n2 = cast2Number64( arg_2 );
	
	return process.reserved.bindings.Number64_cmp(n1 , n2 );
}

Number64.prototype.compareSigned = function (arg_other) 
{
    return process.reserved.bindings.Number64_scmp(this, cast2Number64(arg_other) );
}

Number64.compareSigned = function ( arg_1 , arg_2 ) 
{
    var n1 = cast2Number64( arg_1 );
	var n2 = cast2Number64( arg_2 );
	
	return process.reserved.bindings.Number64_scmp(n1 , n2 );
}

Number64.prototype.compare32 = function (arg_other) 
{
    return process.reserved.bindings.Number64_cmp32(this, cast2Number64(arg_other) );
}


Number64.prototype.compareSigned32 = function (arg_other) 
{
    return process.reserved.bindings.Number64_scmp32(this, cast2Number64(arg_other) );
}

Number64.compareSigned32 = function ( arg_1 , arg_2 ) 
{
    var n1 = cast2Number64( arg_1 );
	var n2 = cast2Number64( arg_2 );
	
	return process.reserved.bindings.Number64_scmp32(n1 , n2 );
}
Number64.compareSigned32 = Number64.compareSigned32;


Number64.prototype.add = function (arg_other)
{
    var helper = process.reserved.bindings.Number64_add(this, cast2Number64(arg_other) );
		
    this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.add = function ( item , other ) 
{
    return cast2Number64(item).add(other);
}

Number64.prototype.addSigned = function (arg_other)
{
    var helper = process.reserved.bindings.Number64_addSigned(this, cast2Number64(arg_other) );
	
    this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.addSigned = function ( item , other ) 
{
    return cast2Number64(item).addSigned(other);
}


Number64.prototype.sub = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_sub(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.sub = function ( item , other ) 
{
    return cast2Number64(item).sub(other);
}

Number64.prototype.subSigned = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_subSigned(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.subSigned = function ( item , other ) 
{
    return cast2Number64(item).subSigned(other);
}

Number64.prototype.mul = function (arg_other)
 {
    var helper = process.reserved.bindings.Number64_mul(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.mul = function ( item , other ) 
{
    return cast2Number64(item).mul(other);
}

Number64.prototype.div = function (arg_other)
 {
    var helper = process.reserved.bindings.Number64_div(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.div = function ( item , other ) 
{
    return cast2Number64(item).div(other);
}

Number64.prototype.mod = function (arg_other) 
{
	if ( 0 == arg_other )
	{
		throw new Error("arg_other must not be zero");
	}
	
    var helper = process.reserved.bindings.Number64_mod(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.mod = function ( item , other ) 
{
	if ( 0 == other )
	{
		throw new Error("other must not be zero");
	}
	
    return cast2Number64(item).mod(other);
}

Number64.prototype.not = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_not(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.not = function ( item , other ) 
{
    return cast2Number64(item).not(other);
}


Number64.prototype.neg = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_neg(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.neg = function ( item , other ) 
{
    return cast2Number64(item).neg(other);
}




Number64.prototype.and = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_and(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.and = function ( item , other ) 
{
    return cast2Number64(item).and(other);
}

Number64.prototype.or = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_or(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.or = function ( item , other ) 
{
    return cast2Number64(item).or(other);
}

Number64.prototype.xor = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_xor(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}

Number64.xor = function ( item , other ) 
{
    return cast2Number64(item).xor(other);
}

Number64.prototype.shl = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_shl(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}
Number64.prototype.shiftLeft = Number64.prototype.shl;

Number64.shiftLeft = function ( item , other ) 
{
    return cast2Number64(item).shiftLeft(other);
}
Number64.shl = Number64.shiftLeft;

Number64.prototype.shr = function (arg_other) 
{
    var helper = process.reserved.bindings.Number64_shr(this, cast2Number64(arg_other) );
	
	this.byte0 = helper.byte0;
	this.byte1 = helper.byte1;
	this.byte2 = helper.byte2;
	this.byte3 = helper.byte3;
				
	this.byte4 = helper.byte4;
	this.byte5 = helper.byte5;
	this.byte6 = helper.byte6;
	this.byte7 = helper.byte7;
	
    return this;
}
Number64.prototype.shiftRight = Number64.prototype.shr;

Number64.shiftRight = function ( item , other ) 
{
    return cast2Number64(item).shiftRight(other);
}
Number64.shr = Number64.shiftRight;

Number64.prototype.setBit = function ( index ) 
{
    return this.or( cast2Number64(1).shiftLeft(index) );
}

Number64.setBit = function ( item , index ) 
{
    return cast2Number64(item).setBit(index);
}

Number64.prototype.clearBit = function ( index ) 
{
    return this.and( cast2Number64(1).shiftLeft(index).not() );
}

Number64.clearBit = function ( item , index ) 
{
    return cast2Number64(item).clearBit(index);
}

Number64.prototype.negBit = function ( index ) 
{
    return this.xor( cast2Number64(1).shiftLeft(index).not() );
}

Number64.negBit = function ( item , index ) 
{
    return cast2Number64(item).negBit(index);
}

Number64.prototype.testBit = function ( index ) 
{
	return ( 1 == cast2Number64(this).shiftRight(index).and(1).toUInt8() );
}

Number64.testBit = function ( item , index ) 
{
    return cast2Number64(item).testBit(index);
}


// cast
Number64.prototype.toInt8 = function () 
{
    return process.reserved.bindings.Number64_toInt8(this);
}

Number64.prototype.toUInt8 = function () 
{
    return process.reserved.bindings.Number64_toUInt8(this);
}

Number64.prototype.toInt16LE = function () 
{
    return process.reserved.bindings.Number64_toInt16LE(this);
}

Number64.prototype.toInt16BE = function () 
{
    return process.reserved.bindings.Number64_toInt16BE(this);
}

Number64.prototype.toUInt16LE = function () 
{
    return process.reserved.bindings.Number64_toUInt16LE(this);
}

Number64.prototype.toUInt16BE = function () 
{
    return process.reserved.bindings.Number64_toUInt16BE(this);
}


Number64.prototype.toInt32LE = function () 
{
    return process.reserved.bindings.Number64_toInt32LE(this);
}

Number64.prototype.toInt32BE = function () 
{
    return process.reserved.bindings.Number64_toInt32BE(this);
}

Number64.prototype.toUInt32LE = function () 
{
    return process.reserved.bindings.Number64_toUInt32LE(this);
}

Number64.prototype.toUInt32BE = function () 
{
    return process.reserved.bindings.Number64_toUInt32BE(this);
}


Number64.prototype.toFloatLE = function () 
{
    return process.reserved.bindings.Number64_toFloatLE(this);
}

Number64.prototype.toFloatBE = function () 
{
    return process.reserved.bindings.Number64_toFloatBE(this);
}

Number64.prototype.toDoubleLE = function () 
{
    return process.reserved.bindings.Number64_toDoubleLE(this);
}

Number64.prototype.toDoubleBE = function () 
{
    return process.reserved.bindings.Number64_toDoubleBE(this);
}

// swap
Number64.swap16 = function Number64_swap16(value) 
{
    return process.reserved.bindings.Number64_swap16( cast2Number64(value) );
}

Number64.swap32 = function Number64_swap32(value) 
{
    return process.reserved.bindings.Number64_swap32( cast2Number64(value) );
}

Number64.swap64 = function Number64_swap64(value) 
{
    return cast2Number64(process.reserved.bindings.Number64_swap64( cast2Number64(value) ));
}



Number64.IS_ALIGN_BY = function ( value , align ) 
{
	if ( 0 == align )
	{
		throw new Error("align must not be zero");
	}
	
    return ( 0 == Number64.mod( value , align) );
}




//----------------------------------------
// arg_min <= value < arg_max
var g_next_seed = 0;

Number64.srand = function(  arg_seed ) 
{
	g_next_seed = cast2Number64(arg_seed);
}

Number64.random = function( arg_min , arg_max , arg_seed ) 
{
  var min = null;
  
  var max = null;
  
  var value = 0;
  
  var helper = null;
  

  if ( arguments.length >= 2  )
  {
	  min = cast2Number64( arg_min );
	  
	  max = cast2Number64( arg_max );
  }
  else
  {
	  min = cast2Number64( 0 );
	  
	  max = cast2Number64( "0xFFFFFFFFFFFFFFFE" );
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
	  
	  value = cast2Number64( helper.value );
	  
	  g_next_seed = cast2Number64( helper.seed );
  }
  else
  {
	  helper = process.reserved.bindings.host_random( g_next_seed );
	  
	  value = cast2Number64( helper.value );
	  
	  g_next_seed = cast2Number64( helper.seed );
  }
  
  value.mod( max.sub(min).add(1) ).add(min);
  
  return value;
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