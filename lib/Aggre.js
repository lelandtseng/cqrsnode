var EventEmitter  =  require('events').EventEmitter;
var util = require('util');
var Event = require('./Event')

function Aggre(id){
	EventEmitter.call(this);
	this._data = {
		id : id,
		state:'LIVE'
	}
	var self = this;
	self.on('remove',function(){
		 self._data.state = 'DEAD';							
	});
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
	 if(!this.__data___){
	 	this.__data__ = {}
	 	this.__data__.update = this.updateData;
	 }
     var e = new Event(d[0],d[1]);      
	 e._data.aggreType = this.constructor.name;
	 e._data.aggreId = this.id;
	 this.__data__.update(e,this._data);
	 this.emit(e.name,e.data);
	 this._repository.publish(e,function(next){next()});
}

a._loadSnapshot = function(data){
	this._data = data;
}

a.updateData = function(event,data){

}

a._loadEvents = function(events){
	var self = this;
	events.forEach(function(event){
		var e = new Event();
		e._data = event.data;
		self.updateData(e,self._data);
	});
}

module.exports = Aggre;