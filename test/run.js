
var assert = require('assert');
var should = require('should');
var Domain = require('..');
var EventStore = require('../../cqrsnode.eventstore').Tiny;
var DBStore = require('../../cqrsnode.dbstore').Mongoose; 

var domain = new Domain({mainPath:__dirname+'/dir01',Store:EventStore,dbs:[]});

setTimeout(function(){	
	var cmd = {name:'CreateUser'};
	domain.execute(cmd,function(err,result){

	console.log(result.emit.toString())
	result.emit('changeName','fdfdfdf')
	var cmd = {
	name:'ChangeUserName',
	data:{
	id:result.data('id'),
	name:"brighthas oklll"
	}
	}

	domain.execute(cmd,function(){
	});
			
	});

},1000)
