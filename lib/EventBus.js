var EventEmitter = require('events').EventEmitter;

function EventBus(){
	this._emitter = new EventEmitter;
}

EventBus.prototype = { 

publish:function publish(event){
	this._emitter.emit('newEvent',event);
	if(!event.aggreType){
		this._emitter.emit(event.name,event);	
	}else{
		this._emitter.emit(event.aggreType+event.aggreId+event.name,event);	
		this._emitter.emit(event.aggreType+event.name,event);
		this._emitter.emit(event.aggreType,event);
		this._emitter.emit(event.name,event);
	}
},

on:function listen(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else if(arguments.length == 3){
		aggreType = aggreType + aggreId;
		handle = eventName;
	}else{
		handle = aggreId;
	}
	this._emitter.on(aggreType,handle);
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
	this._emitter.once(aggreType,handle);
}

}

module.exports  =  EventBus;
