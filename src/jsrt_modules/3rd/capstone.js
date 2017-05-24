const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const ffi = require("ffi");

const MAX_INS_LENGTH = 100;

const ENUM_TABLE_X86_AVX_BCAST = {
	"X86_AVX_BCAST_INVALID" : 0 ,
	"X86_AVX_BCAST_2" : 1 ,
	"X86_AVX_BCAST_4" : 2 ,
	"X86_AVX_BCAST_8" : 3 ,
	"X86_AVX_BCAST_16" : 4 
};

const ENUM_TABLE_X86_AVX_CC = {
	"X86_AVX_CC_INVALID" : 0 ,
	"X86_AVX_CC_EQ" : 1 ,
	"X86_AVX_CC_LT" : 2 ,
	"X86_AVX_CC_LE" : 3 ,
	"X86_AVX_CC_UNORD" : 4 ,
	"X86_AVX_CC_NEQ" : 5 ,
	"X86_AVX_CC_NLT" : 6 ,
	"X86_AVX_CC_NLE" : 7 ,
	"X86_AVX_CC_ORD" : 8 ,
	"X86_AVX_CC_EQ_UQ" : 9 ,
	"X86_AVX_CC_NGE" : 10 ,
	"X86_AVX_CC_NGT" : 11 ,
	"X86_AVX_CC_FALSE" : 12 ,
	"X86_AVX_CC_NEQ_OQ" : 13 ,
	"X86_AVX_CC_GE" : 14 ,
	"X86_AVX_CC_GT" : 15 ,
	"X86_AVX_CC_TRUE" : 16 ,
	"X86_AVX_CC_EQ_OS" : 17 ,
	"X86_AVX_CC_LT_OQ" : 18 ,
	"X86_AVX_CC_LE_OQ" : 19 ,
	"X86_AVX_CC_UNORD_S" : 20 ,
	"X86_AVX_CC_NEQ_US" : 21 ,
	"X86_AVX_CC_NLT_UQ" : 22 ,
	"X86_AVX_CC_NLE_UQ" : 23 ,
	"X86_AVX_CC_ORD_S" : 24 ,
	"X86_AVX_CC_EQ_US" : 25 ,
	"X86_AVX_CC_NGE_UQ" : 26 ,
	"X86_AVX_CC_NGT_UQ" : 27 ,
	"X86_AVX_CC_FALSE_OS" : 28 ,
	"X86_AVX_CC_NEQ_OS" : 29 ,
	"X86_AVX_CC_GE_OQ" : 30 ,
	"X86_AVX_CC_GT_OQ" : 31 ,
	"X86_AVX_CC_TRUE_US" : 32 
};

const ENUM_TABLE_X86_AVX_RM = {
	"X86_AVX_RM_INVALID" : 0 ,
	"X86_AVX_RM_RN" : 1 ,
	"X86_AVX_RM_RD" : 2 ,
	"X86_AVX_RM_RU" : 3 ,
	"X86_AVX_RM_RZ" : 4 
};



const ENUM_TABLE_X86_OPT_TYPE = {
	"X86_OP_INVALID" : 0 ,
	"X86_OP_REG" : 1 ,
	"X86_OP_IMM" : 2 ,
	"X86_OP_MEM" : 3 ,
	"X86_OP_FP" : 4 
};

const ENUM_TABLE_X86_PREFIX = {
	"X86_PREFIX_LOCK" : 240 ,
	"X86_PREFIX_REP" : 243 ,
	"X86_PREFIX_REPNE" : 242 ,
	"X86_PREFIX_CS" : 46 ,
	"X86_PREFIX_SS" : 54 ,
	"X86_PREFIX_DS" : 62 ,
	"X86_PREFIX_ES" : 38 ,
	"X86_PREFIX_FS" : 100 ,
	"X86_PREFIX_GS" : 101 ,
	"X86_PREFIX_OPSIZE" : 102 ,
	"X86_PREFIX_ADDRSIZE" : 103 
};


const ENUM_TABLE_X86_SSE_CC = {
	"X86_SSE_CC_INVALID" : 0 ,
	"X86_SSE_CC_EQ" : 1 ,
	"X86_SSE_CC_LT" : 2 ,
	"X86_SSE_CC_LE" : 3 ,
	"X86_SSE_CC_UNORD" : 4 ,
	"X86_SSE_CC_NEQ" : 5 ,
	"X86_SSE_CC_NLT" : 6 ,
	"X86_SSE_CC_NLE" : 7 ,
	"X86_SSE_CC_ORD" : 8 ,
	"X86_SSE_CC_EQ_UQ" : 9 ,
	"X86_SSE_CC_NGE" : 10 ,
	"X86_SSE_CC_NGT" : 11 ,
	"X86_SSE_CC_FALSE" : 12 ,
	"X86_SSE_CC_NEQ_OQ" : 13 ,
	"X86_SSE_CC_GE" : 14 ,
	"X86_SSE_CC_GT" : 15 ,
	"X86_SSE_CC_TRUE" : 16 
};


const ENUM_TABLE_CS_ARCH = {
    "CS_ARCH_ARM" : 0 ,
    "CS_ARCH_ARM64" : 1 ,
    "CS_ARCH_MIPS" : 2 ,
    "CS_ARCH_X86" : 3 ,
    "CS_ARCH_PPC" : 4 ,
    "CS_ARCH_SPARC" : 5 ,
    "CS_ARCH_SYSZ" : 6 ,
    "CS_ARCH_XCORE" : 7 ,
    "CS_ARCH_MAX" : 8 ,
    "CS_ARCH_ALL" : 0xFFFF 
};

const ENUM_TABLE_CS_MODE = {
    "CS_MODE_LITTLE_ENDIAN" : 0 ,
    "CS_MODE_ARM" : 0 ,
    "CS_MODE_16" : 1 << 1 ,
    "CS_MODE_32" : 1 << 2 ,
    "CS_MODE_64" : 1 << 3 ,
    "CS_MODE_THUMB" : 1 << 4 ,
    "CS_MODE_MCLASS" : 1 << 5 ,
    "CS_MODE_V8" : 1 << 6 ,
    "CS_MODE_MICRO" : 1 << 4 ,
    "CS_MODE_MIPS3" : 1 << 5 ,
    "CS_MODE_MIPS32R6" : 1 << 6 ,
    "CS_MODE_MIPSGP64" : 1 << 7 ,
    "CS_MODE_V9" : 1 << 4 ,
    "CS_MODE_BIG_ENDIAN" : 1 << 31 ,
    "CS_MODE_MIPS32" : 1 << 2 ,
    "CS_MODE_MIPS64" : 1 << 3 
};

const ENUM_TABLE_CS_ERR = {
    "CS_ERR_OK" : 0 ,
    "CS_ERR_MEM" : 1 ,
    "CS_ERR_ARCH" : 2 ,
    "CS_ERR_HANDLE" : 3 ,
    "CS_ERR_CSH" : 4 ,
    "CS_ERR_MODE" : 5 ,
    "CS_ERR_OPTION" : 6 ,
    "CS_ERR_DETAIL" : 7 ,
    "CS_ERR_MEMSETUP" : 8 ,
    "CS_ERR_VERSION" : 9 ,
    "CS_ERR_DIET" : 10 ,
    "CS_ERR_SKIPDATA" : 11 ,
    "CS_ERR_X86_ATT" : 12 ,
    "CS_ERR_X86_INTEL" : 13 
};

const ENUM_TABLE_CS_OPT_TYPE = {
    "CS_OPT_INVALID" : 0 , 
    "CS_OPT_SYNTAX" : 1 , 
    "CS_OPT_DETAIL" : 2 , 
    "CS_OPT_MODE" : 3 , 
    "CS_OPT_MEM" : 4 , 
    "CS_OPT_SKIPDATA" : 5 , 
    "CS_OPT_SKIPDATA_SETUP" : 6
};

const ENUM_TABLE_CS_OPT_VALUE = {
    "CS_OPT_OFF" : 0 , 
    "CS_OPT_ON" : 1 , 
    "CS_OPT_SYNTAX_DEFAULT" : 2 , 
    "CS_OPT_SYNTAX_INTEL" : 3 , 
    "CS_OPT_SYNTAX_ATT" : 4 , 
    "CS_OPT_SYNTAX_NOREGNAME" : 5 
};

const ENUM_TABLE_CS_OP_TYPE = {
    "CS_OP_INVALID" : 0 , 
    "CS_OP_REG" : 1 , 
    "CS_OP_IMM" : 2 , 
    "CS_OP_MEM" : 3 , 
    "CS_OP_FP" : 4 
};

const ENUM_TABLE_CS_GROUP_TYPE = {
    "CS_GRP_INVALID" : 0 , 
    "CS_GRP_JUMP" : 1 , 
    "CS_GRP_CALL" : 2 , 
    "CS_GRP_RET" : 3 , 
    "CS_GRP_INT" : 4 ,
    "CS_GRP_IRET" : 5 
};


var bindings = ffi.loadAndBatchBind("capstone.dll" , [

	 "UINT __cdecl cs_version( int* major , int* minor );" ,
	 
	 "bool __cdecl cs_support(int query);" ,
	 
	 "ULONG __cdecl cs_open(ULONG arch , ULONG mode , void* phCapstone);" ,
	 
	 "ULONG __cdecl cs_close( void* phCapstone);" ,
	 
	 "ULONG __cdecl cs_option( HANDLE hCapstone , ULONG type , size_t value );" ,
	 
	 "ULONG __cdecl cs_errno( HANDLE hCapstone );" ,
	 
	 "string __cdecl cs_strerror( ULONG code );" ,
	 
	 "size_t __cdecl cs_disasm( HANDLE hCapstone , void* code , size_t code_size , ULONG64 address , size_t count , void** insn );" ,
	 
	 "size_t __cdecl cs_disasm_ex( HANDLE hCapstone , void* code , size_t code_size , ULONG64 address , size_t count , void** insn );" ,
	 
	 "void __cdecl cs_free(HANDLE insn , size_t count );" ,
	 
	 "void* __cdecl cs_malloc( HANDLE hCapstone);" ,
	 
	 "bool __cdecl cs_disasm_iter( HANDLE hCapstone , void** code , size_t* size , ULONG64* address , void* insn);" ,
	 
	 "string __cdecl cs_reg_name( HANDLE hCapstone , UINT reg_id);" ,
	 
	 "string __cdecl cs_insn_name( HANDLE hCapstone , UINT insn_id);" ,
	 
	 "string __cdecl cs_group_name( HANDLE hCapstone , UINT group_id);" ,
	 
	 "bool __cdecl cs_insn_group( HANDLE hCapstone , void* insn , UINT group_id);" ,
	 
	 "bool __cdecl cs_reg_read( HANDLE hCapstone , void* insn , UINT reg_id);\n" ,
	 
	 "bool __cdecl cs_reg_write(HANDLE hCapstone , void* insn , UINT reg_id);" ,
	 
	 "int __cdecl cs_op_count(HANDLE hCapstone , void* insn , UINT op_type);" ,
	 
	 "int __cdecl cs_op_index(HANDLE hCapstone  , void* insn , UINT op_type , UINT position);" 
]);

function findKeyByValue( maskTable , value )
{
    return _.findKey( maskTable , function( item)
    {
        return ( value == item );
    } );
}

function cs_version( )
{
    var param_lpMajor = Buffer.alloc( 4 ).fill(0);
    var param_lpMinor = Buffer.alloc( 4 ).fill(0 );
    var nRet = 0;

    var versionInfo = {};

    nRet = bindings.cs_version( param_lpMajor , param_lpMinor );

    versionInfo.major = param_lpMajor.readUInt32LE(0);
    versionInfo.minor = param_lpMinor.readUInt32LE(0);
	
	param_lpMajor.free();
	param_lpMinor.free();

    return sprintf("%d.%d" , versionInfo.major , versionInfo.minor );
}
exports.version = cs_version();


function cs_open( arg_arch , arg_mode )
{
    var param_arch = 0;
    var param_mode = 0;

    var buffer_param_lpHandle = Buffer.alloc( 8 ).fill(0);
	
    var hCapstone = null;

    var errCode = 0;

    assert( _.has( ENUM_TABLE_CS_ARCH  , arg_arch ) );
    assert( _.has( ENUM_TABLE_CS_MODE  , arg_mode ) );

    param_arch = ENUM_TABLE_CS_ARCH[ arg_arch ];
    param_mode = ENUM_TABLE_CS_MODE[ arg_mode ];

    errCode = bindings.cs_open( param_arch , param_mode , buffer_param_lpHandle );
    if ( ENUM_TABLE_CS_ERR["CS_ERR_OK"] != errCode )
    {
		buffer_param_lpHandle.free();
		buffer_param_lpHandle = null;
		
        throw new Error( cs_strerror( errCode ));
    }


    hCapstone = buffer_param_lpHandle.readPointer();
	buffer_param_lpHandle.free();
	buffer_param_lpHandle = null;

    return hCapstone;
}
exports.open = cs_open;

function cs_close( hCapstone )
{
	var lphCapstone = Buffer.alloc( 8 ).fill(0);
	
	lphCapstone.writePointer( hCapstone );
	
    var errCode = bindings.cs_close( lphCapstone );
	
	lphCapstone.free();
	lphCapstone = null;

    return cs_strerror( errCode );
}
exports.close = cs_close;

function cs_option(  hCapstone , arg_type , arg_value )
{
    var param_type = ENUM_TABLE_CS_OPT_TYPE[ arg_type ];
    var param_value = ENUM_TABLE_CS_OPT_VALUE[ arg_value ];
    var errCode = 0;

    errCode = bindings.cs_option( hCapstone , param_type , param_value );

    return cs_strerror( errCode );
}
exports.setOption = cs_option;

function cs_errno( hCapstone )
{
    var errCode = 0;

    errCode = bindings.cs_errno( hCapstone );

    return cs_strerror( errCode );
}

function cs_strerror( errCode )
{
    return bindings.cs_strerror( errCode );
}

function parse_inst_x86( hCapstone  , lpBuffer , instAddress , instSize )
{
	var instx86 = {};
	var value = '';
	var opindex = 0;

	// Instruction prefix, which can be up to 4 bytes.
	// A prefix byte gets value 0 when irrelevant.
	// prefix[0] indicates REP/REPNE/LOCK prefix (See X86_PREFIX_REP/REPNE/LOCK above)
	// prefix[1] indicates segment override (irrelevant for x86_64):
	// See X86_PREFIX_CS/SS/DS/ES/FS/GS above.
	// prefix[2] indicates operand-size override (X86_PREFIX_OPSIZE)
	// prefix[3] indicates address-size override (X86_PREFIX_ADDRSIZE)
	instx86.prefix = lpBuffer.toArray( 0 , 4 );
	
	// Instruction opcode, which can be from 1 to 4 bytes in size.
	// This contains VEX opcode as well.
	// An trailing opcode byte gets value 0 when irrelevant.
	instx86.opcode = _.filter( lpBuffer.toArray( 4 , 4 + 4 ) , function( item ) 
	{
		return (0 != item);
	});
	
	// REX prefix: only a non-zero value is relevant for x86_64
	instx86.rex = lpBuffer.readUInt8( 8 );
	
	// Address size, which can be overridden with above prefix[5].
	instx86.addr_size = lpBuffer.readUInt8( 9 );
	
	 // ModR/M byte
	instx86.modrm = lpBuffer.readUInt8( 10 );
	
	// SIB value, or 0 when irrelevant.
	instx86.sib = lpBuffer.readUInt8( 11 );
	
	// Displacement value, or 0 when irrelevant.
	instx86.disp = lpBuffer.readUInt32LE( 12 );
	
	// SIB index register, or X86_REG_INVALID when irrelevant.
	value = lpBuffer.readUInt32LE( 16 );
	
	if ( 0 != value )
	{
		instx86.sib_index = bindings.cs_reg_name( hCapstone , value );
	}
	else
	{
		//instx86.sib_index = "X86_REG_INVALID";
	}
	
	// SIB scale. only applicable if sib_index is relevant.
	instx86.sib_scale = lpBuffer.readUInt8( 20 );
	
	// SIB base register, or X86_REG_INVALID when irrelevant
	value = lpBuffer.readUInt32LE( 24 );
	
	if ( 0 != value )
	{
		instx86.sib_base = bindings.cs_reg_name( hCapstone , value );
	}
	else
	{
		//instx86.sib_base = "X86_REG_INVALID";
	}
	
	// SSE Code Condition
	value = lpBuffer.readUInt32LE( 28 );
	if ( 0 != value )
	{
		instx86.sse_cc = findKeyByValue( ENUM_TABLE_X86_SSE_CC , value );
	}
	else
	{
		//instx86.sse_cc = "X86_SSE_CC_INVALID";
	}
	
	// AVX Code Condition
	value = lpBuffer.readUInt32LE( 32 );
	if ( 0 != value )
	{
		instx86.avx_cc = findKeyByValue( ENUM_TABLE_X86_AVX_CC , value );
	}
	else
	{
		//instx86.avx_cc = "X86_AVX_CC_INVALID";
	}
	
	
	// AVX Suppress all Exception
	instx86.avx_sae = ( 0 == lpBuffer.readUInt8( 36 ) ? false : true );
	
	//  AVX static rounding mode
	value = lpBuffer.readUInt32LE( 40 );
	if ( 0 != value )
	{
		instx86.avx_rm = findKeyByValue( ENUM_TABLE_X86_AVX_RM , value );
	}
	else
	{
		//instx86.avx_rm = "X86_AVX_RM_INVALID";
	}
	
	// Number of operands of this instruction,
	// or 0 when instruction has no operand.
	instx86.op_count = lpBuffer.readUInt8( 44 );
	
	instx86.operands = [];
	
	var op_item = null;
	var baseOffset = 0;
	
	for ( opindex = 0; opindex < instx86.op_count; opindex++ )
	{
		op_item = {};
		
		baseOffset = 48 + 48 * opindex;
		
		value = lpBuffer.readUInt32LE( baseOffset + 0x00 );
		op_item.type = findKeyByValue( ENUM_TABLE_X86_OPT_TYPE , value );
		
		if ( "X86_OP_REG" == op_item.type )
		{
			value = lpBuffer.readUInt32LE( baseOffset + 0x08 );
			op_item.reg = bindings.cs_reg_name( hCapstone , value);
		}
		else if ( "X86_OP_IMM" == op_item.type )
		{
			op_item.imm  = {};
			
			op_item.imm.value = lpBuffer.readUInt64LE( baseOffset + 0x08 );
			
			op_item.imm.imm8 = lpBuffer.readInt8( baseOffset + 0x08 );
			op_item.imm.uimm8 = lpBuffer.readUInt8( baseOffset + 0x08 );
			
			op_item.imm.imm16 = lpBuffer.readInt16LE( baseOffset + 0x08 );
			op_item.imm.uimm16 = lpBuffer.readUInt16LE( baseOffset + 0x08 );
			
			op_item.imm.imm32 = lpBuffer.readInt32LE( baseOffset + 0x08 );
			op_item.imm.uimm32 = lpBuffer.readUInt32LE( baseOffset + 0x08 );
			
			op_item.imm.imm64 = lpBuffer.readInt64LE( baseOffset + 0x08 );
			op_item.imm.uimm64 = lpBuffer.readUInt64LE( baseOffset + 0x08 );

		}
		else if ( "X86_OP_MEM" == op_item.type )
		{
			op_item.mem = {};
			
			// segment
			value = lpBuffer.readUInt32LE( baseOffset + 0x08 );
			if ( 0 == value )
			{
				//op_item.mem.segment = "X86_REG_INVALID";
			}
			else
			{
				op_item.mem.segment = bindings.cs_reg_name( hCapstone , value );
			}
			
			// base
			value = lpBuffer.readUInt32LE( baseOffset + 0x08 + 0x04 );
			if ( 0 == value )
			{
				//.mem.base = "X86_REG_INVALID";
			}
			else
			{
				op_item.mem.base = bindings.cs_reg_name( hCapstone , value );
			}
			
			// index
			value = lpBuffer.readUInt32LE( baseOffset + 0x08 + 0x08 );
			if ( 0 == value )
			{
				//op_item.mem.index = "X86_REG_INVALID";
			}
			else
			{
				op_item.mem.index = bindings.cs_reg_name( hCapstone , value );
			}
			
			op_item.mem.scale = lpBuffer.readInt32LE( baseOffset + 0x08 + 0x0C );
			
			op_item.mem.disp = lpBuffer.readUInt64LE( baseOffset + 0x08 + 0x10 );
		}
		else if ( "X86_OP_FP" == op_item.type )
		{
			op_item.fp = lpBuffer.readDoubleLE( baseOffset + 0x08 );
		}
		
		// size -> 32
		// size of this operand (in bytes).
		op_item.size = lpBuffer.readUInt8( baseOffset + 32 );
		
		// avx_bcast -> 36
		value = lpBuffer.readUInt32LE( baseOffset + 36 );
		if ( 0 != value )
		{
			op_item.avx_bcast = findKeyByValue( ENUM_TABLE_X86_AVX_BCAST , value );
		}
		
		// avx_zero_opmask -> 40
		// AVX zero opmask {z}
		op_item.avx_zero_opmask = lpBuffer.readUInt8( baseOffset + 40 ) ? true : false;
		
		instx86.operands.push( op_item );
	}
	
	if ( ( 0 != instx86.operands.length ) && ( "X86_OP_IMM" == instx86.operands[0].type ) )
    {
        instx86.relAddr = instx86.operands[0].imm;
    }
    else
    {
        instx86.relAddr = Number64( instAddress );
        instx86.relAddr.add( instSize );
		
        instx86.relAddr.add( instx86.disp );
    }
	
	
	return instx86;
}


function parse_inst_detail( hCapstone  , lpDetailBuffer , instAddress , instSize  )
{
	var instDetail = {};
	
	var regs_read_count = 0;
	var regs_read = [];
	
	var regs_write_count = 0;
	var regs_write = [];
	
	var groups_count = 0;
	var groups = [];
	
	// list of implicit registers read by this insn
	regs_read_count = lpDetailBuffer.readUInt8( 12 );
	if ( 0 == regs_read_count )
	{
		instDetail.regs_read = [];
	}
	else
	{
		regs_read = lpDetailBuffer.toArray( 0 , 0 + Math.min( 12 , regs_read_count ) );
		
		instDetail.regs_read = _.map( regs_read , function(item) 
		{
			return bindings.cs_reg_name( hCapstone , item );
		});
	}
	
	// list of implicit registers modified by this insn
	regs_write_count = lpDetailBuffer.readUInt8( 33 );
	if ( 0 == regs_write_count )
	{
		instDetail.regs_write = [];
	}
	else
	{
		regs_write = lpDetailBuffer.toArray( 13 , 13 + Math.min( 20 , regs_write_count ) );
		
		instDetail.regs_write = _.map( regs_write , function(item) 
		{
			return bindings.cs_reg_name( hCapstone , item );
		});
	}
	
	// list of group this instruction belong to
	groups_count = lpDetailBuffer.readUInt8( 41 );
	if ( 0 == groups_count )
	{
		instDetail.groups = [];
	}
	else
	{
		groups = lpDetailBuffer.toArray( 34 , 34 + Math.min( 8 , groups_count ) );
		
		instDetail.groups = _.map( groups , function(item) 
		{
			return bindings.cs_group_name( hCapstone , item );
		});
	}
	
	// Architecture-specific instruction info
	

	var lpBufferx86 = Buffer.attachUnsafe( lpDetailBuffer.address.add( 48 ) , 432 );
	

	instDetail.x86 = parse_inst_x86( hCapstone , lpBufferx86 , instAddress , instSize );
	
	lpBufferx86 = null;
	
	return instDetail;
}


function cs_disasm_internal( hCapstone , codeBuffer , codeLength , codeBase )
{
	var param_lppInsn = Buffer.alloc( 8 ).fill( 0 );
	var disCount = 0;
	var instNode = null;
	
	var lpInsnAddress = null;
	var lpInsnBuffer = null;
	
	var lpDetailAddress = null;
	var lpDetailBuffer = null;
	
	var value = '';
	
	do
	{ 
		disCount = bindings.cs_disasm( hCapstone , codeBuffer , codeLength , codeBase , 1 , param_lppInsn);
		if ( 0 == disCount )
		{
			break;
		}
		
		lpInsnAddress = param_lppInsn.readPointer(0);
		if ( lpInsnAddress.isZero() )
		{
			break;
		}
		
		if ( 'x64' == process.arch )
		{
			lpInsnBuffer = Buffer.attachUnsafe( lpInsnAddress , 240 );
		}
		else
		{
			lpInsnBuffer = Buffer.attachUnsafe( lpInsnAddress , 232 );
		}
		
		instNode = {};
		
		// Address (EIP) of this instruction
		instNode.address = lpInsnBuffer.readUInt64LE( 0x08 );
	
		// Size of this instruction
		instNode.size = lpInsnBuffer.readUInt16LE( 0x10 );
		
		// Machine bytes of this instruction
        instNode.bytes =  lpInsnBuffer.toArray(0x12 , 0x12 + instNode.size );
		
		// Ascii text of instruction mnemonic
		instNode.mnemonic =  lpInsnBuffer.toString( 'ascii' , 34 , 34 + 32 );
		
		// Ascii text of instruction operands
		value = lpInsnBuffer.toString( 'ascii' , 66 , 66 + 160 );
		instNode.op_str =  value.split( ',' ).join(" ,");
		
		if ( 'x64' == process.arch )
		{
			lpDetailAddress = lpInsnBuffer.readPointer( 0xE8 );
		}
		else
		{
			lpDetailAddress = lpInsnBuffer.readPointer( 0xE4 );
		}
		
		
		if ( !lpDetailAddress.isZero() )
		{
			lpDetailBuffer = Buffer.attachUnsafe( lpDetailAddress , 480 );
			
			// parse detail
			instNode.detail = parse_inst_detail( hCapstone , lpDetailBuffer , instNode.address , instNode.size );
		}
		

	}while(false);
	
	
	param_lppInsn.free();
	param_lppInsn = null;
	
	if ( lpInsnAddress )
	{
		bindings.cs_free( lpInsnAddress , 1 );
		lpInsnAddress = null;
	}
	
	
	lpInsnBuffer = null;
	
	lpDetailAddress = null;
	lpDetailBuffer = null;
	
	return instNode;
}



function cs_disasm( hCapstone , arg_code , arg_BaseAddress , arg_instNumber , arg_callback )
{
	var codeBuffer = null;
	var baseAddress = 0;
	var instNumber = 1;
	var callback = null;
	
	var codeBufferNeedFree = false;
	
	assert( ( arguments.length >= 2 ) , "invalid arguments" );
	
	if ( arguments.length >= 3 )
	{
		if ( !_.isFunction( arguments[2] ) )
		{
			baseAddress = Number64( arguments[2] );
		}
	}
	
	if ( arguments.length >= 4 )
	{
		if ( _.isNumber( arguments[3] ) )
		{
			instNumber =  arguments[3] ;
		}
	}
	
	if ( _.isFunction( arguments[ arguments.length - 1] ) )
	{
		callback = arguments[ arguments.length - 1];
	}
	
	if ( _.isString( arg_code ) )
	{
		codeBuffer = Buffer.from( arg_code , "hex" );
		codeBufferNeedFree = true;
	}
	else if ( Array.isArray( arg_code ) )
	{
		codeBuffer = Buffer.from( arg_code );
		codeBufferNeedFree = true;
	}
	else if ( Buffer.isBuffer( arg_code ) )
	{
		codeBuffer = arg_code;
	}
	else
	{
		throw new Error(sprintf("unknown type of code") );
	}
	
	var codeOffset = 0;
	var nextCodeOffset = 0;
	
	var frameCode = Buffer.alloc( Math.min( MAX_INS_LENGTH , codeBuffer.length ) );
	var frameBase = 0;
	var frameLength = 0;
	
	var instNode = null;
	var instArray = [];
	var instCount = 0;
	
	for ( codeOffset = 0; codeOffset < codeBuffer.length; codeOffset = nextCodeOffset )
	{
		frameCode.fill(0);
		
		frameLength = Math.min( MAX_INS_LENGTH , codeBuffer.length - codeOffset );
		
		codeBuffer.copy( frameCode , 0 , codeOffset ,  codeOffset + frameLength );
		
		frameBase = Number64( baseAddress );
		frameBase.add( codeOffset );
		
		instNode = cs_disasm_internal( hCapstone , frameCode , frameLength ,  frameBase );
		if ( !instNode )
		{
			break;
		}
		
		instCount++;
		
		if ( callback )
		{
			callback( instNode );
		}
		else
		{
			instArray.push( instNode );
		}
		
		if ( instCount >= instNumber )
		{
			break;
		}
		
		nextCodeOffset = codeOffset + instNode.size;
		
		frameBase = null;
	}

	if ( codeBufferNeedFree )
	{
		if ( codeBuffer )
		{
			codeBuffer.free();
			codeBuffer = null;
		}
	}
	
	if ( frameCode )
	{
		frameCode.free();
		frameCode = null;
	}
	
	if ( callback )
	{
		return;
	}
	else
	{
		return instArray;
	}
}
exports.disasm = cs_disasm;





function main(  )
{
	var capstone = exports;


	var xxText = "8BFF";
    
	var hCapstone = capstone.open( "CS_ARCH_X86" , "CS_MODE_32" );
	
	capstone.setOption(hCapstone , "CS_OPT_DETAIL" , "CS_OPT_ON" );
	
	var insts = capstone.disasm( hCapstone , xxText , 0x1000000 );
	
	printf( insts );
	
	capstone.close( hCapstone );

	return 0;
}

if ( !module.parent )
{
	main();
}