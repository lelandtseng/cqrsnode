var CommandBus = require('./CommandBus');
var Door = require('./Door');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var uuid = require('node-uuid');
var EventStore = require('./EventStore');
var ServiceBus = require('./ServiceBus');
var Loader = require('./Loader');
var QueryBus = require('./QueryBus');
var domains = {}

function Domain(cfg,name){

	if(arguments.length === 1 && typeof arguments[0] === 'string'){
		if(Domain.get(arguments[0])) throw new Error('have same name domain. please update name.');
		else{
			name = arguments[0]	
		}
	}else if(arguments.length === 1){
			name = uuid.v1()	
	}else 
	if(arguments.length === 2 && (typeof arguments[0])==='object' && (typeof arguments[1]) === 'string' )
	{
			if(Domain.get(arguments[1])) throw new Error('have same name domain. please update name.');
			else{
				name = arguments[1]	
			}
	}else 
	if(arguments.length === 2){
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



var fs = require('fs');
var path = require('path');
	var qks = [];
	var cks = [];
	var mpath  =  path.dirname(process.argv[1])
	var qkspath = path.join(mpath,'qks');
	var ckspath = path.join(mpath,'cks');


	// bind queryHandles
	for(var k in loader.queryHandles){
	 qks.push(k+'<br/>')
	 queryBus.bind(k,loader.queryHandles[k])
	}
	

	// bind commandHandles
	for(var k in loader.commandHandles){
	 cks.push(k+'<br/>')
	 commandBus.bind(k,loader.commandHandles[k])
	}

	// bind eventHandles
	for(var k in loader.eventHandles){
		loader.eventHandles[k].forEach(function(handle){
		eventBus.on(k,handle)
		})
	}

	fs.writeFile(qkspath+'.html',qks.toString(),function(){});

	fs.writeFile(ckspath+'.html',cks.toString(),function(){});


	// bind eventBus to Aggres
	for(var k in loader.Aggres){
	 loader.Aggres[k]._bus = eventBus;
	}

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


	eventBus.on('update',function(e){
		loader.DB.update(e.aggreType,e.aggreId,e.data,function(){})
	})

	eventBus.on('create',function(e){
		loader.DB.save(e.aggreType,e.data,function(){})
	})

	eventBus.on('remove',function(e){
		loader.DB.remove(e.aggreType,e.aggreId,function(){})
	})

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

