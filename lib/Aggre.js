var EventEmitter = require('events').EventEmitter;
var eventBus = require('./eventBus');
var Entity = require('./Entity');
var util = require('util');

function Aggre(id){
				Entity.call(this,id);
}

util.inherits(Aggre,Entity);

var a =  Aggre.prototype;

a.emit = function(eventName,event){
	this['on'+eventName] ? this['on'+eventName](event):null;	
}

a.store = function(){
	this._repository.store(this.id);
}

a.publish = function(e){
	 e._aggreType = this.constructor.name;
	 e._aggreId = this.id;
	 this._repository.publish(e);
}

module.exports = Aggre;


