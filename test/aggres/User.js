var cqrs = require('../..');
var Event = cqrs.Event;
var util = require('util');
var uuid = require('node-uuid');

function User(id){
	cqrs.Aggre.call(this,id);
	var self = this;
	this.on('changeName',function(name){
		self._data.name = name;				
	})
}

User.create = function(){
	var u = new User(uuid.v1());
	return u;
}

util.inherits(User,cqrs.Aggre);

var u = User.prototype;

u.changeName = function(name){
	var e = new Event('changeName',name);
	this.publish(e)
}

module.exports = User;


