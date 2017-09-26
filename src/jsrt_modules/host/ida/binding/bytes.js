'use strict';


const _ = require("underscore");
const assert = require("assert");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;


// Number64 get_item_head( Number64 address );
function get_item_head( arg_address )
{
	return Number64( process.reserved.hostDependBindings.ida_get_item_head( Number64( arg_address )  ) );
}
exports.get_item_head = get_item_head;


// Number64 get_item_end( Number64 address );
function get_item_end( arg_address )
{
	return Number64( process.reserved.hostDependBindings.ida_get_item_end( Number64( arg_address )  ) );
}
exports.get_item_end = get_item_end;


// Number64 get_item_size( Number64 address );
function get_item_size( arg_address )
{
	return Number64( process.reserved.hostDependBindings.ida_get_item_size( Number64( arg_address )  ) );
}
exports.get_item_size = get_item_size;



// buffer

// UCHAR get_8bit( Number64 address );
function get_8bit( arg_address )
{
	return process.reserved.hostDependBindings.ida_get_8bit( Number64( arg_address )  ) ;
}
exports.get_8bit = get_8bit;


// USHORT get_16bit( Number64 address );
function get_16bit( arg_address )
{
	return process.reserved.hostDependBindings.ida_get_16bit( Number64( arg_address )  ) ;
}
exports.get_16bit = get_16bit;


// ULONG get_32bit( Number64 address );
function get_32bit( arg_address )
{
	return Number32( process.reserved.hostDependBindings.ida_get_32bit( Number64( arg_address )  ) );
}
exports.get_32bit = get_32bit;


// ULONG64 get_64bit( Number64 address );
function get_64bit( arg_address )
{
	return Number64( process.reserved.hostDependBindings.ida_get_64bit( Number64( arg_address )  ) );
}
exports.get_64bit = get_64bit;


// Boolean get_many_bytes( Number64 address , Buffer buf );
function get_many_bytes( arg_address , arg_buf )
{
	return process.reserved.hostDependBindings.ida_get_many_bytes( Number64( arg_address ) ,  arg_buf  );
}
exports.get_many_bytes = get_many_bytes;



// original
// UCHAR get_original_byte( Number64 address );
function get_original_byte( arg_address )
{
	return process.reserved.hostDependBindings.ida_get_original_byte( Number64( arg_address )  ) ;
}
exports.get_original_byte = get_original_byte;


// USHORT get_original_word( Number64 address );
function get_original_word( arg_address )
{
	return process.reserved.hostDependBindings.ida_get_original_word( Number64( arg_address )  ) ;
}
exports.get_original_word = get_original_word;


// ULONG get_original_long( Number64 address );
function get_original_long( arg_address )
{
	return Number32( process.reserved.hostDependBindings.ida_get_original_long( Number64( arg_address )  ) );
}
exports.get_original_long = get_original_long;


// ULONG64 get_original_qword( Number64 address );
function get_original_qword( arg_address )
{
	return Number64( process.reserved.hostDependBindings.ida_get_original_qword( Number64( arg_address )  ) );
}
exports.get_original_qword = get_original_qword;


// Boolean put_byte( Number64 address , UCHAR value );
function put_byte( arg_address , arg_value )
{
	return process.reserved.hostDependBindings.ida_put_byte( Number64( arg_address ) ,  arg_value   ) ;
}
exports.put_byte = put_byte;


// Boolean put_word( Number64 address , USHORT value );
function put_word( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_put_word( Number64( arg_address ) ,  arg_value   ) ;
}
exports.put_word = put_word;


// Boolean put_long( Number64 address , ULONG value  );
function put_long( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_put_long( Number64( arg_address ) ,  arg_value  );
}
exports.put_long = put_long;


// Boolean put_qword( Number64 address , ULONG64 value );
function put_qword( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_put_qword( Number64( arg_address )  , Number64(  arg_value  )  );
}
exports.put_qword = put_qword;


// Boolean put_many_bytes( Number64 address , Buffer buf );
function put_many_bytes( arg_address , arg_buf )
{
	return process.reserved.hostDependBindings.ida_put_many_bytes( Number64( arg_address ) ,  arg_buf  );
}
exports.put_many_bytes = put_many_bytes;


// patch
// Boolean patch_byte( Number64 address , UCHAR value );
function patch_byte( arg_address , arg_value )
{
	return process.reserved.hostDependBindings.ida_patch_byte( Number64( arg_address ) ,  arg_value   ) ;
}
exports.patch_byte = patch_byte;


// Boolean patch_word( Number64 address , USHORT value );
function patch_word( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_patch_word( Number64( arg_address ) ,  arg_value   ) ;
}
exports.patch_word = patch_word;


// Boolean patch_long( Number64 address , ULONG value  );
function patch_long( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_patch_long( Number64( arg_address ) ,  arg_value  );
}
exports.patch_long = patch_long;


// Boolean patch_qword( Number64 address , ULONG64 value );
function patch_qword( arg_address ,  arg_value  )
{
	return process.reserved.hostDependBindings.ida_patch_qword( Number64( arg_address )  , Number64(  arg_value  )  );
}
exports.patch_qword = patch_qword;


// Boolean patch_many_bytes( Number64 address , Buffer buf );
function patch_many_bytes( arg_address , arg_buf )
{
	return process.reserved.hostDependBindings.ida_patch_many_bytes( Number64( arg_address ) ,  arg_buf  );
}
exports.patch_many_bytes = patch_many_bytes;



// Boolean is_code( Number64 address);
function is_code( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_code( Number64( arg_address )  ) ;
}
exports.is_code = is_code;


// Boolean is_data( Number64 address);
function is_data( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_data( Number64( arg_address )  ) ;
}
exports.is_data = is_data;


// Boolean is_head( Number64 address);
function is_head( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_head( Number64( arg_address )  ) ;
}
exports.is_head = is_head;


// Boolean is_tail( Number64 address);
function is_tail( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_tail( Number64( arg_address )  ) ;
}
exports.is_tail = is_tail;


// Boolean is_unknown( Number64 address);
function is_unknown( arg_address )
{
	return process.reserved.hostDependBindings.ida_is_unknown( Number64( arg_address )  ) ;
}
exports.is_unknown = is_unknown;




// Boolean do_byte( Number64 address , ULONG length );
function do_byte( arg_address , arg_length )
{
	return process.reserved.hostDependBindings.ida_doByte( Number64( arg_address ) ,  arg_length   ) ;
}
exports.do_byte = do_byte;

// Boolean do_word( Number64 address , ULONG length );
function do_word( arg_address , arg_length )
{
	return process.reserved.hostDependBindings.ida_doWord( Number64( arg_address ) ,  arg_length   ) ;
}
exports.do_word = do_word;

// Boolean do_dword( Number64 address , ULONG length );
function do_dword( arg_address , arg_length )
{
	return process.reserved.hostDependBindings.ida_doDwrd( Number64( arg_address ) ,  arg_length   ) ;
}
exports.do_dword = do_dword;

// Boolean do_qword( Number64 address , ULONG length );
function do_qword( arg_address , arg_length )
{
	return process.reserved.hostDependBindings.ida_doQwrd( Number64( arg_address ) ,  arg_length   ) ;
}
exports.do_qword = do_qword;



// string get_comment( Number64 startEA , boolean Repeateable );
function get_comment( arg_startEA , arg_repeateable )
{
	return process.reserved.hostDependBindings.ida_get_cmt( Number64(arg_startEA) , arg_repeateable );
}
exports.get_comment = get_comment;


// boolean set_comment( Number64 startEA , string comment , boolean Repeateable);
function set_comment( arg_startEA , arg_comment , arg_repeateable )
{
	assert( _.isString(arg_comment) , "arg_comment must  be string" );
	
	return process.reserved.hostDependBindings.ida_set_cmt( Number64(arg_startEA) , arg_comment ,  arg_repeateable  );
}
exports.set_comment = set_comment;


// Number64 search_bytes( Number64 startEA , Number64 endEA , String pattern   );
function search_bytes( arg_startEA , arg_endEA , arg_pattern , arg_mask )
{
	var bin_pattern_buff = null;
	
	var bin_mask_buff = null;
	
	var byte_index = 0;
	
	var text_value = 0;
	
	var bin_value = 0;
	
	var error_text = null;
	
	var text_pattern_array = null;
	
	var matched_address = null;
	
	var param_pattern_buff = null;
	
	var param_mask_buff = null;
	
	if ( _.isString( arg_pattern ) )
	{
		if ( 0 == arg_pattern.length )
		{
			throw new Error("empty search pattern");
		}
		
		text_pattern_array = arg_pattern.trim().split(' ');
	
		if ( !text_pattern_array || ( 0 == text_pattern_array.length ) )
		{
			return;
		}

		text_pattern_array = _.filter( text_pattern_array , function(item)
		{
			return ( item.trim().length >= 2 )
		});
		
		
		text_pattern_array = _.map( text_pattern_array , function(item)
		{
			if ( '??' == item )
			{
				return item;
			}
			else if ( 0 == item.indexOf('0x') )
			{
				return item.substring( 2 , item.length );
			}
			else if ( 0 == item.indexOf('0X') )
			{
				return item.substring( 2 , item.length );
			}
			else
			{
				return item;
			}
		});
		
		bin_pattern_buff = Buffer.alloc( text_pattern_array.length );
		if ( !bin_pattern_buff )
		{
			return;
		}
		
		bin_mask_buff = Buffer.alloc( text_pattern_array.length );
		if ( !bin_mask_buff )
		{
			return;
		}
		
		for ( byte_index = 0; byte_index < text_pattern_array.length; byte_index++ )
		{
			text_value  = text_pattern_array[ byte_index ];
			
			if ( 2 != text_value.length )
			{
				error_text = 'bad pattern';
				break;
			}
			
			if ( '??' == text_value )
			{
				bin_pattern_buff.writeUInt8( 0 , byte_index );
				
				bin_mask_buff.writeUInt8( 0 , byte_index );
			}
			else
			{
				bin_value = parseInt( '0x' + text_value );
			
				bin_pattern_buff.writeUInt8( bin_value , byte_index );
				
				bin_mask_buff.writeUInt8( 1 , byte_index );
			}
		}
	
		param_pattern_buff = bin_pattern_buff;
	
		param_mask_buff = bin_mask_buff;
	}
	else if ( Buffer.isBuffer( arg_pattern ) )
	{
		if ( 0 == arg_pattern.length )
		{
			throw new Error( "empty search pattern" );
		}
		
		param_pattern_buff = bin_pattern_buff;
		
		if ( _.isBuffer( arg_mask ) && ( 0 != arg_mask.length ) )
		{
			param_mask_buff = arg_mask;
		}
		
	}
	else
	{
		throw new Error( "bad search pattern" );
	}
	
	
	if ( error_text )
	{
		if ( bin_pattern_buff )
		{
			bin_pattern_buff.free();
			bin_pattern_buff = null;	
		}
	
		if ( bin_mask_buff )
		{
			bin_mask_buff.free();
			bin_mask_buff = null;
		}
		
	
		throw new Error( error_text );
	}
	
	matched_address = process.reserved.hostDependBindings.ida_bin_search( 
							Number64( arg_startEA ) ,
							Number64( arg_endEA ) , 
							param_pattern_buff ,
							param_mask_buff 
	) ;
	
	
	if ( bin_pattern_buff )
	{
		bin_pattern_buff.free();
		bin_pattern_buff = null;	
	}
	
	if ( bin_mask_buff )
	{
		bin_mask_buff.free();
		bin_mask_buff = null;
	}
		
	
	return Number64( matched_address );
}
exports.search_bytes = search_bytes;


// Boolean match_bytes( Number64 address , String pattern   );
function match_bytes( arg_address , arg_pattern , arg_mask )
{
	var bin_pattern_buff = null;
	
	var bin_mask_buff = null;
	
	var byte_index = 0;
	
	var text_value = 0;
	
	var bin_value = 0;
	
	var error_text = null;
	
	var text_pattern_array = null;
	
	var matched_flag = null;
	
	var param_pattern_buff = null;
	
	var param_mask_buff = null;
	
	if ( _.isString( arg_pattern ) )
	{
		if ( 0 == arg_pattern.length )
		{
			throw new Error("empty search pattern");
		}
		
		text_pattern_array = arg_pattern.trim().split(' ');
	
		if ( !text_pattern_array || ( 0 == text_pattern_array.length ) )
		{
			return;
		}

		text_pattern_array = _.filter( text_pattern_array , function(item)
		{
			return ( item.trim().length >= 2 )
		});
		
		
		text_pattern_array = _.map( text_pattern_array , function(item)
		{
			if ( '??' == item )
			{
				return item;
			}
			else if ( 0 == item.indexOf('0x') )
			{
				return item.substring( 2 , item.length );
			}
			else if ( 0 == item.indexOf('0X') )
			{
				return item.substring( 2 , item.length );
			}
			else
			{
				return item;
			}
		});
		
		bin_pattern_buff = Buffer.alloc( text_pattern_array.length );
		if ( !bin_pattern_buff )
		{
			return;
		}
		
		bin_mask_buff = Buffer.alloc( text_pattern_array.length );
		if ( !bin_mask_buff )
		{
			return;
		}
		
		for ( byte_index = 0; byte_index < text_pattern_array.length; byte_index++ )
		{
			text_value  = text_pattern_array[ byte_index ];
			
			if ( 2 != text_value.length )
			{
				error_text = 'bad pattern';
				break;
			}
			
			if ( '??' == text_value )
			{
				bin_pattern_buff.writeUInt8( 0 , byte_index );
				
				bin_mask_buff.writeUInt8( 0 , byte_index );
			}
			else
			{
				bin_value = parseInt( '0x' + text_value );
			
				bin_pattern_buff.writeUInt8( bin_value , byte_index );
				
				bin_mask_buff.writeUInt8( 1 , byte_index );
			}
		}
	
		param_pattern_buff = bin_pattern_buff;
	
		param_mask_buff = bin_mask_buff;
	}
	else if ( Buffer.isBuffer( arg_pattern ) )
	{
		if ( 0 == arg_pattern.length )
		{
			throw new Error( "empty search pattern" );
		}
		
		param_pattern_buff = bin_pattern_buff;
		
		if ( _.isBuffer( arg_mask ) && ( 0 != arg_mask.length ) )
		{
			param_mask_buff = arg_mask;
		}
		
	}
	else
	{
		throw new Error( "bad search pattern" );
	}
	
	
	if ( error_text )
	{
		if ( bin_pattern_buff )
		{
			bin_pattern_buff.free();
			bin_pattern_buff = null;	
		}
	
		if ( bin_mask_buff )
		{
			bin_mask_buff.free();
			bin_mask_buff = null;
		}
		
	
		throw new Error( error_text );
	}
	
	matched_flag = process.reserved.hostDependBindings.ida_equal_bytes( 
							Number64( arg_address ) ,
							param_pattern_buff ,
							param_mask_buff 
	) ;
	
	
	if ( bin_pattern_buff )
	{
		bin_pattern_buff.free();
		bin_pattern_buff = null;	
	}
	
	if ( bin_mask_buff )
	{
		bin_mask_buff.free();
		bin_mask_buff = null;
	}
		
	
	return matched_flag;
}
exports.match_bytes = match_bytes;





function main(  )
{
	var pattern = '81 E1 FF 3F FF FF'
	
	var matched_address = search_bytes( "0x95C5102A" , "0x95DB7344" , pattern );
	
	printf("search %s \nmatched_address = %s\n" , pattern , matched_address );
	
	
	var matched_flag = match_bytes( matched_address , pattern );
	
	printf("matched_flag %s\n" , matched_flag );
	
	return 0;
}

if ( !module.parent )
{
	main();
}