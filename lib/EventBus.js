var EventEmitter = require('events').EventEmitter;

function EventBus(){
	this.emitter = new EventEmitter;
}

EventBus.prototype = { 

publish:function publish(event){
	this.emitter.emit(event.aggreType+event.aggreId+event.name,event);	
	this.emitter.emit(event.aggreType+event.name,event);	
	if(!event.aggreType){
		this.emitter.emit(event.name,event);	
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
	this.emitter.on(aggreType,handle);
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
	this.emitter.once(aggreType,handle);
}

}

module.exports  =  EventBus;