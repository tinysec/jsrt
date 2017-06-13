
const assert = require("assert");
const _ = require("underscore");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;

const path = require("path");

const O_APPEND = 0x0008;
const O_CREAT = 0x0100;
const O_EXCL = 0x0400;
const O_RDONLY = 0x0000;
const O_RDWR = 0x0002;
const O_TRUNC = 0x0200;
const O_WRONLY = 0x0001;

const O_BINARY = 0x8000;

const S_IFMT = 0xF000;
const S_IFDIR = 0x4000;

const S_IREAD = 0x100;
const S_IWRITE = 0x80;



// 100 MB
const MAX_READED_FILE_SIZE = 1024 * 1024 * 100;

function stringToFlags(flag) 
{
  if (typeof flag === 'number') 
  {
    return flag;
  }

  switch (flag) 
  {
    case 'r' : return O_RDONLY | O_BINARY;
    case 'rs' : // Fall through.
    case 'sr' : return O_RDONLY | O_BINARY ;
    case 'r+' : return O_RDWR | O_BINARY;
    case 'rs+' : // Fall through.
    case 'sr+' : return O_RDWR | O_BINARY ;

    case 'w' : return O_TRUNC | O_CREAT | O_WRONLY | O_BINARY;
    case 'wx' : // Fall through.
    case 'xw' : return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL | O_BINARY;

    case 'w+' : return O_TRUNC | O_CREAT | O_RDWR | O_BINARY;
    case 'wx+': // Fall through.
    case 'xw+': return O_TRUNC | O_CREAT | O_RDWR | O_EXCL | O_BINARY;

    case 'a' : return O_APPEND | O_CREAT | O_WRONLY | O_BINARY;
    case 'ax' : // Fall through.
    case 'xa' : return O_APPEND | O_CREAT | O_WRONLY | O_EXCL | O_BINARY;

    case 'a+' : return O_APPEND | O_CREAT | O_RDWR | O_BINARY;
    case 'ax+': // Fall through.
    case 'xa+': return O_APPEND | O_CREAT | O_RDWR | O_EXCL | O_BINARY;
  }

  throw new Error('Unknown file open flag: ' + flag);
}

function modeNum(m, def) 
{
  if (typeof m === 'number')
    return m;

  if (typeof m === 'string')
    return parseInt(m, 8);

  if (def)
    return modeNum(def);

  return undefined;
}

function fs_open( arg_name , arg_flag , arg_mode ) 
{
	var fd = 0;

	var param_name = '';
	var param_flag = O_RDONLY | O_BINARY;
	var param_mode = S_IREAD ;
	
	assert( arguments.length >= 1 );
		
	param_name = arg_name;

	if ( 0 == param_name.length )
	{
		return 0;
	}

	if ( arguments.length >= 2 )
	{
		assert( _.isString( arguments[1] ) );

		param_flag = stringToFlags( arguments[1] );
	}
	
	if ( arguments.length >= 3 )
	{
		param_mode = modeNum( arguments[2] , S_IREAD  );
	}

	return process.reserved.bindings.fs_open( param_name , param_flag , param_mode );
}
exports.open = fs_open;

function fs_close( fd ) 
{
	assert( _.isNumber(fd) , "invalid fd" );
	assert(  (fd > 0) , "invalid fd" );

	return process.reserved.bindings.fs_close( fd );
}
exports.close = fs_close;

function fs_seek( fd , arg_fileoffset , arg_origin ) 
{
	var param_origin = 0; // SEEK_SET

	assert( _.isNumber(fd) , "invalid fd" );
	assert( fd > 0 , sprintf("fd = %d" , fd ) );
	
	assert( _.isNumber(arg_fileoffset) || Number64.isNumber64( arg_fileoffset ) , sprintf("invalid arg_fileoffset") );
		
	if ( arguments.length >= 3 )
	{
		assert( _.isString( arguments[2] ) );
		
		if ( "SEEK_SET" == arguments[2] )
		{
			param_origin = 0;
		}
		else if ( "SEEK_CUR" == arguments[2] )
		{
			param_origin = 1;
		}
		else if ( "SEEK_END" == arguments[2] )
		{
			param_origin = 2;
		}
	}

	return Number64( process.reserved.bindings.fs_seek( fd , arg_fileoffset , param_origin ) );
}
exports.seek = fs_seek;

function fs_tell( fd  ) 
{
	assert( _.isNumber(fd) );
	assert(  (fd > 0) , "invalid fd" );

	return Number64( process.reserved.bindings.fs_tell( fd  ) );
}
exports.tell = fs_tell;

function fs_fstat( fd  ) 
{
	assert( _.isNumber(fd) , "invalid fd"  );
	assert(  (fd > 0) , "invalid fd" );

	var nativeStat = process.reserved.bindings.fs_fstat( fd  );
	if ( !nativeStat )
	{
		return null;
	}
	
	var stats = {};

	stats.dev = nativeStat.st_dev;
	stats.ino = nativeStat.st_ino;
	stats.mode = nativeStat.st_mode;
	stats.nlink = nativeStat.st_nlink;
	stats.uid = nativeStat.st_uid;
	stats.gid = nativeStat.st_gid;
	stats.rdev = nativeStat.st_rdev;

	stats.size = Number64( nativeStat.st_size );

	stats.atime = new Date( nativeStat.st_atime * 1000 );
	stats.mtime = new Date( nativeStat.st_mtime * 1000 );
	stats.ctime = new Date( nativeStat.st_ctime * 1000 );

	stats.isFolder = ( S_IFDIR == ( stats.mode & S_IFDIR) );


	return stats;
}
exports.fstat = fs_fstat;

function fs_read( fd , arg_buffer , arg_buffer_start , arg_buffer_length , arg_file_position )
{
	var param_buffer_address = 0;

	var readSize = 0;

	assert( arguments.length == 5 );
	
	assert( _.isNumber( fd ) , "invalid fd"  );

	assert( Buffer.isBuffer( arg_buffer ) );

	assert( _.isNumber( arg_buffer_start ) );

	assert( _.isNumber( arg_buffer_length ) );
	
	assert( _.isNumber( arg_file_position ) || Number64.isNumber64( arg_file_position ) );

	assert( ( arg_buffer_start >= 0) && ( arg_buffer_start <= arg_buffer.length )  );
	
	assert( ( arg_buffer_length >= 0) && ( arg_buffer_length <= arg_buffer.length )  );

	assert( ( arg_buffer_start + arg_buffer_length <= arg_buffer.length ) );

	assert(  ( arg_file_position >= 0 ) , sprintf("arg_file_position must >=0 , but %d\n" , arg_file_position ) );

	if ( 0 == arg_buffer_length )
	{	
		return 0;
	}

	param_buffer_address = arg_buffer.address.add( arg_buffer_start );

	fs_seek( fd , arg_file_position , "SEEK_SET" );
		
	readSize = process.reserved.bindings.fs_read( fd , param_buffer_address , arg_buffer_length );

	return readSize;
}
exports.read = fs_read;

function helper_fs_write( fd , arg_buffer , arg_buffer_start , arg_buffer_length , arg_file_position )
{
	var param_buffer_address = 0;

	var writedSize = 0;

	assert( arguments.length == 5 );
	
	assert( _.isNumber( fd ) , "invalid fd"  );

	assert( Buffer.isBuffer( arg_buffer ) );
	assert( _.isNumber( arg_buffer_start ) );
	assert( _.isNumber( arg_buffer_length ) );
	
	assert( ( _.isNumber( arg_file_position ) || Number64.isNumber64( arg_file_position ) ) );

	assert( ( arg_buffer_start >= 0) && ( arg_buffer_start <= arg_buffer.length )  );
	
	assert( ( arg_buffer_length >= 0) && ( arg_buffer_length <= arg_buffer.length )  );

	assert( ( arg_buffer_start + arg_buffer_length <= arg_buffer.length ) );

	assert( (  arg_file_position >= 0 ) );


	if( 0 == arg_buffer_length )
	{	
		return 0;
	}

	param_buffer_address = arg_buffer.address.add( arg_buffer_start );

	fs_seek( fd , arg_file_position , "SEEK_SET" );

	writedSize = process.reserved.bindings.fs_write( fd , param_buffer_address , arg_buffer_length );

	return writedSize;
}

function fs_write( fd  )
{
	var param_buffer = 0;
	var param_buffer_start = 0;
	var param_buffer_length = 0;
	var param_file_position = 0;

	var param_encoding = "utf8";

	var writedSize = 0;
	
	assert( _.isNumber( fd ) , "invalid fd"  );
	assert(  (fd > 0) , "invalid fd" );

	assert( arguments.length >= 2 );

	if ( Buffer.isBuffer( arguments[1] ) )
	{
		param_buffer = arguments[1];
		
		if ( arguments.length >= 3 )
		{
			param_buffer_start = arguments[2];
		}

		if ( arguments.length >= 4 )
		{
			param_buffer_length = arguments[3];
		}

		if ( arguments.length >= 5 )
		{
			param_file_position = arguments[4];
		}
		
		writedSize = helper_fs_write( fd , param_buffer , param_buffer_start , param_buffer_length , param_file_position );
	}
	else if ( _.isStrng( arguments[1] ) )
	{
		if ( arguments.length >= 3 )
		{
			param_file_position = arguments[2];
		}
		
		if ( arguments.length >= 4 )
		{
			param_encoding = arguments[3];
		}

		param_buffer = Buffer.from( arguments[1] , param_encoding );
		param_buffer_start = 0;
		param_buffer_length = param_buffer.length;
		
		writedSize = helper_fs_write( fd , param_buffer , param_buffer_start , param_buffer_length , param_file_position );

		param_buffer.free();
		param_buffer = null;
	}
	else
	{
		throw new Error("invalid usage");
	}

	return writedSize;
}
exports.write = fs_write;

function fs_appendFile( arg_fd_or_name  )
{
	var param_fd = 0;

	var param_buffer = 0;

	var param_encoding = "utf-8";

	var writedSize = 0;

	var param_file_position = 0;

	assert( ( arguments.length >= 2  ) , "invalid length" );

	if ( _.isNumber( arguments[0] ) )
	{
		param_fd = arg_fd_or_name;
	}
	else if ( _.isString( arguments[0] ) )
	{
		param_fd = fs_open( arguments[0] , "a+" , S_IREAD | S_IWRITE );

		if ( param_fd <= 0 )
		{
			throw new Error(sprintf("open %s faild" , arguments[0] ));
		}
	}

	assert( ( param_fd > 0) , sprintf("fd is invalid = %d" , param_fd) );

	if ( Buffer.isBuffer( arguments[1] ) )
	{
		param_buffer = arguments[1];
		
		param_file_position = fs_seek( param_fd , 0 , "SEEK_END" );
		
		writedSize = helper_fs_write( param_fd , param_buffer , 0 , param_buffer.length , param_file_position );
	}
	else if ( _.isString( arguments[1] ) )
	{
		if ( arguments.length >= 3 )
		{
			param_encoding = arguments[2];
		}

		param_file_position = fs_seek( param_fd , 0 , "SEEK_END" );
		
		param_buffer = Buffer.from( arguments[1] , param_encoding );
		
		writedSize = helper_fs_write( param_fd , param_buffer , 0 , param_buffer.length , param_file_position );

		param_buffer.free();
		param_buffer = null;
	}
	else
	{
		throw new Error("invalid usage");
	}
		
	if ( _.isString( arguments[0] ) )
	{
		fs_close( param_fd );
	}

	return writedSize;
}
exports.appendFile = fs_appendFile;


function fs_readFile( arg_fd_or_name  )
{
	var param_fd = 0;
	var need_close_fd = 0;

	var param_buffer = 0;
	var param_encoding = "utf-8";

	var readedSize = 0;
	var stats = null;
	var fileSize = 0;

	var fileContent = null;

	assert( arguments.length >= 1 );

	if ( arguments.length >= 2 )
	{
		assert( _.isString( arguments[1] ) );
	}

	if ( _.isNumber( arguments[0] ) )
	{
		param_fd = arg_fd_or_name;
	}
	else if ( _.isString( arguments[0] ) )
	{
		param_fd = fs_open( arguments[0] , "r" , S_IREAD );
		
		if ( param_fd <= 0 )
		{
			throw new Error(sprintf("open %s faild" , arguments[0] ));
		}
	}

	stats = fs_fstat( param_fd );
	if ( !stats )
	{
		if ( _.isString( arguments[0] ) )
		{
			fs_close( param_fd );
		}
	
		throw new Error(sprintf("get file stats faild") );
	}

	fileSize = stats.size.toUInt32LE();

	if ( 0 == fileSize )
	{
		if ( arguments.length >= 2 )
		{
			return "";
		}
		
		if ( _.isString( arguments[0] ) )
		{
			fs_close( param_fd );
		}
		
		throw new Error("the file is empty");
	}
	
	param_buffer = Buffer.alloc( fileSize );
	if ( !param_buffer )
	{
		if ( _.isString( arguments[0] ) )
		{
			fs_close( param_fd );
		}
		
		return '';
	}

	readedSize = fs_read( param_fd , param_buffer , 0 , param_buffer.length , 0 );
	if ( 0 == readedSize )
	{
		param_buffer.free();

		if ( arguments.length >= 2 )
		{
			return "";
		}
		
		if ( _.isString( arguments[0] ) )
		{
			fs_close( param_fd );
		}

		throw new Error(sprintf("read file faild "  , fileSize  ));
	}
	
	if ( _.isString( arguments[0] ) )
	{
		fs_close( param_fd );
	}

	if ( arguments.length >= 2 )
	{
		assert( _.isString( arguments[1] ) );

		param_encoding = arguments[1];
		
		fileContent = param_buffer.toString( param_encoding , 0 ,  readedSize );

		param_buffer.free();

		return fileContent;
	}
	else
	{
		fileContent = param_buffer.slice( 0 , readedSize );

		param_buffer.free();
		
		return fileContent;
	}
}
exports.readFile = fs_readFile;


function fs_writeFile( arg_fd_or_name  )
{
	var param_fd = 0;

	var param_buffer = 0;

	var param_encoding = "utf-8";

	var writedSize = 0;

	assert( arguments.length >= 2 , "invalid arguments" );

	if ( arguments.length >= 3 )
	{
		assert( _.isString( arguments[2] ) , "arguments 2 must be string as encoding or nothing" );
		
		param_encoding = arguments[2];
	}

	if ( _.isNumber( arguments[0] ) )
	{
		param_fd = arg_fd_or_name;
	}
	else if ( _.isString( arguments[0] ) )
	{
		param_fd = fs_open( arguments[0] , "w" , S_IWRITE );
		
		if ( param_fd <= 0 )
		{
			throw new Error(sprintf("open %s faild" , arguments[0] ));
		}
	}
	
	if ( _.isString( arguments[1] ) )
	{
		param_buffer = Buffer.from( arguments[1] , param_encoding );
	}
	else if ( _.isBuffer( arguments[1] ) )
	{
		param_buffer = arguments[1];
	}
	else
	{
		if ( _.isString( arguments[0] ) )
		{
			fs_close( param_fd );
		}
		
		throw new Error("invalid arguments 1" );
	}
	
	writedSize = helper_fs_write( param_fd , param_buffer , 0 , param_buffer.length , 0 );
	
	if ( _.isString( arguments[0] ) )
	{
		fs_close( param_fd );
		param_fd = 0;
	}
	
	if ( _.isString( arguments[1] ) )
	{
		param_buffer.free();
		param_buffer = null;
	}
	
	return writedSize;
}
exports.writeFile = fs_writeFile;


// by name interface
function fs_stat( arg_path ) 
{
	assert( _.isString( arg_path) );
	
	var param_path = path.normalize( arg_path );
	
	var stats = {};
	var nativeStat = null;
	
	nativeStat = process.reserved.bindings.fs_stat( param_path );

	stats.dev = nativeStat.st_dev;
	stats.ino = nativeStat.st_ino;
	stats.mode = nativeStat.st_mode;
	stats.nlink = nativeStat.st_nlink;
	stats.uid = nativeStat.st_uid;
	stats.gid = nativeStat.st_gid;
	stats.rdev = nativeStat.st_rdev;

	stats.size = Number64( nativeStat.st_size );

	stats.atime = new Date( nativeStat.st_atime * 1000 );
	stats.mtime = new Date( nativeStat.st_mtime * 1000 );
	stats.ctime = new Date( nativeStat.st_ctime * 1000 );

	stats.isFolder = ( S_IFDIR == ( stats.mode & S_IFDIR) );	
	
	return stats;
}
exports.stat = fs_stat;

function fs_exists( arg_path )
{
	assert( _.isString( arg_path) , "path must be string" );
	
	var param_path = path.normalize( arg_path );
	
	if ( path.existsFolder( param_path ) )
	{
		return true;
	}
	else if ( path.existsFile( param_path ) )
	{
		return true;
	}
	
	return false;
}
exports.exists = fs_exists;


function fs_mkdir( arg_path )
{
	assert( _.isString( arg_path) , "path must be string" );
	
	var param_path = path.normalize( arg_path );
	var folderArray = [ param_path ];
	var flag = 0;
	var index = 0;
	var finalFlag = false;
	
	if ( path.existsFolder(param_path) )
	{
		throw new Error(sprintf("%s already exists" , arg_path ) );
	}

	while( true )
	{
		param_path = path.dirname( param_path);
		
		if ( path.isRoot( param_path ) ) 
		{
			break;
		}
		
		folderArray.push( param_path );
	}
	
	folderArray = _.filter( folderArray , function(item)
	{
		return !path.existsFolder(item);
	});
	
	folderArray.reverse();
	
	finalFlag = true;
	for ( index = 0; index < folderArray.length; index++ )
	{
		flag = process.reserved.bindings.fs_mkdir( folderArray[index] ) ;
		if ( !flag )
		{
			finalFlag = false;
			break;
		}
	}

	return finalFlag;
}
exports.mkdir = fs_mkdir;

function fs_unlink( arg_path )
{
	assert( _.isString( arg_path) , "path must be string" );
	
	var param_path = path.normalize( arg_path );
	
	return process.reserved.bindings.fs_unlink( param_path ) ;
}
exports.unlink = fs_unlink;
exports.rmfile = fs_unlink;

function fs_readdir( arg_path )
{
	assert( _.isString( arg_path) , "path must be string" );
	
	var param_path = path.normalize( arg_path );
	
	if ( !path.existsFolder(param_path) )
	{
		throw new Error(sprintf("folder %s is not exists" , arg_path ) );
	}
	
	param_path = path.removeBackslash( param_path ) + "\\*.*";
	
	var helper = process.reserved.bindings.fs_readdir( param_path ) ;
	if ( !helper )
	{
		return [];
	}
		
	return helper;
}
exports.readdir = fs_readdir;

function fs_copyFile( arg_src , arg_dest , arg_failIfExist )
{
	assert( _.isString( arg_src) , "path must be string" );
	assert( _.isString( arg_dest) , "path must be string" );
	
	var param_src = path.normalize( arg_src );
	var param_dest = path.normalize( arg_dest );
	
	var baseDest = path.dirname( param_dest );
	if ( !fs_exists( baseDest ) )
	{
		if ( !fs_mkdir( baseDest ) )
		{
			return false;
		}
	}
	
	return process.reserved.bindings.fs_copyFile( param_src , param_dest , arg_failIfExist || false );
}
exports.copyFile = fs_copyFile;

function fs_moveFile( arg_src , arg_dest  )
{
	assert( _.isString( arg_src) , "path must be string" );
	assert( _.isString( arg_dest) , "path must be string" );
	
	var param_src = path.normalize( arg_src );
	var param_dest = path.normalize( arg_dest );
	
	return process.reserved.bindings.fs_moveFile( param_src , param_dest );
}
exports.moveFile = fs_moveFile;
exports.rename = fs_moveFile;


function recu_fs_rmdir( baseFolder )
{
	var nameArray = fs_readdir( baseFolder );
	var index = 0;
	var item = '';
	var stats = null;
	
	if ( 0 == nameArray.length )
	{
		return process.reserved.bindings.fs_rmdir( baseFolder ) ;
	}
	
	for ( index = 0; index < nameArray.length; index++ )
	{
		item = path.combine( baseFolder , nameArray[index] );
		
		stats = fs_stat( item );
		if ( stats.isFolder )
		{
			recu_fs_rmdir( item );
		}
		else
		{
			fs_unlink( item );
		}
	}
	
	return process.reserved.bindings.fs_rmdir( baseFolder ) ;
}


function fs_rmdir( arg_path )
{
	assert( _.isString( arg_path) , "path must be string" );
	
	var param_path = path.normalize( arg_path );

	if ( !path.existsFolder(param_path) )
	{
		throw new Error(sprintf("%s is not exists" , arg_path ) );
	}

	return recu_fs_rmdir( param_path );
}
exports.rmdir = fs_rmdir;


function main(  )
{
	return 0;
}

if ( !module.parent )
{
	main();
}