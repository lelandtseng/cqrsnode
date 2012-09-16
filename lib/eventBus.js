var EventEmitter = require('events').EventEmitter;
var emitter =  new EventEmitter;

module.exports = {

publish:function publish(event){
	emitter.emit(event.aggreType+event.aggreId+event.name,event);	
	emitter.emit(event.aggreType+event.name,event);	
	if(!event.aggreType){
		emitter.emit(event.name,event);	
	}
},

on:function on(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	emitter.on(aggreType,handle);
},

once:function once(aggreType,aggreId,eventName,handle){
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
