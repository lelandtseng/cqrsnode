
var EventEmitter = require('events').EventEmitter;

var Event = require('./Event');
var eventBus = require('./eventBus');
var util = require('util');

function Aggre(id){
	EventEmitter.call(this);
	this._data = {
		id : id,
		state:'LIVE'
	}
	var self = this;
	console.log(self)
	self.on('remove',function(){
		 self._data.state = 'DEAD';							
	});
}

util.inherits(Aggre,EventEmitter);

var a =  Aggre.prototype;

a.__defineGetter__('id',function(){return this._data.id;});

a.remove = function(){
	var e = new Event('remove');
	this.publish(e);
}

a.publish = function(e){
	 this.emit(e.name,e.data);
	 e._data.aggreType = this.constructor.name;
	 e._data.aggreId = this.id;
	 this._repository.publish(e,function(next){next()});
}

a.loadSnapshot = function(data){
	this._data = data;
}

a.loadEvents = function(events){
	var self = this;
	events.forEach(function(event){
		var e = new Event();
		e._data = event.data;
		self.emit(e.name,e.data)	
	})
}

module.exports = Aggre;

