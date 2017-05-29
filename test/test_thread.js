'use strict';

const assert = require("assert");
const _ = require("underscore");
const base = require("base");

const printf = require("cprintf").printf;
const sprintf = require("cprintf").sprintf;

const thread = require("thread");

function threadRoutine1( threadContext )
{
	while(1)
	{
		printf("[1] i amd worker1 = %d\n" , process.tid );
		
		base.sleep(1000);
	}
}
exports.threadRoutine1 = threadRoutine1;

function threadRoutine2( threadContext )
{
	while(1)
	{
		printf("[2] i am worker2 = %d\n\n" , process.tid );
		
		base.sleep(5000);
	}
}
exports.threadRoutine2 = threadRoutine2;

function main(  )
{
	printf("cur tid = %d\n" , process.tid);
	
	var worker1 =	thread.create(  __filename , "threadRoutine1"  );
	var worker2 =	thread.create(  __filename , "threadRoutine2"  );
	
	thread.waitAll( [worker1 , worker2 ] , 1000 * 10);

	return 0;
}

if ( !module.parent )
{
	main();
}


