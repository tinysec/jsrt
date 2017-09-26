const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const vprintf = require("cprintf").vprintf;

const path = require("path");

const ffi = require("ffi");

const wtypes = require("win32/wtypes");

var ffi_ntdll = ffi.loadAndBatchBind("ntdll.dll" , [

	"NTSTATUS __stdcall NtQuerySystemInformation(_In_  ULONG SystemInformationClass , _Inout_   PVOID SystemInformation , _In_ ULONG SystemInformationLength , _Out_opt_ PULONG ReturnLength );" ,
	
	"NTSTATUS __stdcall NtQueryObject(  HANDLE Handle ,  ULONG ObjectInformationClass ,  PVOID ObjectInformation ,  ULONG ObjectInformationLength ,  PULONG ReturnLength );"

]);


function help_querySystemInfomation( SystemInformationClass , param_initSize )
{	
	var lpBuffer = null;
	var pnBufferLength = Buffer.alloc( 8 ).fill( 0 );
	
	var lpTestBuffer = null;
	var nTestSize = param_initSize || 0;
	var status = 0;
	
	var ReturnLength = 0;
	
	
	do
	{
		if ( 0 != nTestSize )
		{
			lpTestBuffer = Buffer.alloc( nTestSize ).fill( 0 );
		}
			
		pnBufferLength.writeUInt32LE( nTestSize );
		
		ffi_ntdll.NtQuerySystemInformation( SystemInformationClass , lpTestBuffer , nTestSize , pnBufferLength );
			
		ReturnLength = pnBufferLength.readUInt32LE( 0 );
			
		if ( 0 == ReturnLength )
		{
			break;
		}
		
		lpBuffer = Buffer.alloc( ReturnLength ).fill( 0 );
		
		pnBufferLength.writeUInt32LE( ReturnLength );
		
		status = ffi_ntdll.NtQuerySystemInformation( SystemInformationClass , lpBuffer , ReturnLength , pnBufferLength );
		if ( 0 != status )
		{
			lpBuffer.free();
			lpBuffer = null;
		}
		
	}while(false);
	

	pnBufferLength.free();
	pnBufferLength = null;
	
	if ( lpTestBuffer )
	{
		lpTestBuffer.free();
		lpTestBuffer = null;
	}

	return lpBuffer;
}

function help_querySystemInfomation2( SystemInformationClass , param_initSize )
{	
	var lpBuffer = null;
	var pnBufferLength = Buffer.alloc( 8 ).fill( 0 );
	
	var lpTestBuffer = null;
	var nTestSize = param_initSize || 0;
	var status = 0;
	
	var ReturnLength = 0;
	
	
	do
	{
		while( 1 )
		{
			lpTestBuffer = Buffer.alloc( nTestSize ).fill( 0 );
	
			pnBufferLength.writeUInt32LE( nTestSize );
			
			status = ffi_ntdll.NtQuerySystemInformation( SystemInformationClass , lpTestBuffer , nTestSize , pnBufferLength );
			if ( 0 == status )
			{
				ReturnLength = pnBufferLength.readUInt32LE();
				
				lpBuffer = lpTestBuffer.slice( 0 , ReturnLength );
				
				break;
			}
			
			if ( lpTestBuffer )
			{
				lpTestBuffer.free();
				lpTestBuffer = null;
			}
		
			nTestSize = nTestSize * 2;
		}
		
	}while(false);
	
	pnBufferLength.free();
	pnBufferLength = null;
	
	if ( lpTestBuffer )
	{
		lpTestBuffer.free();
		lpTestBuffer = null;
	}

	return lpBuffer;
}


function help_queryObject( hObject , informationClass , param_initSize )
{	
	var lpBuffer = null;
	var pnBufferLength = Buffer.alloc( 8 ).fill( 0 );
	
	var lpTestBuffer = null;
	var nTestSize = param_initSize || 8;
	var status = 0;
	
	var ReturnLength = 0;
	
	
	do
	{
		while( 1 )
		{
			lpTestBuffer = Buffer.alloc( nTestSize ).fill( 0 );
	
			pnBufferLength.writeUInt32LE( nTestSize );
			
			status = ffi_ntdll.NtQueryObject( hObject , informationClass , lpTestBuffer , nTestSize , pnBufferLength );
			if ( 0 == status )
			{
				ReturnLength = pnBufferLength.readUInt32LE();
				
				lpBuffer = lpTestBuffer.slice( 0 , ReturnLength );
				
				break;
			}
			
			if ( lpTestBuffer )
			{
				lpTestBuffer.free();
				lpTestBuffer = null;
			}
		
			nTestSize = nTestSize * 2;
		}
		
	}while(false);
	
	pnBufferLength.free();
	pnBufferLength = null;
	
	if ( lpTestBuffer )
	{
		lpTestBuffer.free();
		lpTestBuffer = null;
	}

	return lpBuffer;
}

function queryProcessInfomation()
{
	var lpBuffer = null;
	
	var entryBaseOffset = 0;
	var NextEntryOffset = 0;
	
	var stProcessNode = {};
	var processArray = null;
	
	lpBuffer = help_querySystemInfomation( 5 );
	if ( !lpBuffer )
	{
		return processArray;
	}
	
	// init offsets
	var offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreads = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_WorkingSetPrivateSize = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_HardFaultCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreadsHighWatermark = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_CycleTime = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_CreateTime = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_UserTime = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_KernelTime = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_ImageName = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_BasePriority = 0x48;	

	var offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessId = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_InheritedFromUniqueProcessId = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_HandleCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_SessionId = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessKey = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PeakVirtualSize = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_VirtualSize = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PageFaultCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PeakWorkingSetSize = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_WorkingSetSize = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakPagedPoolUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_QuotaPagedPoolUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakNonPagedPoolUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_QuotaNonPagedPoolUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PagefileUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PeakPagefileUsage = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_PrivatePageCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_ReadOperationCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_WriteOperationCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_OtherOperationCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_ReadTransferCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_WriteTransferCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_OtherTransferCount = 0x00;
		
	var offset_SYSTEM_PROCESS_INFORMATION_Threads = 0x00;
	
	if ( 'x64' == process.arch )
	{
		offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreads = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_WorkingSetPrivateSize = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_HardFaultCount = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreadsHighWatermark = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_CycleTime = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_CreateTime = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_UserTime = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_KernelTime = 0x00;
		
		offset_SYSTEM_PROCESS_INFORMATION_ImageName = 0x38;
		
		offset_SYSTEM_PROCESS_INFORMATION_BasePriority = 0x48;	

		offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessId = 0x4C;
		
		offset_SYSTEM_PROCESS_INFORMATION_InheritedFromUniqueProcessId = 0x50;
		
		offset_SYSTEM_PROCESS_INFORMATION_HandleCount = 0x58;
		
		offset_SYSTEM_PROCESS_INFORMATION_SessionId = 0x5C;
		
		offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessKey = 0x60;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakVirtualSize = 0x68;
		
		offset_SYSTEM_PROCESS_INFORMATION_VirtualSize = 0x70;
		
		offset_SYSTEM_PROCESS_INFORMATION_PageFaultCount = 0x78;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakWorkingSetSize = 0x80;
		
		offset_SYSTEM_PROCESS_INFORMATION_WorkingSetSize = 0x88;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakPagedPoolUsage = 0x90;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPagedPoolUsage = 0x98;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakNonPagedPoolUsage = 0xA0;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaNonPagedPoolUsage = 0xA8;
		
		offset_SYSTEM_PROCESS_INFORMATION_PagefileUsage = 0xB0;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakPagefileUsage = 0xB8;
		
		offset_SYSTEM_PROCESS_INFORMATION_PrivatePageCount = 0xC0;
		
		offset_SYSTEM_PROCESS_INFORMATION_ReadOperationCount = 0xC8;
		
		offset_SYSTEM_PROCESS_INFORMATION_WriteOperationCount = 0xD0;
		
		offset_SYSTEM_PROCESS_INFORMATION_OtherOperationCount = 0xD8;
		
		offset_SYSTEM_PROCESS_INFORMATION_ReadTransferCount = 0xE0;
		
		offset_SYSTEM_PROCESS_INFORMATION_WriteTransferCount = 0xE8;
		
		offset_SYSTEM_PROCESS_INFORMATION_OtherTransferCount = 0xF0;
		
		offset_SYSTEM_PROCESS_INFORMATION_Threads = 0xF8;
	}
	else
	{
		offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreads = 0x04;
		
		offset_SYSTEM_PROCESS_INFORMATION_WorkingSetPrivateSize = 0x08;
		
		offset_SYSTEM_PROCESS_INFORMATION_HardFaultCount = 0x10;
		
		offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreadsHighWatermark = 0x14;
		
		offset_SYSTEM_PROCESS_INFORMATION_CycleTime = 0x18;
		
		offset_SYSTEM_PROCESS_INFORMATION_CreateTime = 0x20;
		
		offset_SYSTEM_PROCESS_INFORMATION_UserTime = 0x28;
		
		offset_SYSTEM_PROCESS_INFORMATION_KernelTime = 0x30;
		
		offset_SYSTEM_PROCESS_INFORMATION_ImageName = 0x38;
		
		offset_SYSTEM_PROCESS_INFORMATION_BasePriority = 0x40;	

		offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessId = 0x44;
		
		offset_SYSTEM_PROCESS_INFORMATION_InheritedFromUniqueProcessId = 0x48;
		
		offset_SYSTEM_PROCESS_INFORMATION_HandleCount = 0x4C;
		
		offset_SYSTEM_PROCESS_INFORMATION_SessionId = 0x50;
		
		offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessKey = 0x54;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakVirtualSize = 0x58;
		
		offset_SYSTEM_PROCESS_INFORMATION_VirtualSize = 0x5C;
		
		offset_SYSTEM_PROCESS_INFORMATION_PageFaultCount = 0x60;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakWorkingSetSize = 0x64;
		
		offset_SYSTEM_PROCESS_INFORMATION_WorkingSetSize = 0x68;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakPagedPoolUsage = 0x6C;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPagedPoolUsage = 0x70;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakNonPagedPoolUsage = 0x74;
		
		offset_SYSTEM_PROCESS_INFORMATION_QuotaNonPagedPoolUsage = 0x78;
		
		offset_SYSTEM_PROCESS_INFORMATION_PagefileUsage = 0x7C;
		
		offset_SYSTEM_PROCESS_INFORMATION_PeakPagefileUsage = 0x80;
		
		offset_SYSTEM_PROCESS_INFORMATION_PrivatePageCount = 0x84;
		
		offset_SYSTEM_PROCESS_INFORMATION_ReadOperationCount = 0x88;
		
		offset_SYSTEM_PROCESS_INFORMATION_WriteOperationCount = 0x90;
		
		offset_SYSTEM_PROCESS_INFORMATION_OtherOperationCount = 0x98;
		
		offset_SYSTEM_PROCESS_INFORMATION_ReadTransferCount = 0xA0;
		
		offset_SYSTEM_PROCESS_INFORMATION_WriteTransferCount = 0xA8;
		
		offset_SYSTEM_PROCESS_INFORMATION_OtherTransferCount = 0xB0;
		
		offset_SYSTEM_PROCESS_INFORMATION_Threads = 0xB0;
	}
		
	while( 1 )
	{
		stProcessNode = {};
		
		NextEntryOffset = lpBuffer.readUInt32LE( entryBaseOffset + 0 );
		
		if ( 'x64' == process.arch )
		{
			stProcessNode.NumberOfThreads =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreads );
	
			stProcessNode.ImageName =  lpBuffer.readStringFromUNICODE_STRING( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ImageName );
			
			stProcessNode.BasePriority =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_BasePriority );
			
			stProcessNode.UniqueProcessId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessId );
			
			stProcessNode.InheritedFromUniqueProcessId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_InheritedFromUniqueProcessId );
			
			stProcessNode.HandleCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_HandleCount );
			
			stProcessNode.SessionId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_SessionId );
			
			stProcessNode.UniqueProcessKey =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessKey );
			
			stProcessNode.PeakVirtualSize =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakVirtualSize );
			
			stProcessNode.VirtualSize =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_VirtualSize );
			
			stProcessNode.PageFaultCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PageFaultCount );
			
			stProcessNode.PeakWorkingSetSize =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakWorkingSetSize );
			
			stProcessNode.WorkingSetSize =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WorkingSetSize );
			
			stProcessNode.QuotaPeakPagedPoolUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakPagedPoolUsage );
			
			stProcessNode.QuotaPagedPoolUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPagedPoolUsage );
			
			stProcessNode.QuotaPeakNonPagedPoolUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakNonPagedPoolUsage );
			
			stProcessNode.QuotaNonPagedPoolUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaNonPagedPoolUsage );
			
			stProcessNode.PagefileUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PagefileUsage );
			
			stProcessNode.PeakPagefileUsage =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakPagefileUsage );
			
			stProcessNode.PrivatePageCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PrivatePageCount );
			
			stProcessNode.ReadOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ReadOperationCount );
			
			stProcessNode.WriteOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WriteOperationCount );
			
			stProcessNode.OtherOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_OtherOperationCount );
			
			stProcessNode.ReadTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ReadTransferCount );
			
			stProcessNode.WriteTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WriteTransferCount );
			
			stProcessNode.OtherTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_OtherTransferCount );
		}
		else
		{
			stProcessNode.NumberOfThreads =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_NumberOfThreads );
	
			stProcessNode.ImageName =  lpBuffer.readStringFromUNICODE_STRING( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ImageName );
			
			stProcessNode.BasePriority =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_BasePriority );
			
			stProcessNode.UniqueProcessId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessId );
			
			stProcessNode.InheritedFromUniqueProcessId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_InheritedFromUniqueProcessId );
			
			stProcessNode.HandleCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_HandleCount );
			
			stProcessNode.SessionId =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_SessionId );
			
			stProcessNode.UniqueProcessKey =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_UniqueProcessKey );
			
			stProcessNode.PeakVirtualSize =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakVirtualSize );
			
			stProcessNode.VirtualSize =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_VirtualSize );
			
			stProcessNode.PageFaultCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PageFaultCount );
			
			stProcessNode.PeakWorkingSetSize =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakWorkingSetSize );
			
			stProcessNode.WorkingSetSize =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WorkingSetSize );
			
			stProcessNode.QuotaPeakPagedPoolUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakPagedPoolUsage );
			
			stProcessNode.QuotaPagedPoolUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPagedPoolUsage );
			
			stProcessNode.QuotaPeakNonPagedPoolUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaPeakNonPagedPoolUsage );
			
			stProcessNode.QuotaNonPagedPoolUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_QuotaNonPagedPoolUsage );
			
			stProcessNode.PagefileUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PagefileUsage );
			
			stProcessNode.PeakPagefileUsage =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PeakPagefileUsage );
			
			stProcessNode.PrivatePageCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_PrivatePageCount );
			
			stProcessNode.ReadOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ReadOperationCount );
			
			stProcessNode.WriteOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WriteOperationCount );
			
			stProcessNode.OtherOperationCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_OtherOperationCount );
			
			stProcessNode.ReadTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_ReadTransferCount );
			
			stProcessNode.WriteTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_WriteTransferCount );
			
			stProcessNode.OtherTransferCount =  lpBuffer.readUInt64LE( entryBaseOffset + offset_SYSTEM_PROCESS_INFORMATION_OtherTransferCount );
		}

		// push node 
		if ( !processArray )
		{
			processArray = [];
		}
		
		processArray.push( stProcessNode ); 
		
		entryBaseOffset += NextEntryOffset;
		
		if ( 0 == NextEntryOffset )
		{
			break;
		}
	}
	
	if ( lpBuffer )
	{
		lpBuffer.free();
		lpBuffer = null;
	}

	return processArray;
}
exports.queryProcessInfomation = queryProcessInfomation;


function _getObjectTypeName( objectTypesTable , objectTypeIndex )
{
	var index = 0;
	
	for ( index = 0; index < objectTypesTable.length; index++ )
	{
		if ( objectTypeIndex == objectTypesTable[index].index )
		{
			return objectTypesTable[index].name;
		}
	}
}


function queryHandleInfomation()
{
	var lpBuffer = null;
	
	var entryBaseOffset = 0;

	var stHandleNode = {};
	var handleArray = null;
	
	var NumberOfHandles = 0;
	var entryIndex = 0;
	
	var ObjectTypeIndex = 0;
	
	var objectTypesTable = null;
	
	objectTypesTable = queryObjectTypes();
	if ( !objectTypesTable )
	{
		return null;
	}
	
	lpBuffer = help_querySystemInfomation2( 16 , 1024 * 100 );
	if ( !lpBuffer )
	{
		return handleArray;
	}
	
	// init offsets
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_UniqueProcessId = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_CreatorBackTraceIndex = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_ObjectTypeIndex = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleAttributes = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleValue = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_Object = 0x00;
		
	var offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_GrantedAccess = 0x00;
	
	var sizeof_SYSTEM_HANDLE_TABLE_ENTRY_INFO = 0;

	
	if ( 'x64' == process.arch )
	{
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_UniqueProcessId = 0x00;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_CreatorBackTraceIndex = 0x02;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_ObjectTypeIndex = 0x04;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleAttributes = 0x05;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleValue= 0x06;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_Object = 0x08;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_GrantedAccess = 0x10;
		
		sizeof_SYSTEM_HANDLE_TABLE_ENTRY_INFO = 0x14;
	}
	else
	{
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_UniqueProcessId = 0x00;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_CreatorBackTraceIndex = 0x02;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_ObjectTypeIndex = 0x04;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleAttributes = 0x05;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleValue= 0x06;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_Object = 0x08;
		
		offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_GrantedAccess = 0x0C;
		
		sizeof_SYSTEM_HANDLE_TABLE_ENTRY_INFO = 0x10;
	}
	
	NumberOfHandles = lpBuffer.readUInt32LE( 0 );
	
	entryBaseOffset = base.POINTER_SIZE;
		
	for ( entryIndex = 0; entryIndex < NumberOfHandles; entryIndex++ )
	{
		entryBaseOffset = base.ALIGN_UP_BY( entryBaseOffset , base.POINTER_SIZE );
		
		stHandleNode = {};
		
		stHandleNode.UniqueProcessId =  lpBuffer.readUInt16LE( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_UniqueProcessId );
	
		stHandleNode.CreatorBackTraceIndex =  lpBuffer.readUInt16LE( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_CreatorBackTraceIndex );
			
		ObjectTypeIndex =  lpBuffer.readUInt8( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_ObjectTypeIndex );
		
		stHandleNode.ObjectTypeName =  _getObjectTypeName( objectTypesTable , ObjectTypeIndex );
			
		stHandleNode.HandleAttributes =  lpBuffer.readUInt8( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleAttributes );
			
		stHandleNode.HandleValue =  lpBuffer.readUInt16LE( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_HandleValue );
			
		stHandleNode.ObjectAddress =  lpBuffer.readNativePointer( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_Object );

		stHandleNode.GrantedAccess =  lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_HANDLE_TABLE_ENTRY_INFO_GrantedAccess );
			

		// push node 
		if ( !handleArray )
		{
			handleArray = [];
		}
		
		handleArray.push( stHandleNode ); 
		
		entryBaseOffset += sizeof_SYSTEM_HANDLE_TABLE_ENTRY_INFO;
	}
	
	if ( lpBuffer )
	{
		lpBuffer.free();
		lpBuffer = null;
	}

	return handleArray;
}
exports.queryHandleInfomation = queryHandleInfomation;


function queryLockInfomation()
{
	var lpBuffer = null;
	
	var entryBaseOffset = 0;

	var stLockNode = {};
	var lockArray = null;
	
	var NumberOfHandles = 0;
	var entryIndex = 0;
	
	lpBuffer = help_querySystemInfomation2( 12 , 1024 * 100 );
	
	if ( !lpBuffer )
	{
		return lockArray;
	}

	
	// init offsets
	var offset_RTL_PROCESS_LOCK_INFORMATION_Address = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_Type = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_CreatorBackTraceIndex = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_OwningThread = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_LockCount = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_ContentionCount = 0x00;
		
	var offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount = 0x00;
	
	var offset_RTL_PROCESS_LOCK_INFORMATION_RecursionCount = 0x00;
	
	var offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingShared = 0x00;
	
	var offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingExclusive = 0x00;
	
	var sizeof_RTL_PROCESS_LOCK_INFORMATION = 0;

	
	if ( 'x64' == process.arch )
	{
		offset_RTL_PROCESS_LOCK_INFORMATION_Address = 0x00;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_Type = 0x08;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_CreatorBackTraceIndex = 0x0A;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_OwningThread = 0x10;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_LockCount = 0x18;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_ContentionCount = 0x1C;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount = 0x20;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_RecursionCount = 0x24;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingShared = 0x28;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingExclusive = 0x2C;

		sizeof_RTL_PROCESS_LOCK_INFORMATION = 0x30;
	}
	else
	{
		offset_RTL_PROCESS_LOCK_INFORMATION_Address = 0x00;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_Type = 0x04;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_CreatorBackTraceIndex = 0x06;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_OwningThread = 0x08;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_LockCount = 0x0C;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_ContentionCount = 0x10;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount = 0x14;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_RecursionCount = 0x18;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingShared = 0x1C;
		
		offset_RTL_PROCESS_LOCK_INFORMATION_NumberOfWaitingExclusive = 0x20;
		
		sizeof_RTL_PROCESS_LOCK_INFORMATION = 0x24;
	}
	
	NumberOfHandles = lpBuffer.readUInt32LE( 0 );
	
	entryBaseOffset = base.POINTER_SIZE;
		
	for ( entryIndex = 0; entryIndex < NumberOfHandles; entryIndex++ )
	{
		entryBaseOffset = base.ALIGN_UP_BY( entryBaseOffset , base.POINTER_SIZE );
		
		stLockNode = {};
		
		stLockNode.Address =  lpBuffer.readPointer( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_Address );
	
		stLockNode.Type =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_Type );
			
		stLockNode.CreatorBackTraceIndex =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_CreatorBackTraceIndex );
			
		stLockNode.OwningThread =  lpBuffer.readPointer( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_OwningThread );
			
		stLockNode.LockCount =  lpBuffer.readInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_LockCount );
			
		stLockNode.ContentionCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_ContentionCount );

		stLockNode.EntryCount =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount );
			
		stLockNode.RecursionCount =  lpBuffer.readInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount );
		
		stLockNode.NumberOfWaitingShared =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount );
		
		stLockNode.NumberOfWaitingExclusive =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_LOCK_INFORMATION_EntryCount );
		
		
		// push node 
		if ( !lockArray )
		{
			lockArray = [];
		}
		
		lockArray.push( stLockNode ); 
		
		entryBaseOffset += sizeof_RTL_PROCESS_LOCK_INFORMATION;
	}
	
	if ( lpBuffer )
	{
		lpBuffer.free();
		lpBuffer = null;
	}

	return lockArray;
}
exports.queryLockInfomation = queryLockInfomation;


function fix_module_path(  arg_src_path )
{
    if ( 0 == arg_src_path.length )
    {
        return arg_src_path;
    }

    var windows_folder = process.env["SystemRoot"];

    var windows_folder_lower = windows_folder.toLowerCase();
  
    var src_path = arg_src_path.replace(/\//g , "\\\\");
    var src_path_lower = src_path.toLowerCase();
    var dest_path = '';

    if ( 0 == src_path_lower.indexOf( '\\systemroot\\') )
    {
        dest_path = windows_folder + src_path.substring( 11 , src_path.length );
    }
    else if ( 0 == src_path_lower.indexOf( '\\??\\') )
    {
        dest_path = src_path.substring( 4 , src_path.length );
    }
    else if ( 0 == src_path_lower.indexOf( '\\\\?\\') )
    {
        dest_path = src_path.substring( 4 , src_path.length );
    }
    else if ( 0 == src_path_lower.indexOf( '\\windows\\') )
    {
        dest_path = windows_folder + src_path.substring( 8 , src_path.length );
    }
    else if ( 0 == src_path_lower.indexOf( '\\program files\\') )
    {
        dest_path = process.env["SystemDrive"] + src_path;
    }
    else
    {
        dest_path = src_path;
    }
   
    return dest_path;
}

// not work at wow64 mode
function queryModuleInformation()
{
	var lpBuffer = null;
	
	var entryBaseOffset = 0;

	var stModuleNode = {};
	var moduleArray = null;
	
	var NumberOfModules = 0;
	var entryIndex = 0;
	
	lpBuffer = help_querySystemInfomation2( 11 , 1024 * 10 );
	if ( !lpBuffer )
	{
		return moduleArray;
	}
	
	// init offsets
	var offset_RTL_PROCESS_MODULE_INFORMATION_Section = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_MappedBase = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_ImageBase = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_ImageSize = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_Flags = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_LoadOrderIndex = 0x00;
		
	var offset_RTL_PROCESS_MODULE_INFORMATION_InitOrderIndex = 0x00;
	
	var offset_RTL_PROCESS_MODULE_INFORMATION_LoadCount = 0x00;
	
	var offset_RTL_PROCESS_MODULE_INFORMATION_OffsetToFileName = 0x00;
	
	var offset_RTL_PROCESS_MODULE_INFORMATION_FullPathName = 0x00;
	
	var sizeof_RTL_PROCESS_MODULE_INFORMATION = 0;

	
	if ( 'x64' == process.arch )
	{
		offset_RTL_PROCESS_MODULE_INFORMATION_Section = 0x00;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_MappedBase = 0x08;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_ImageBase = 0x10;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_ImageSize = 0x18;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_Flags = 0x1C;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_LoadOrderIndex = 0x20;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_InitOrderIndex = 0x22;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_LoadCount= 0x24;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_OffsetToFileName = 0x26;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_FullPathName = 0x28;
		
		sizeof_RTL_PROCESS_MODULE_INFORMATION = 0x128;
	}
	else
	{
		offset_RTL_PROCESS_MODULE_INFORMATION_Section = 0x00;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_MappedBase = 0x04;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_ImageBase = 0x08;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_ImageSize = 0x0C;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_Flags = 0x10;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_LoadOrderIndex = 0x14;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_InitOrderIndex = 0x16;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_LoadCount= 0x18;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_OffsetToFileName = 0x1A;
		
		offset_RTL_PROCESS_MODULE_INFORMATION_FullPathName = 0x1C;
		
		sizeof_RTL_PROCESS_MODULE_INFORMATION = 0x11C;
	}
	

	NumberOfModules = lpBuffer.readUInt32LE( 0 );
	
	entryBaseOffset = base.POINTER_SIZE;
		
	for ( entryIndex = 0; entryIndex < NumberOfModules; entryIndex++ )
	{
		entryBaseOffset = base.ALIGN_UP_BY( entryBaseOffset , base.POINTER_SIZE );
		
		stModuleNode = {};

		stModuleNode.ImageBase =  lpBuffer.readNativePointer( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_ImageBase );
			
		stModuleNode.ImageSize =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_ImageSize );
			
		stModuleNode.Flags =  lpBuffer.readUInt32LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_Flags );
		
		stModuleNode.LoadOrderIndex =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_LoadOrderIndex );
		
		//stModuleNode.InitOrderIndex =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_InitOrderIndex );
		
		stModuleNode.LoadCount =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_LoadCount );
		
		//stModuleNode.OffsetToFileName =  lpBuffer.readUInt16LE( entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_OffsetToFileName );
		
		stModuleNode.FullPathName =  lpBuffer.toString( 'ascii' , entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_FullPathName , entryBaseOffset + offset_RTL_PROCESS_MODULE_INFORMATION_FullPathName + 256 );
		
		stModuleNode.FullPathName = fix_module_path( stModuleNode.FullPathName );
		
		// push node 
		if ( !moduleArray )
		{
			moduleArray = [];
		}
		
		moduleArray.push( stModuleNode ); 
		
		entryBaseOffset += sizeof_RTL_PROCESS_MODULE_INFORMATION;
	}
	
	if ( lpBuffer )
	{
		lpBuffer.free();
		lpBuffer = null;
	}

	return moduleArray;
}
exports.queryModuleInformation = queryModuleInformation;


function queryBigPoolInformation()
{
	var lpBuffer = null;
	
	var entryBaseOffset = 0;

	var stPoolNode = {};
	var PoolArray = null;
	
	var NumberOfPools = 0;
	var entryIndex = 0;
	
	var testValue = 0;
	
	lpBuffer = help_querySystemInfomation2( 66 , 1024 * 10 );
	if ( !lpBuffer )
	{
		return moduleArray;
	}
	
	// init offsets
	var offset_SYSTEM_BIGPOOL_ENTRY_VirtualAddress = 0x00;
		
	var offset_SYSTEM_BIGPOOL_ENTRY_SizeInBytes = 0x00;
		
	var offset_SYSTEM_BIGPOOL_ENTRY_TagUlong = 0x00;
	
	var sizeof_SYSTEM_BIGPOOL_ENTRY = 0x00;
		

	if ( 'x64' == process.arch )
	{
		offset_SYSTEM_BIGPOOL_ENTRY_VirtualAddress = 0x00;
		
		offset_SYSTEM_BIGPOOL_ENTRY_SizeInBytes = 0x08;
		
		offset_SYSTEM_BIGPOOL_ENTRY_TagUlong = 0x10;
		
		sizeof_SYSTEM_BIGPOOL_ENTRY = 0x18;
	}
	else
	{
		offset_SYSTEM_BIGPOOL_ENTRY_VirtualAddress = 0x00;
		
		offset_SYSTEM_BIGPOOL_ENTRY_SizeInBytes = 0x04;
			
		offset_SYSTEM_BIGPOOL_ENTRY_TagUlong = 0x08;
			
		sizeof_SYSTEM_BIGPOOL_ENTRY = 0x0C;
		
	}
	
	NumberOfPools = lpBuffer.readUInt32LE( 0 );
	
	entryBaseOffset = base.POINTER_SIZE;
		
	for ( entryIndex = 0; entryIndex < NumberOfPools; entryIndex++ )
	{
		entryBaseOffset = base.ALIGN_UP_BY( entryBaseOffset , base.POINTER_SIZE );
		
		stPoolNode = {};
		
		testValue =  lpBuffer.readPointer( entryBaseOffset + offset_SYSTEM_BIGPOOL_ENTRY_VirtualAddress );
		
		stPoolNode.nonPaged = Number64.testBit(testValue , 0);
		stPoolNode.address = testValue.clearBit( 0);
		
		stPoolNode.size =  lpBuffer.readULONG_PTR( entryBaseOffset + offset_SYSTEM_BIGPOOL_ENTRY_SizeInBytes );
			
		stPoolNode.tag = base.UInt32LEToTag( lpBuffer.readUInt32LE( entryBaseOffset + offset_SYSTEM_BIGPOOL_ENTRY_TagUlong ) );
	
		// push node 
		if ( !PoolArray )
		{
			PoolArray = [];
		}
		
		PoolArray.push( stPoolNode ); 
		
		
		entryBaseOffset += sizeof_SYSTEM_BIGPOOL_ENTRY;
	}
	
	if ( lpBuffer )
	{
		lpBuffer.free();
		lpBuffer = null;
	}

	return PoolArray;
}
exports.queryBigPoolInformation = queryBigPoolInformation;


// return [ { objectTypeIndex , name , poolType} ]
function queryObjectTypes()
{
	var Status = -1;
	
	var lpTypesBuffer = null;
	
	var NumberOfTypes = 0;
	var entryIndex = 0;
	
	var entryBaseOffset = 0;
	
	var offset_OBJECT_TYPE_INFORMATION_TypeIndex = 0x00;
	var offset_OBJECT_TYPE_INFORMATION_PoolType = 0;
	var sizeof_OBJECT_TYPE_INFORMATION = 0x00;
	
	
	var nameSize = 0;
	
	var typeNode = null;

	var objectTypes = null;
	var poolType = 0;
	
	if ( 'x64' == process.arch )
	{
		offset_OBJECT_TYPE_INFORMATION_TypeIndex = 0x5A;
		
		offset_OBJECT_TYPE_INFORMATION_PoolType = 0x5C;
			
		sizeof_OBJECT_TYPE_INFORMATION = 0x68;
	}
	else
	{
		offset_OBJECT_TYPE_INFORMATION_TypeIndex = 0x52;
		
		offset_OBJECT_TYPE_INFORMATION_PoolType = 0x54;
			
		sizeof_OBJECT_TYPE_INFORMATION = 0x60;	
	}
	
	do
	{	
		// ObjectTypesInformation
		lpTypesBuffer = help_queryObject( null , 3 );
		if ( !lpTypesBuffer )
		{
			break;
		}
		
		NumberOfTypes = lpTypesBuffer.readUInt32LE(0);
		
		entryBaseOffset = base.POINTER_SIZE;
		
		for ( entryIndex = 0; entryIndex < NumberOfTypes; entryIndex++ )
		{
			entryBaseOffset = base.ALIGN_UP_BY( entryBaseOffset , base.POINTER_SIZE );
			
			nameSize = lpTypesBuffer.readUInt16LE( entryBaseOffset + 0x02 );
			
			typeNode = {};
			typeNode.index = lpTypesBuffer.readUInt8( entryBaseOffset + offset_OBJECT_TYPE_INFORMATION_TypeIndex );
			
			typeNode.name = Buffer.toString( 
						lpTypesBuffer.address , 
						"ucs2"  , 
						entryBaseOffset + sizeof_OBJECT_TYPE_INFORMATION ,
						entryBaseOffset + sizeof_OBJECT_TYPE_INFORMATION + nameSize
					);
					
			poolType = lpTypesBuffer.readUInt32LE( entryBaseOffset + offset_OBJECT_TYPE_INFORMATION_PoolType );
			
			typeNode.poolType = base.findKey( wtypes.ENUM_TABLE_POOL_TYPE , poolType);
			
			assert( typeNode.poolType , "invalid pool type" );
			
			if ( !objectTypes )
			{
				objectTypes = [];
			}
			
			objectTypes.push( typeNode );
			
			typeNode = null;
			
			entryBaseOffset += sizeof_OBJECT_TYPE_INFORMATION + nameSize;
		}
			
		objectTypes.sort( function(item1 , item2)
		{
			return item1.index - item2.index;
		});
		
	}while(false);

	lpTypesBuffer.free();
	lpTypesBuffer = null;
	
	return objectTypes;
}
exports.queryObjectTypes = queryObjectTypes;


function main(  )
{
	return 0;
}

if ( !module.parent )
{
	main();
}