module.exports = Aggre;

var lock = require('lockmethod');
var Position = lock.Position;
var EventEmitter  =  require('events').EventEmitter;
var util = require('util');
var uuid = require('node-uuid');
var Event = require('./Event')

//cqrs system will bind 'domain' object to Aggre.prototype.domain;
//so aggre can use this.domain.
//and , this.domain only have a function , it is this.domain.repo.
function Aggre(data){

	if(!data) data = {}
	var self = this;
	var emit = new EventEmitter;
	var oemit = new EventEmitter;

	this.on = function(){
		oemit.on.apply(oemit,arguments)
	}

	this.emit = function(){
		var name = Array.shift.call(arguments);
		var args = arguments;	
		var self = this;
		oemit.listeners(name).forEach(function(listener){
			listener.apply(self,args)	
		});	
		
	}

	// aggre self data.
	var __data = data;

	__data.id = uuid.v1();
	// aggre is live.
	__data.state = 'LIVE';

	this.on('remove',function(){
		 __data.state = 'DEAD';							
	});
	

	// only read.
	// get aggre data , it is unique way.
	// example: aggre.data();
	// Note, the data only clone. 
	this.data = function(){
		if(arguments.length === 0){
			return __data;	
		}else	if(arguments.length === 1){
			return __data[arguments[0]]; 	
		}
	}

	// this.data is write.
	emit.data = function(){
		if(arguments.length === 0){
			return __data;	
		}else	if(arguments.length === 1){
			return __data[arguments[0]]; 	
		}else if(arguments.length === 2){
			__data[arguments[0]] = arguments[1];
		}
	}
	emit.updateState = self.$updateState;
	emit.updateState();

	// publish event , event is a array.
	// var event = [arg0,arg1];
	// arg0 is string type, mean is event name.
	// arg1 is json object type, mean is event data.
	this.publish = function(d){
   var e = new Event(d[0],d[1]);      
	 e._data.aggreType = this.constructor.name;
	 e._data.aggreId = this.id;
	 emit.emit(e.name,e.data);
	 this.emit(e.name,e.data);

	 this.constructor.publish(e,function(err,next){next()});

	 if(emit._events[e.name]){
			var e2 = ['update',self.data()];
			self.publish(e2);
	 }

	}

	// it's temp , run out kill.	
	this._loadEvents = function(events){
		events.forEach(function(event){
			emit.emit(event.name,event.data);
		});
		delete this._loadEvents;
	}


}

Aggre.prototype{

	remove:function(){
		var e = ['remove'];
		this.publish(e);
	}

}


/* static functions. */
Aggre._es =  null; // EventStore object.
Aggre._bus = null; // event bus object.

Aggre._repo = {};
Aggre._repoT = {};

Aggre._loopremove = function(){
	var t = new Date().getTime();
	for(var k in this._repoT){
		if(t-self._repoT[k] > 10000 && self._repoT[k] != -1){
			delete self._repo[k];
		}
	}
	setTimeout(loopremove,1000*60*15);
 }
 loopremove();
}

Aggre.cache = function(id){
	this._repoT[id] = -1;
}

Aggre.nocache = function(id){
	this._repoT[id] = new Date().getTime();
}

Aggre.get = lock(new Position(0),function(id,cb){

	var self = this;
	var callback = cb;

	if(this._repo[id]){
	  if(self._repoT[id] !== -1)
	  self._repoT[id] =  new Date().getTime();
	  cb(null,this._repo[id]);	
	}else{
	   self._es.getSnapshot(id,function(err,ss){
	   		if(err) cb(err,null);
		  	else if(!ss) callback(null,null);
	   	  else{
	   	  	var events = ss.events;
	   	  	var aggreState  =  ss.aggreState;
	   	  	var a = new self._aggreType(aggreState);
	   	  	a._loadEvents(events);
	   	  	self._repo[id] = a;
	   	  	self._repoT[id]	 =  new Date().getTime();
	   	  	callback(null,self._repo[id]);
	   	  }
	   });
	}
});

Aggre.find = function(){

}

Aggre.publish = lock(new Position(0,['_data','aggreId']),function(e,cb){
  var self = this;
	this._es.storeEvent(e.aggreId,self._repo[e.aggreId],e,function(err){
		if(err){
			cb(err);
		}else{
			cb(null);
			self._bus.publish(e);	
		}
	});	
});

Aggre.prototype.__defineGetter__('id',function(){
	return this.data('id');
});

