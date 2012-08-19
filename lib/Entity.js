var EventEmitter = require('events').EventEmitter;

function Entity(id){
	
	this._id = id;
}
Entity.prototype  = new EventEmitter;
var e = Entity.prototype;

e.__defineGetter__('id',function(){return this._id;});

module.exports = Entity;
