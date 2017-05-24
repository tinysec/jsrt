const printf = require("cprintf").printf;
const sqlite3 = require("sqlite3");

var hSQLite = sqlite3.open( "d:/1.db");
	
var sql = `
	CREATE TABLE project
					( 
						id INTEGER primary key autoincrement ,
						name TEXT 
					)
`;
	
sqlite3.exec( hSQLite , sql );
	
sqlite3.exec(hSQLite , 'INSERT INTO project (name) VALUES ("test1")' );

printf( sqlite3.execSync( hSQLite , "SELECT * from project" ) );
	
sqlite3.close( hSQLite );