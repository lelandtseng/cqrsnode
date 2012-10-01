var EventEmitter = require('events').EventEmitter;

function EventBus(){}

EventBus.prototype = { 

publish:function publish(event){
	this.emit('newEvent',event);
	if(!event.aggreType){
		this.emit(event.name,event);	
	}else{
		this.emit(event.aggreType+event.aggreId+event.name,event);	
		this.emit(event.aggreType+event.name,event);
		this.emit(event.aggreType,event);
		this.emit(event.name,event);
	}
},

onE:function listen(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	this.on(aggreType,handle);
},

onceE:function once(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	this.once(aggreType,handle);
}

}

module.exports  =  EventBus;
