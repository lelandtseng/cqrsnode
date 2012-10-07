var EventEmitter = require('events').EventEmitter;
var extend = require('node-extend');

module.exports = EventBus;

function EventBus(Aggres_,serviceBus_){

var Aggres = Aggres_;
var serviceBus = serviceBus_;

function Proxy(){

		this.service = function(){
				serviceBus.execute.apply(serviceBus,arguments);			
		}

		this.aggre = function(name){
			return Aggres[name];
		}

}

var PrivateEventEmitter = extend(Proxy,EventEmitter);

var emitter = new PrivateEventEmitter;

this.publish = function publish(event){
	emitter.emit('newEvent',event);
	if(!event.aggreType){
		emitter.emit(event.name,event);	
	}else{
		emitter.emit(event.aggreType+event.aggreId+event.name,event);	
		emitter.emit(event.aggreType+event.name,event);
		emitter.emit(event.aggreType,event);
		emitter.emit(event.name,event);
	}
}

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

