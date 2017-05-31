const printf = require("cprintf").printf;
const libsqlite3 = require("3rd/sqlite3");

var dbmgr = new libsqlite3( "d:/1.db");
	
var sql = `
	CREATE TABLE project
					( 
						id INTEGER primary key autoincrement ,
						name TEXT 
					)
`;
	
dbmgr.exec( sql );
	
dbmgr.exec( 'INSERT INTO project (name) VALUES ("test1")' );

printf( dbmgr.execSync( "SELECT * from project" ) );
	
dbmgr.close();