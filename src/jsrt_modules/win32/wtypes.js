const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;
const KdPrint = require("cprintf").KdPrint;



var ENUM_TABLE_POOL_TYPE = {
  "NonPagedPool" : 0 ,
  
  "PagedPool"	: 1 ,
  
  "NonPagedPoolMustSucceed" : 2 ,
  
  "DontUseThisType" : 3 ,
  
  "NonPagedPoolCacheAligned" : 4 ,
  
  "PagedPoolCacheAligned"  : 5 , 
  
  "NonPagedPoolCacheAlignedMustS" : 6 ,
  
  "MaxPoolType"  : 7 ,
  
  "NonPagedPoolSession" : 32 ,
  
  "PagedPoolSession"     : 33 ,
  
  "NonPagedPoolMustSucceedSession" : 34 ,
  
  "DontUseThisTypeSession"    : 35 ,
  
  "NonPagedPoolCacheAlignedSession"  : 36 ,
  
  "PagedPoolCacheAlignedSession"     : 37 ,
  
  "NonPagedPoolCacheAlignedMustSSession"  : 38 ,
  
  "NonPagedPoolNx"                        : 512 ,
  
  "NonPagedPoolNxCacheAligned"            : 516 ,
  
  "NonPagedPoolSessionNx"                 : 544 
};
exports.ENUM_TABLE_POOL_TYPE = ENUM_TABLE_POOL_TYPE;


function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}