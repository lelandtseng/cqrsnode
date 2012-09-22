
var EventEmitter  =  require('events').EventEmitter;
var util = require('util');
var Event = require('./Event')

function Aggre(id){

	var emit = new EventEmitter;

	EventEmitter.call(this);
	this._data = {
		id : id,
		state:'LIVE'
	}
	var self = this;
	self.on('remove',function(){
		 self._data.state = 'DEAD';							
	});
	
	emit.updateState = self.$updateState;
	emit.data = this._data;
	emit.updateState();

	self.updateState = function(event){
		emit.emit(event.name,event.data);
		if(emit._events[event.name]){
			var e = ['update',self._data];
			self.publish(e);
		}
	}

}

util.inherits(Aggre,EventEmitter);

var a =  Aggre.prototype;

a.__defineGetter__('id',function(){return this._data.id;});
a.__defineGetter__('state',function(){return this._data.state;});

a.remove = function(){
	var e = ['remove'];
	this.publish(e);
}

a.publish = function(d){
     var e = new Event(d[0],d[1]);      
	 e._data.aggreType = this.constructor.name;
	 e._data.aggreId = this.id;
	 this.updateState(e);
	 this.emit(e.name,e.data);
	 this._repository.publish(e,function(next){next()});
}

a._loadSnapshot = function(data){
	for(var k in data){
		this._data[k] = data[k];
	}
	
}

a._loadEvents = function(events){
	var self = this;
	events.forEach(function(event){
		var e = new Event();
		e._data = event.data;
		self.updateState(e);
	});
}

module.exports = Aggre;
