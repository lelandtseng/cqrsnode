module.exports = Aggre;

var lock = require('lockmethod');
var Position = lock.Position;
var EventEmitter  =  require('events').EventEmitter;
var util = require('util');
var uuid = require('node-uuid');
var Event = require('./Event');

function Aggre(info){

	var isCreate = info.id ? false : true;

	var self = this;
	var emit = new EventEmitter;
    var proxy02 = new EventEmitter; // $updateState use.
	var oemit = new EventEmitter;
	var proxy01  =  {}

	var __data = this.init(info);this.init = null;

	if(__data.id);
    else if(__data._id){
        __data.id = __data._id;
        delete __data._id;
    }else{
        __data.id = uuid.v1();
    }

	// aggre is live.
	__data.state = 'LIVE';

	this.on = function(){
		oemit.on.apply(oemit,arguments);
	}

	var _emit = function(){
		var name = [].shift.call(arguments);
		var args = arguments;
		oemit.listeners(name).forEach(function(listener){
			listener.apply(emit,args)
		});
	}

	for(var k in self.__proto__){
    if(k!='id' && k!='$updateState' && k!='remove' && k!='init'){
	 self[k] = (function(k_){
	   var key = k_;
	   return function(){
	 	  var method =  self.__proto__[key];
		  method.apply(proxy01,arguments)
	   }
	})(k)

	}
	}

	emit.on('remove',function(){
		 __data.state = 'DEAD';
	});

	emit.aggre = function(){
		return self.constructor._proxy.aggre.apply(emit,arguments);
	}

    emit.service = function(){
        return self.constructor._proxy.service.apply(emit,arguments);
    }

    emit.publish = function(){
           proxy01.publish.apply(proxy01,arguments);
    }

	// publish event , event is a array.
	// var event = [arg0,arg1];
	// arg0 is string type, mean is event name.
	// arg1 is json object type, mean is event data.
	proxy01.publish = function(d){
		if(!d[1]) d[1] = {}
	    var e = new Event(d[0],d[1]);
	    e._data.aggreType = self.constructor.aggreName;
		e._data.aggreId = self.id;
		if(e.name !== 'update') {
            emit.emit(e.name,e.data);
            proxy02.emit(e.name, e.data);
        }
		_emit(e.name,e.data);
		self.constructor._bus.publish(e);
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
	proxy02.data = emit.data = function(){
		if(arguments.length === 0){
			return __data;
		}else	if(arguments.length === 1){
			return __data[arguments[0]];
		}else if(arguments.length === 2){
			__data[arguments[0]] = arguments[1];
            var e = ['update',proxy01.data()];
            proxy01.publish(e);
		}
	}

    // 激活 $updateState
	proxy02.updateState = self.$updateState;
	proxy02.updateState();
    delete self.updateState;
    delete proxy02.updateState;

	this.remove = function(){
		var e = ['remove'];
		proxy01.publish(e);
	}

	this.constructor._repo[this.id] = this;
	if(isCreate){
		var e = ['create',__data];
		proxy01.publish(e);
	}

}

/* static functions. */
Aggre._bus =  null;
Aggre._db = null;

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
	  self.find({id:id})(function(err,rs){
	  	 if(err){
	  	 	cb(null,null)
	  	 }else{
	  	 	var entity = new self(rs[0]);
	  	 	self._repo[id] = entity;
	  	 	cb(null,entity);
	  	 }
	  })
	}
});

Aggre.find = function(){
	[].unshift.call(arguments,this.aggreName)
	return this._db.find.apply(this._db,arguments)
}

Aggre.prototype.__defineGetter__('id',function(){
	return this.data('id');
});

Aggre.prototype.init = function(infos){
	return infos;
}

Aggre.prototype.$updateState = function(){}