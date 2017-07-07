const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;

const path = require("path");
const fs = require("fs");




function fd_read_IMAGE_DOS_HEADER( fd )
{
	var ioBuffer = Buffer.alloc( 0x40 ).fill(0);
	var bytesRead = 0;
	
	var dosHeader = null;
	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 0x40 , 0 );
		if ( 0x40 != bytesRead )
		{
			break;
		}
		
		dosHeader = {};
		dosHeader.e_magic = ioBuffer.readUInt16LE( 0x00 );
		
		dosHeader.e_cblp = ioBuffer.readUInt16LE( 0x002  );
		
		dosHeader.e_cp = ioBuffer.readUInt16LE( 0x004  );
		
		dosHeader.e_crlc = ioBuffer.readUInt16LE( 0x006  );
		
		dosHeader.e_cparhdr = ioBuffer.readUInt16LE( 0x008  );
		
		dosHeader.e_minalloc = ioBuffer.readUInt16LE( 0x00a  );
		
		dosHeader.e_maxalloc = ioBuffer.readUInt16LE( 0x00c  );
		
		dosHeader.e_ss = ioBuffer.readUInt16LE( 0x00e  );
		
		dosHeader.e_sp = ioBuffer.readUInt16LE( 0x010  );
		
		dosHeader.e_csum = ioBuffer.readUInt16LE( 0x012  );
		
		dosHeader.e_ip = ioBuffer.readUInt16LE( 0x014  );
		
		dosHeader.e_cs = ioBuffer.readUInt16LE( 0x016  );
		
		dosHeader.e_lfarlc = ioBuffer.readUInt16LE( 0x018  );
		
		dosHeader.e_ovno = ioBuffer.readUInt16LE( 0x01a  );
		
		dosHeader.e_res = ioBuffer.readUInt16LEArray( 0x01c , 4 ); //
		
		dosHeader.e_oemid = ioBuffer.readUInt16LE( 0x024  );
		
		dosHeader.e_oeminfo = ioBuffer.readUInt16LE( 0x026  );
		
		dosHeader.e_res2 = ioBuffer.readUInt16LEArray( 0x028 , 10 ); // 
		
		dosHeader.e_lfanew = ioBuffer.readInt32LE( 0x03c  );

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return dosHeader;
}

function fd_read_IMAGE_FILE_HEADER( fd , e_lfanew )
{
	var ioBuffer = Buffer.alloc( 0x14 ).fill(0);
	var bytesRead = 0;
	
	var fileHeader = null;
	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 0x14 , e_lfanew + 4 );
		if ( 0x14 != bytesRead )
		{
			break;
		}
		
		fileHeader = {};
		fileHeader.Machine = ioBuffer.readUInt16LE( 0x00 );
		
		fileHeader.NumberOfSections = ioBuffer.readUInt16LE( 0x002  );
		
		fileHeader.TimeDateStamp = ioBuffer.readUInt32LE( 0x004  );
		
		fileHeader.PointerToSymbolTable = ioBuffer.readUInt32LE( 0x008  );
		
		fileHeader.NumberOfSymbols = ioBuffer.readUInt32LE( 0x00c   );
		
		fileHeader.SizeOfOptionalHeader = ioBuffer.readUInt16LE( 0x010   );
		
		fileHeader.Characteristics = ioBuffer.readUInt16LE( 0x012   );
		
	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return fileHeader;
}

function fd_read_IMAGE_DATA_DIRECTORY_array( fd ,  e_lfanew , arch )
{
	var ioBuffer = Buffer.alloc( 8 ).fill(0);
	var bytesRead = 0;
	
	var imageDataDirectory = null;
	
	var imageDataDirectoryArray = [];
	var index = 0;
	
	do
	{
		for ( index = 0; index < 16; index++ )
		{
			ioBuffer.fill(0);
			
			if ( 'x64' == arch )
			{
				bytesRead = fs.read( fd , ioBuffer , 0 , 8 , e_lfanew + 4 + 0x14 + 0x70 + index * 8 );
			}
			else
			{
				bytesRead = fs.read( fd , ioBuffer , 0 , 8 , e_lfanew + 4 + 0x14 + 0x60 + index * 8  );
			}
			
			if ( 8 != bytesRead )
			{
				break;
			}
			
			imageDataDirectory = {};
			
			imageDataDirectory.VirtualAddress = ioBuffer.readUInt32LE( 0x00 );
			imageDataDirectory.Size = ioBuffer.readUInt32LE( 0x04 );
			
			imageDataDirectoryArray.push( imageDataDirectory );
		}
	

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return imageDataDirectoryArray;
}


function fd_read_IMAGE_OPTIONAL_HEADER32( fd , e_lfanew )
{
	var ioBuffer = Buffer.alloc( 0xE0 ).fill(0);
	var bytesRead = 0;
	
	var optionaHeader = null;
	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 0xE0 , e_lfanew + 4 + 0x14 );
		if ( 0xE0 != bytesRead )
		{
			break;
		}
		
		optionaHeader = {};
		optionaHeader.Magic = ioBuffer.readUInt16LE( 0x00 );
		
		optionaHeader.MajorLinkerVersion = ioBuffer.readUInt8( 0x002  );
		
		optionaHeader.MinorLinkerVersion = ioBuffer.readUInt8( 0x003   );
		
		optionaHeader.SizeOfCode = ioBuffer.readUInt32LE( 0x004   );
		
		optionaHeader.SizeOfInitializedData = ioBuffer.readUInt32LE( 0x008   );
		
		optionaHeader.SizeOfUninitializedData = ioBuffer.readUInt32LE( 0x00c   );
		
		optionaHeader.AddressOfEntryPoint = ioBuffer.readUInt32LE( 0x010   );
		
		optionaHeader.BaseOfCode = ioBuffer.readUInt32LE( 0x014   );
		
		optionaHeader.BaseOfData = ioBuffer.readUInt32LE( 0x018   );
		
		optionaHeader.ImageBase = ioBuffer.readUInt32LE( 0x01c   );
		
		optionaHeader.SectionAlignment = ioBuffer.readUInt32LE( 0x020   );
		
		optionaHeader.FileAlignment = ioBuffer.readUInt32LE( 0x024   );
		
		optionaHeader.MajorOperatingSystemVersion = ioBuffer.readUInt16LE( 0x028   );
		
		optionaHeader.MinorOperatingSystemVersion = ioBuffer.readUInt16LE( 0x02a   );
		
		optionaHeader.MajorImageVersion = ioBuffer.readUInt16LE( 0x02c   );
		
		optionaHeader.MinorImageVersion = ioBuffer.readUInt16LE( 0x02e   );
		
		optionaHeader.MajorSubsystemVersion = ioBuffer.readUInt16LE( 0x030   );
		
		optionaHeader.MinorSubsystemVersion = ioBuffer.readUInt16LE( 0x032   );
		
		optionaHeader.Win32VersionValue = ioBuffer.readUInt32LE( 0x034   );
		
		optionaHeader.SizeOfImage = ioBuffer.readUInt32LE( 0x038   );
		
		optionaHeader.SizeOfHeaders = ioBuffer.readUInt32LE( 0x03c   );
		
		optionaHeader.CheckSum = ioBuffer.readUInt32LE( 0x040   );
		
		optionaHeader.Subsystem = ioBuffer.readUInt16LE( 0x044   );
		
		optionaHeader.DllCharacteristics = ioBuffer.readUInt16LE( 0x046   );
		
		optionaHeader.SizeOfStackReserve = ioBuffer.readUInt32LE( 0x048   );
		
		optionaHeader.SizeOfStackCommit = ioBuffer.readUInt32LE( 0x04c   );
		
		optionaHeader.SizeOfHeapReserve = ioBuffer.readUInt32LE( 0x050   );
		
		optionaHeader.SizeOfHeapCommit = ioBuffer.readUInt32LE( 0x054   );
		
		optionaHeader.LoaderFlags = ioBuffer.readUInt32LE( 0x058   );
		
		optionaHeader.NumberOfRvaAndSizes = ioBuffer.readUInt32LE( 0x05c   );
		
		optionaHeader.DataDirectory = fd_read_IMAGE_DATA_DIRECTORY_array( fd , e_lfanew , "ia32" );

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return optionaHeader;
}


function fd_read_IMAGE_OPTIONAL_HEADER64( fd , e_lfanew )
{
	var ioBuffer = Buffer.alloc( 0xF0 ).fill(0);
	var bytesRead = 0;
	
	var optionaHeader = null;
	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 0xF0 , e_lfanew + 4 + 0x14 );
		if ( 0xF0 != bytesRead )
		{
			break;
		}
		
		optionaHeader = {};
		optionaHeader.Magic = ioBuffer.readUInt16LE( 0x00 );
		
		optionaHeader.MajorLinkerVersion = ioBuffer.readUInt8( 0x002  );
		
		optionaHeader.MinorLinkerVersion = ioBuffer.readUInt8( 0x003   );
		
		optionaHeader.SizeOfCode = ioBuffer.readUInt32LE( 0x004   );
		
		optionaHeader.SizeOfInitializedData = ioBuffer.readUInt32LE( 0x008   );
		
		optionaHeader.SizeOfUninitializedData = ioBuffer.readUInt32LE( 0x00c   );
		
		optionaHeader.AddressOfEntryPoint = ioBuffer.readUInt32LE( 0x010   );
		
		optionaHeader.BaseOfCode = ioBuffer.readUInt32LE( 0x014   );

		optionaHeader.ImageBase = ioBuffer.readUInt64LE( 0x018     );
		
		optionaHeader.SectionAlignment = ioBuffer.readUInt32LE( 0x020     );
		
		optionaHeader.FileAlignment = ioBuffer.readUInt32LE( 0x024     );
		
		optionaHeader.MajorOperatingSystemVersion = ioBuffer.readUInt16LE( 0x028     );
		
		optionaHeader.MinorOperatingSystemVersion = ioBuffer.readUInt16LE( 0x02a     );
		
		optionaHeader.MajorImageVersion = ioBuffer.readUInt16LE( 0x02c     );
		
		optionaHeader.MinorImageVersion = ioBuffer.readUInt16LE( 0x02e     );
		
		optionaHeader.MajorSubsystemVersion = ioBuffer.readUInt16LE( 0x030     );
		
		optionaHeader.MinorSubsystemVersion = ioBuffer.readUInt16LE( 0x032     );
		
		optionaHeader.Win32VersionValue = ioBuffer.readUInt32LE( 0x034    );
		
		optionaHeader.SizeOfImage = ioBuffer.readUInt32LE( 0x038    );
		
		optionaHeader.SizeOfHeaders = ioBuffer.readUInt32LE( 0x03c    );
		
		optionaHeader.CheckSum = ioBuffer.readUInt32LE( 0x040    );
		
		optionaHeader.Subsystem = ioBuffer.readUInt16LE( 0x044    );
		
		optionaHeader.DllCharacteristics = ioBuffer.readUInt16LE( 0x046    );
		
		optionaHeader.SizeOfStackReserve = ioBuffer.readUInt64LE( 0x048    );
		
		optionaHeader.SizeOfStackCommit = ioBuffer.readUInt64LE( 0x050    );
		
		optionaHeader.SizeOfHeapReserve = ioBuffer.readUInt64LE( 0x058    );
		
		optionaHeader.SizeOfHeapCommit = ioBuffer.readUInt64LE( 0x060    );
		
		optionaHeader.LoaderFlags = ioBuffer.readUInt32LE( 0x058   );
		
		optionaHeader.NumberOfRvaAndSizes = ioBuffer.readUInt32LE( 0x05c   );

		optionaHeader.DataDirectory = fd_read_IMAGE_DATA_DIRECTORY_array( fd , e_lfanew , "x64" );

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return optionaHeader;
}


function fd_read_IMAGE_OPTIONAL_HEADER( fd , e_lfanew )
{
	var ioBuffer = Buffer.alloc( 0x1C ).fill(0);
	var bytesRead = 0;
	
	var optionaHeader = null;
	var Magic =  0;
	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 0x1C , e_lfanew );
		if ( 0x1C != bytesRead )
		{
			break;
		}
		
		Magic = ioBuffer.readUInt16LE( 0x18 );
		
		if ( 0x10b == Magic )
		{
			optionaHeader = fd_read_IMAGE_OPTIONAL_HEADER32( fd , e_lfanew );
		}
		else
		{
			optionaHeader = fd_read_IMAGE_OPTIONAL_HEADER64( fd , e_lfanew );
		}
	

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return optionaHeader;
}

function fd_read_IMAGE_NT_HEADER( fd , e_lfanew )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	
	var ntHeader = null;

	
	do
	{
		bytesRead = fs.read( fd , ioBuffer , 0 , 4 , e_lfanew );
		if ( 4 != bytesRead )
		{
			break;
		}
		
		ntHeader = {};
		
		ntHeader.Signature = ioBuffer.readUInt32LE( 0x00 );
	
		ntHeader.FileHeader = fd_read_IMAGE_FILE_HEADER( fd , e_lfanew );

		ntHeader.OptionalHeader = fd_read_IMAGE_OPTIONAL_HEADER( fd , e_lfanew );
		

	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return ntHeader;
}

function fd_read_IMAGE_SECTION_HEADER( fd , e_lfanew , ntHeader , sectionIndex )
{
	var ioBuffer = Buffer.alloc( 0x28 ).fill(0);
	var bytesRead = 0;
	
	var sectionHeader = null;
	var offset = 0;

	
	do
	{
		offset = e_lfanew + 4 + 0x14 + ntHeader.FileHeader.SizeOfOptionalHeader;
		offset += sectionIndex * 0x28
	
		bytesRead = fs.read( fd , ioBuffer , 0 , ioBuffer.length , offset );
		if ( ioBuffer.length != bytesRead )
		{
			break;
		}
		
		sectionHeader = {};
		
		sectionHeader.Name = ioBuffer.readUInt8Array( 0x00 , 8 );
		sectionHeader.NameString = ioBuffer.toString( "ascii" , 0 , 8 );
		
		sectionHeader.Misc = {};
		sectionHeader.Misc.PhysicalAddress = ioBuffer.readUInt32LE( 0x08 );
		sectionHeader.Misc.VirtualSize = ioBuffer.readUInt32LE( 0x08 );
		
		sectionHeader.VirtualAddress = ioBuffer.readUInt32LE( 0x0C );
		
		sectionHeader.SizeOfRawData = ioBuffer.readUInt32LE( 0x010  );
		
		sectionHeader.PointerToRawData = ioBuffer.readUInt32LE( 0x014  );
		
		sectionHeader.PointerToRelocations = ioBuffer.readUInt32LE( 0x018  );
		
		sectionHeader.PointerToLinenumbers = ioBuffer.readUInt32LE( 0x01c  );
		
		sectionHeader.NumberOfRelocations = ioBuffer.readUInt16LE( 0x020  );
		
		sectionHeader.NumberOfLinenumbers = ioBuffer.readUInt16LE( 0x022  );
		
		sectionHeader.Characteristics = ioBuffer.readUInt32LE( 0x024  );
	
	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return sectionHeader;
}

function fd_read_IMAGE_SECTION_HEADERS( fd , e_lfanew , ntHeader )
{
	var sectionHeaderArray = [];
	var index = 0;
	var sectionHeader = {};
	

	for ( index = 0; index < ntHeader.FileHeader.NumberOfSections; index++ )
	{
		sectionHeader = fd_read_IMAGE_SECTION_HEADER( fd , e_lfanew , ntHeader , index );
		
		sectionHeaderArray.push( sectionHeader);
	}

	return sectionHeaderArray;
}

function rva2foa( ntHeader , sectionHeaderArray , rva_offset )
{
	var nextSectionHeader = null;
	var sectionIndex = 0;
	var sectionHeader = null;
	
	var begin_rva = 0;
	var end_rva = 0;
	var count = 0;
	
	var foa_offset = -1;
	
	if ( 0 == sectionHeaderArray.length  )
	{
		return -1;
	}
	
	if ( rva_offset < sectionHeaderArray[0].VirtualAddress )
	{
		return rva_offset;
	}
	
	for ( sectionIndex = 0; sectionIndex < sectionHeaderArray.length; sectionIndex++ )
	{
		sectionHeader = sectionHeaderArray[ sectionIndex ];
		
		assert( sectionHeader , sectionIndex );
		
		if ( sectionIndex != ( sectionHeaderArray.length - 1) )
		{
			nextSectionHeader = sectionHeaderArray[ sectionIndex + 1 ];
		}
		else
		{
			nextSectionHeader = null;
		}
		
		if ( nextSectionHeader )
		{
			begin_rva = sectionHeader.VirtualAddress;
			end_rva = nextSectionHeader.VirtualAddress;
		}
		else
		{
			if ( 0 != ntHeader.OptionalHeader.SectionAlignment )
			{
				count = Math.ceil( sectionHeader.SizeOfRawData /  ntHeader.OptionalHeader.SectionAlignment );
				
				begin_rva = sectionHeader.VirtualAddress;
				end_rva = sectionHeader.VirtualAddress + count * ntHeader.OptionalHeader.SectionAlignment;
			}
			else
			{
				begin_rva = sectionHeader.VirtualAddress;
				end_rva = sectionHeader.VirtualAddress + sectionHeader.SizeOfRawData;
			}
		}
		
		
		if ( ( begin_rva <= rva_offset) && ( end_rva > rva_offset ) )
		{
			foa_offset = sectionHeader.PointerToRawData + ( rva_offset - sectionHeader.VirtualAddress ) ;
			break;
		}
	}
	
	return foa_offset;
}

function foa2rva( ntHeader , sectionHeaderArray , foa_offset )
{
	var nextSectionHeader = null;
	var sectionIndex = 0;
	var sectionHeader = null;
	
	var begin_foa = 0;
	var end_roa = 0;
	var count = 0;
	
	var rva_offset = -1;
	
	if ( 0 == sectionHeaderArray.length  )
	{
		return -1;
	}
	
	if ( foa_offset < sectionHeaderArray[0].PointerToRawData )
	{
		return foa_offset;
	}
	
	for ( sectionIndex = 0; sectionIndex < sectionHeaderArray.length; sectionIndex++ )
	{
		sectionHeader = sectionHeaderArray[ sectionIndex ];
		
		if ( sectionIndex != ( sectionHeaderArray.length - 1) )
		{
			nextSectionHeader = sectionHeaderArray[ sectionIndex + 1 ];
		}
		else
		{
			nextSectionHeader = null;
		}
		
		if ( nextSectionHeader )
		{
			begin_foa = sectionHeader.PointerToRawData;
			end_foa = nextSectionHeader.PointerToRawData;
		}
		else
		{
			if ( 0 != ntHeader.OptionalHeader.SectionAlignment )
			{
				count = Math.ceil( sectionHeader.SizeOfRawData /  ntHeader.OptionalHeader.SectionAlignment );
				
				begin_foa = sectionHeader.VirtualAddress;
				end_foa = sectionHeader.VirtualAddress + count * ntHeader.OptionalHeader.SectionAlignment;
			}
			else
			{
				begin_foa = sectionHeader.VirtualAddress;
				end_foa = sectionHeader.VirtualAddress + sectionHeader.SizeOfRawData;
			}
		}
		
		
		if ( ( begin_foa <= foa_offset) && ( end_foa > foa_offset ) )
		{
			rva_offset = sectionHeader.VirtualAddress + ( foa_offset - sectionHeader.PointerToRawData ) ;
			break;
		}
	}
	
	return rva_offset;
}

function fd_readUInt16LE( fd , offset )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	
	bytesRead = fs.read( fd , ioBuffer , 0 , 2 , offset );
	
	value = ioBuffer.readUInt16LE(0);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return value;
}

function fd_readUInt32LE( fd , offset )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	
	bytesRead = fs.read( fd , ioBuffer , 0 , 4 , offset );
	
	value = ioBuffer.readUInt32LE(0);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return value;
}

function fd_readUInt8Array( fd , arg_offset , count )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	var index = 0;
	var offset = Number64( arg_offset );
	var valueArray = [];
	
	for ( index = 0; index < count; index++ )
	{
		ioBuffer.fill(0);
		bytesRead = fs.read( fd , ioBuffer , 0 , 1 , offset );
	
		value = ioBuffer.readUInt8(0);
		
		valueArray.push( value );
		
		offset.add(1);
	}
	
	ioBuffer.free();
	ioBuffer = null;
	
	return valueArray;
}

function fd_readUInt16LEArray( fd , arg_offset , count )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	var index = 0;
	var offset = Number64( arg_offset );
	var valueArray = [];
	
	for ( index = 0; index < count; index++ )
	{
		ioBuffer.fill(0);
		bytesRead = fs.read( fd , ioBuffer , 0 , 2 , offset );
	
		value = ioBuffer.readUInt16LE(0);
		
		valueArray.push( value );
		
		offset.add(2);
	}
	
	ioBuffer.free();
	ioBuffer = null;
	
	return valueArray;
}

function fd_readUInt32LEArray( fd , arg_offset , count )
{
	var ioBuffer = Buffer.alloc( 4 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	var index = 0;
	var offset = Number64( arg_offset );
	var valueArray = [];
	
	for ( index = 0; index < count; index++ )
	{
		ioBuffer.fill(0);
		
		bytesRead = fs.read( fd , ioBuffer , 0 , 4 , offset );
	
		value = ioBuffer.readUInt32LE(0);
		
		valueArray.push( value );
		
		offset.add(4);
	}
	
	ioBuffer.free();
	ioBuffer = null;
	
	return valueArray;
}

function fd_readUInt64LEArray( fd , arg_offset , count )
{
	var ioBuffer = Buffer.alloc( 8 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	var index = 0;
	var offset = Number64( arg_offset );
	var valueArray = [];
	
	for ( index = 0; index < count; index++ )
	{
		ioBuffer.fill(0);
		
		bytesRead = fs.read( fd , ioBuffer , 0 , 8 , offset );
	
		value = ioBuffer.readUInt64LE(0);
		
		valueArray.push( value );
		
		offset.add(8);
	}
	
	ioBuffer.free();
	ioBuffer = null;
	
	return valueArray;
}

function fd_readString( fd  , offset , arg_encoding )
{
	var ioBuffer = Buffer.alloc( 100 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	
	var encoding = arg_encoding || "ascii";
	var codepage = base.encoding2codepage( encoding );
	
	var foundZero = false;
	var round = 0;
	var text = '';
	var index = 0;
	
	while( !foundZero )
	{
		ioBuffer.fill(0);
		
		bytesRead = fs.read( 
			fd , 
			ioBuffer , 
			0 , 
			ioBuffer.length ,
			offset + round * ioBuffer.length
		);
		
		if ( 1200 == codepage )
		{
			for ( index = 0; index < bytesRead; index += 2 )
			{
				if ( 0 == ioBuffer.readUInt16LE( index ) )
				{
					foundZero = true;
					break;
				}
			}
		}	
		else
		{
			for ( index = 0; index < bytesRead; index += 1 )
			{
				if ( 0 == ioBuffer.readUInt8( index ) )
				{
					foundZero = true;
					break;
				}		
			}
		}
		
			
		text += ioBuffer.toString( encoding );
		round++;
			
		if ( ioBuffer.length != bytesRead )
		{
			break;
		}
	}
	
	
	ioBuffer.free();
	ioBuffer = null;
	
	return text;
} 


// IMAGE_DIRECTORY_ENTRY_EXPORT

function fd_read_IMAGE_DIRECTORY_ENTRY_EXPORT( fd , ntHeader , sectionHeaderArray )
{
	var ioBuffer = Buffer.alloc( 0x28 ).fill(0);
	var bytesRead = 0;
	var value = 0;
	
	var DataDirectoryFOA = 0;
	
	var exportDirectory = null;
	
	
	do
	{
		if ( ( 0 == ntHeader.OptionalHeader.DataDirectory[0].VirtualAddress) 
			|| ( 0 == ntHeader.OptionalHeader.DataDirectory[0].Size )
		)
		{
			break;
		}
		
		DataDirectoryFOA = rva2foa( 
					ntHeader , 
					sectionHeaderArray , 
					ntHeader.OptionalHeader.DataDirectory[0].VirtualAddress
		);
		
		bytesRead = fs.read( fd , ioBuffer , 0 , 0x28 , DataDirectoryFOA );
		if ( 0x28 != bytesRead )
		{
			break;
		}
		
		exportDirectory = {};
		
		exportDirectory.Characteristics = ioBuffer.readUInt32LE( 0x000 );
		
		exportDirectory.TimeDateStamp = ioBuffer.readUInt32LE( 0x004  );
		
		exportDirectory.MajorVersion = ioBuffer.readUInt16LE( 0x008  );
		
		exportDirectory.MinorVersion = ioBuffer.readUInt16LE( 0x00a  );
		
		exportDirectory.Name = ioBuffer.readUInt32LE( 0x00c  );
		
		exportDirectory.Base = ioBuffer.readUInt32LE( 0x010  );
		
		exportDirectory.NumberOfFunctions = ioBuffer.readUInt32LE( 0x014  );
		
		exportDirectory.NumberOfNames = ioBuffer.readUInt32LE( 0x018  );
		
		exportDirectory.AddressOfFunctions = ioBuffer.readUInt32LE( 0x01c  );
		
		exportDirectory.AddressOfNames = ioBuffer.readUInt32LE( 0x020  );
		
		exportDirectory.AddressOfNameOrdinals = ioBuffer.readUInt32LE( 0x024  );
		
	}while(false);
	
	ioBuffer.free();
	ioBuffer = null;
	
	return exportDirectory;
}


function fd_read_exports( fd , ntHeader , sectionHeaderArray , exportDirectory )
{
	var exportArray = [];
	var exportNode = {};
	var exportIndex = 0;
	
	var AddressOfNames_FOA = 0;
    var AddressOfNameOrdinals_FOA = 0;
    var AddressOfFunctions_FOA = 0;

	var ordinalDelta = 0;
	var rawOrdinal = 0;
	
	var nameRVA = 0;
	var nameFOA = 0;
	
	do
	{
		
		AddressOfNames_FOA = rva2foa( ntHeader , sectionHeaderArray , exportDirectory.AddressOfNames );
		AddressOfNameOrdinals_FOA = rva2foa( ntHeader , sectionHeaderArray , exportDirectory.AddressOfNameOrdinals );
		AddressOfFunctions_FOA = rva2foa( ntHeader , sectionHeaderArray , exportDirectory.AddressOfFunctions );
	
		if ( 0 == exportDirectory.NumberOfFunctions )
		{
			break;
		}

		
		for ( exportIndex = 0; exportIndex < exportDirectory.NumberOfFunctions; exportIndex++ )
		{
			exportNode = {};
			
			rawOrdinal = fd_readUInt16LE( fd , AddressOfNameOrdinals_FOA + exportIndex * 2);
			
			if ( rawOrdinal > exportDirectory.NumberOfFunctions )
			{
				exportNode.ordinal = exportDirectory.Base + ordinalDelta;
				ordinalDelta++;
			}
			else
			{
				exportNode.ordinal = rawOrdinal;
				exportNode.hint = exportIndex;
			}
			
			if ( exportIndex < exportDirectory.NumberOfNames )
			{
				nameRVA = fd_readUInt32LE( fd , AddressOfNames_FOA + exportIndex * 4);
				nameFOA = rva2foa( ntHeader , sectionHeaderArray , nameRVA);
				
				exportNode.name = fd_readString( fd , nameFOA );
			}
			else
			{
				nameRVA = 0;
			}
			
	
			exportNode.addressRVA = fd_readUInt32LE( fd , AddressOfFunctions_FOA + exportNode.ordinal * 4 );
			
			exportNode.addressFOA = rva2foa( ntHeader , sectionHeaderArray , exportNode.addressRVA );
			
			exportArray.push( exportNode );
		}
		
	}while(false);
	
	return exportArray;
}


// IMAGE_DIRECTORY_ENTRY_RESOURCE

// IMAGE_DIRECTORY_ENTRY_EXCEPTION

// IMAGE_DIRECTORY_ENTRY_SECURITY

// IMAGE_DIRECTORY_ENTRY_BASERELOC

// IMAGE_DIRECTORY_ENTRY_DEBUG

// IMAGE_DIRECTORY_ENTRY_ARCHITECTURE

// IMAGE_DIRECTORY_ENTRY_GLOBALPTR

// IMAGE_DIRECTORY_ENTRY_TLS

// IMAGE_DIRECTORY_ENTRY_LOAD_CONFIG

// IMAGE_DIRECTORY_ENTRY_BOUND_IMPORT

// IMAGE_DIRECTORY_ENTRY_IAT

// IMAGE_DIRECTORY_ENTRY_DELAY_IMPORT

// IMAGE_DIRECTORY_ENTRY_COM_DESCRIPTOR














//-----------------------------------------------------------------------
function CPEFile( arg_filename )
{
	if (!(this instanceof CPEFile)) 
	{
        return new CPEFile( arg_filename );
    }
	
	this.fd = fs.open( arg_filename , 'r' );
	
	if ( this.fd <= 0 )
	{
		throw new Error( sprintf("open %s faild" , arg_filename ) );
	}
	
	this.filename = arg_filename;
}

CPEFile.prototype.close = function()
{
	fs.close( this.fd );
}

CPEFile.prototype.readIMAGE_DOS_HEADER = function()
{
	return fd_read_IMAGE_DOS_HEADER( this.fd );
}

CPEFile.prototype.readIMAGE_FILE_HEADER = function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	
	return fd_read_IMAGE_FILE_HEADER( this.fd , dosHeader.e_lfanew );
}

CPEFile.prototype.readIMAGE_OPTIONAL_HEADER = function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	
	return fd_read_IMAGE_OPTIONAL_HEADER( this.fd , dosHeader.e_lfanew );
}

CPEFile.prototype.readIMAGE_NT_HEADER= function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	
	return fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
}


CPEFile.prototype.readIMAGE_SECTION_HEADERS= function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	var ntHeader = fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
	
	return fd_read_IMAGE_SECTION_HEADERS( this.fd , dosHeader.e_lfanew , ntHeader );
}

CPEFile.prototype.rva2foa= function( rva_offset )
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	var ntHeader = fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
	var sectionHeaderArray = fd_read_IMAGE_SECTION_HEADERS( this.fd , dosHeader.e_lfanew , ntHeader );
	
	return rva2foa( ntHeader , sectionHeaderArray , rva_offset );
}

CPEFile.prototype.foa2rva= function( foa_offset )
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	var ntHeader = fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
	var sectionHeaderArray = fd_read_IMAGE_SECTION_HEADERS( this.fd , dosHeader.e_lfanew , ntHeader );
	
	return foa2rva( ntHeader , sectionHeaderArray , foa_offset );
}

CPEFile.prototype.readUInt16LE= function( offset )
{
	return fd_readUInt16LE( this.fd  , offset  );
}

CPEFile.prototype.readUInt32LE= function( offset )
{
	return fd_readUInt32LE( this.fd  , offset  );
}

CPEFile.prototype.readUInt8Array = function( offset , count )
{
	return fd_readUInt8Array( this.fd  , offset , count );
}

CPEFile.prototype.readUInt16LEArray = function( offset , count )
{
	return fd_readUInt16LEArray( this.fd  , offset , count );
}

CPEFile.prototype.readUInt32LEArray = function( offset , count )
{
	return fd_readUInt32LEArray( this.fd  , offset , count );
}

CPEFile.prototype.readUInt64LEArray = function( offset , count )
{
	return fd_readUInt64LEArray( this.fd  , offset , count );
}

CPEFile.prototype.readString= function( offset , arg_encoding )
{
	return fd_readString( this.fd  , offset , arg_encoding );
}


CPEFile.prototype.readIMAGE_DIRECTORY_ENTRY_EXPORT= function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	var ntHeader = fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
	var sectionHeaderArray = fd_read_IMAGE_SECTION_HEADERS( this.fd , dosHeader.e_lfanew , ntHeader );
	

	return fd_read_IMAGE_DIRECTORY_ENTRY_EXPORT( this.fd , ntHeader , sectionHeaderArray )
}

CPEFile.prototype.readExports = function()
{
	var dosHeader = fd_read_IMAGE_DOS_HEADER( this.fd );
	var ntHeader = fd_read_IMAGE_NT_HEADER( this.fd , dosHeader.e_lfanew );
	var sectionHeaderArray = fd_read_IMAGE_SECTION_HEADERS( this.fd , dosHeader.e_lfanew , ntHeader );
	var exportDirectory = fd_read_IMAGE_DIRECTORY_ENTRY_EXPORT( this.fd , ntHeader , sectionHeaderArray )
	
	return fd_read_exports( this.fd , ntHeader , sectionHeaderArray , exportDirectory );
}

//---------------------------------------------------------------

module.exports = CPEFile;




function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}