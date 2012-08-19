var bus =  require('./eventBus');
var Emitter = require('events').EventEmitter;
var Event = require('./Event');
var eventstore = require('eventstore');
var storage = require('eventstore.mongoDb');


function Repository(aggreType){

 this._aggreType = aggreType;
 var es = eventstore.createStore();
 this._es = es;
 es.configure(function(){
  es.use(storage.createStorage({dbName:aggreType.name}));
 }).start();

 this._loading = {}
 this._repo = {}
 this._emitter = new Emitter;

}

var repo = Repository.prototype;

repo.findById = function(id,cb){

var self = this;

function load(){

	if(!self._loading[id]){
		self._loading[id] = true;	
		self._es.getFromSnapshot(id,function(err,ss,st){
		if(ss.data){
		var data = ss.data;
		
		var events = st.events;

		var aggreObj = new self._aggreType(id);
		aggreObj._repository = self;

		aggreObj.loadSnapshot(data);	
		
		aggreObj.loadEvents(events);

		self._repo[id] = aggreObj;
		delete self._loading[id];
		if(aggreObj._data.state == 'DEAD'){
			self._emitter.emit('loaded'+id,null);							
		}else{
			self._emitter.emit('loaded'+id,self._repo[id]);							
		}
		}else{
		self._emitter.emit('loaded'+id,null);							
		}

		});
	}
}

	if(this._repo[id]){
		cb(null,this._repo[id]);	
	}else{
		this._emitter.once('loaded'+id,cb);
		load(id)
	}

}



repo.create = function(callback){
	
	var self = this;
	var aggre = this._aggreType.create(); 
	aggre._repository = self;
	this._repo[aggre.id] = aggre;
	callback(this._repo[aggre.id])
	self._es.createSnapshot(aggre.id,0,aggre._data,function(err){
	});

}

repo.publish = function(e){
	this._es.getEventStream(e.aggreId,0,function(err,s){
						s.addEvent(e._data);	
						s.commit();
	});	
	bus.publish(e);	
}

module.exports = Repository;

