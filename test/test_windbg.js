'use strict';

const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;

const windbg = require("host/windbg");


function main(  )
{
	
	windbg.execute(".reload /f nt");

	
	printf( windbg.isPointer64Bit( ) );
	
	return 0;
}

if ( !module.parent )
{
	main();
}


