var Domain = require('..');

var cfg = require('./config');

var domain = new Domain(cfg,'domain01') 

setTimeout(function(){
domain.exec(['createTest'],function(){
	console.log(1212)
})
},1000);
