var EventEmitter = require('events').EventEmitter;

module.exports = Door;

// it is appdomain door, outside only use it proxy use appdomain.
//@param queryBus_ is a QueryBus
function Door(queryBus_,commandBus_,eventBus_){

	var queryBus = queryBus_;	
	var commandBus = commandBus_;
	var eventBus = eventBus_;
	var emitter = new EventEmitter;
  eventBus.on('newEvent',function(event){
	if(!event.aggreType){
		emitter.emit(event.name,event);	
	}else{
		emitter.emit(event.aggreType+event.aggreId+event.name,event);	
		emitter.emit(event.aggreType+event.name,event);
		emitter.emit(event.aggreType,event);
		emitter.emit(event.name,event);
	}
  });

	// cqrs - Q =  Query.
	// query is a Array type.
	//   var query01 = ['queryName',arg0,arg1... ];
	//
	//   var appdomain = new Domain ...
	//   var query01 = ...
	//   appdomain.door.q(query01,callback)
	this.q = function(query,callback){
		queryBus.execute(query[0],query[1],callback);		
	}

	//@see this.q
	// cqrs - C = Command
	this.exec = function(cmd,callback){
		commandBus.execute(cmd[0],cmd[1],callback);	
	}

 // add listener.
 this.on = function(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	emitter.on(aggreType,handle);	
 }

 this.once = function(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	emitter.once(aggreType,handle);	
	}

}
