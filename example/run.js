var Domain = require('..');

var cfg = require('./config');

var domain = new Domain(cfg,'domain01') 

setTimeout(function(){
domain.exec(['createTest'],function(err,id){
	domain.exec(['updateName',{id:id,name:'leosfdss'}],function(){
	})	
})
},1000);

