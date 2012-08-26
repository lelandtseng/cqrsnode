
var EventEmitter = require('events').EventEmitter;

var emitter =  new EventEmitter;

function publish(event){
	console.log(event)
	emitter.emit(event.aggreType+event.aggreId+event.name,event);	
	emitter.emit(event.aggreType+event.name,event);	
}

function on(aggreType,aggreId,eventName,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else{
		aggreType = aggreType + aggreId;
		handle = eventName;
	}
	emitter.on(aggreType,handle);
}

function once(aggreType,aggreId,handle){
	if(arguments.length == 4){
		aggreType = aggreType + aggreId + eventName ;
	}else{
		aggreType = aggreType + aggreId;
		handle = eventName;
	}
	emitter.once(aggreType,handle);
}

module.exports = {
  publish:publish
 ,on:on
 ,once:once
}

