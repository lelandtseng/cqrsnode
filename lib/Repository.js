var bus =  require('./eventBus');
var Emitter = require('events').EventEmitter;
var Event = require('./Event');
var 


function Repository(type){
 this._loading = {}
 this._repo = {}
 this._emitter = new Emitter;
}

var repo = Repository.prototype;

repo.findById = function(id,cb){
	if(this._repo[id]){
		cb(null,this._repo[id]);
	}else{
		this._emitter.once('loaded '+id,cb);	
		this._load(id);
	}
}


repo._load = function _load(id){

	var self = this;

	if(!this._loading[id]){
		this._loading[id] = true;	
		eventStore.load(id,function(){
			self._repo[id] = obj;
			delete self._loading[id];
			self._emitter.emit('loaded '+id,obj);							
		});	
	}
}


repo.remove = function(id){
		
} 
	
repo.create = function(){
	var aggre = this.factory.create();		
	this._repo[aggre.id] = aggre;
	var e  = new Event('create',{doc:aggre});
	this.publish(e);
}

repo.publish = function(e){
	eventStore.store(e);
	bus.publish(e);	
	// DOTO test.
	var ss = new Snapshot(e.aggreType,e.aggreId,this._repo[e.aggreId]);
	eventStore.store(ss);

}

module.exports = Repository;

