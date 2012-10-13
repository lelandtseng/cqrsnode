module.exports = Aggre;

var lock = require('lockmethod');
var Position = lock.Position;
var EventEmitter  =  require('events').EventEmitter;
var util = require('util');
var uuid = require('node-uuid');
var Event = require('./Event')
var Snapshot = require('./Snapshot');


//cqrs system will bind 'domain' object to Aggre.prototype.domain;
//so aggre can use this.domain.
//and , this.domain only have a function , it is this.domain.repo.
function Aggre(infos){


	var data = null
	if(infos && infos.constructor === Snapshot){
		data = infos.aggreState;	
	}else{
	   data = infos;
	}

	if(!data) data = {}
	var self = this;
	var emit = new EventEmitter;
	var oemit = new EventEmitter;
	var proxy01  =  {}

	// aggre self data.
	var __data = data;

	if(infos && infos.constructor === Snapshot){
	}else{
	__data.id = uuid.v1();
	// aggre is live.
	__data.state = 'LIVE';

	}

	this.on = function(){
		oemit.on.apply(oemit,arguments)
	}

	var _emit = function(){
		var name = [].shift.call(arguments);
		var args = arguments;	
		var self = this;
		oemit.listeners(name).forEach(function(listener){
			listener.apply(self,args)	
		});	
	}

	emit.on('remove',function(){
		 __data.state = 'DEAD';							
	});

	// publish event , event is a array.
	// var event = [arg0,arg1];
	// arg0 is string type, mean is event name.
	// arg1 is json object type, mean is event data.
	proxy01.publish = function(d){
   var e = new Event(d[0],d[1]);      
	 e._data.aggreType = self.constructor.name;
	 e._data.aggreId = self.id;
	console.log(e.data)
	 emit.emit(e.name,e.data);
	 _emit(e.name,e.data);
	 self.constructor.publish(e,function(err,next){next()});
	 if(emit._events[e.name]){
			var e2 = ['update',self.data()];
			proxy01.publish(e2);
	 }
	}

	

	// only read.
	// get aggre data , it is unique way.
	// example: aggre.data();
	// Note, the data only clone. 
	this.data = proxy01.data =  function(){
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

	for(var k in self.__proto__){
         if(k!= '_loadEvents' && k!='id' && k!='$updateState' && k!='remove'){
	 self[k] = (function(k_){
	 	 var key = k_;
	   return function(){
	 	  var method =  self.__proto__[key];
		  method.apply(proxy01,arguments)
	   }
		 
	})(k)

	}
	}


	// it's temp , run out kill.	
	this._loadEvents = function(events){
		events.forEach(function(event){
			emit.emit(event.name,event.data);
		});
		delete this._loadEvents;
	}
	
	this.constructor._repo[this.id] = this;
	if(infos && infos.constructor === Snapshot);
	else{
		var e = ['create',__data];
		proxy01.publish(e);
	}

}

Aggre.prototype = {

	remove:function(){
		var e = ['remove'];
		this.publish(e);
	}

}


/* static functions. */
Aggre._es =  null; // EventStore object.
Aggre._bus = null; // event bus object.
Aggre._db = null; // database 

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
			ss.constructor = Snapshot
	   	  	var events = ss.events;
	   	  	var a = new self(ss);
	   	  	a._loadEvents(events);
	   	  	self._repo[id] = a;
	   	  	self._repoT[id]	 =  new Date().getTime();
	   	  	callback(null,self._repo[id]);
	   	  }
	   });
	}
});

Aggre.find = function(){
	[].unshift.call(arguments,this.name)
	return this._db.find.apply(this._db,arguments)
}

Aggre.publish = lock(new Position(0,['_data','aggreId']),function(e,cb){
  var self = this;
	this._es.storeEvent(e.aggreId,self._repo[e.aggreId].data(),e,function(err){
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

