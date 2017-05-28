'use strict';

String.prototype.replaceAll = function(search, replacement) 
{
    var target = this;
    return target.split(search).join(replacement);
};

String.prototype.isMatch = function( pattern ) 
{
	var s = 0, p = 0, match = 0, index = -1;
	
	while ( s < this.length ) 
	{
		if ( ( p < pattern.length ) && ( ( pattern.charAt(p) == '?' ) || ( this.charAt(s) === pattern.charAt( p ) ) )   ) 
		{
			s++;
			p++;
		}
		else if ( ( ( p < pattern.length ) && ( pattern.charAt(p) === '*' ) ) )
		{
			index = p;
			match = s;
			p++;
		}
		else if ( index != -1 ) 
		{
			p = index + 1;
			match++;
			s = match;
		}
		else 
		{
			return false;
		}
	}
	
	while ( ( p < pattern.length ) && ( pattern.charAt(p) === '*') )
	{
		p++;
	}
	
	return ( p === pattern.length );
};

function main(  )
{
	

	return 0;
}

if ( !module.parent )
{
	main();
}


