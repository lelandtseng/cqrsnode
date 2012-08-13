
function Event(name,data){
	if(typeof name == undefined)
	throw new Error();
	this._name = name;
	this._data = data;
	this._aggreType = null;
	this._aggreId = null;
	this._time = new Date();
}

var event = Event.prototype;

event.__defineGetter__('aggreType',function(){return this._aggreType;});
event.__defineGetter__('aggreId',function(){return this._aggreId;});
event.__defineGetter__('time',function(){return this._time;});
event.__defineGetter__('name',function(){return this._name;});
event.__defineGetter__('data',function(){return this._data;});

module.exports = Event;
