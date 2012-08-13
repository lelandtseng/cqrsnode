function Entity(id){
	this._id = id;
}

var e = Entity.prototype;

e.__defineGetter__('id',function(){return this._id;});

module.exports = Entity;
