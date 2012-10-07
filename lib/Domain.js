var CommandBus = require('./CommandBus');
var Door = require('./Door');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var uuid = require('node-uuid');
var EventStore = require('./EventStore');
var load = require('./utils/load');
var ServiceBus = require('./ServiceBus');
var Loader = require('./Loader');
var ioc = require('./utils/ioc');
var QueryBus = require('./QueryBus');
var domains = {}

function Domain(cfg,name){

	var name = null;
	if(arguments.length === 1 && typeof arguments[0] === 'string'){
		if(Domain.get(arguments[0])) throw new Error('have same name domain. please update name.');
		else{
			name = arguments[0]	
		}
	}else if(arguments.length === 1){
			name = uuid.v1()	
	}else if(arguments.length === 2 && typeof arguments[0]==='object' && typeof arguments[1] === 'string' ){
			if(Domain.get(arguments[1])) throw new Error('have same name domain. please update name.');
			else{
				name = arguments[1]	
			}
	}else if(arguments.length === 2){
			throw new Error('arguments have bug.');	
	}else	if(arguments.length === 0){
			name = uuid.v1();				
	}else{
			throw new Error('arguments have bug.');	
	}

	var loader = new Loader(cfg);
	var queryBus = new QueryBus(loader.QAggres);
	var serviceBus = new ServiceBus(loader.Aggres);
	var commandBus = new CommandBus(loader.Aggres,serviceBus);
	var eventBus = new EventBus(loader.Aggres,serviceBus);
	var door = new Door(queryBus,commandBus,eventBus);

	if(this.constructor === Domain){
		this.q = function(){
			door.q.apply(door,arguments);
		}	

		this.exec = function(){
			door.exec.apply(door,arguments);
		}
		
		this.on = function(){
			door.on.apply(door,arguments);
		}
		this.once = function(){
			door.once.apply(door,arguments);
		}
	}

	domains[name]  =  door;

	return door;

}


Domain.names = function(){
	var names = [];
	for(var name in domains){
		names.push(name);	
	}
	return names;
}

Domain.get  =  function(name){
	return domains[name]
}

module.exports = Domain;

