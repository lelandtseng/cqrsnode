var fs  =  require('fs');
var path = require('path');

function load(_path,container){
	var mypath = path.resolve(_path );
	var names = fs.readdirSync(mypath)
	names.forEach(function(name){
	 var jsname = path.basename(name,'.js');		
	 var jspath = path.resolve(mypath+'/'+jsname);
	 container[jsname] = require(jspath); 
	});
}

module.exports = load;