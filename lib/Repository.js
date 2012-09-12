
var tiny = require('tiny');
var lock = require('lockmethod');
var bus = require('./eventBus');
var Position = lock.Position;

function Repository(aggreType,eventStore){

 this._es = eventStore;
 this._aggreType = aggreType;
 var self = this;
 this._repo = {}
 this._repoT = {}
 
 function loopremove(){
	var t = new Date().getTime();
	for(var k in self._repoT){
		if(t-self._repoT[k] > 10000){
			delete self._repo[k];
		}
	}
	setTimeout(loopremove,10000);
 }
 loopremove();

}

var repo = Repository.prototype;

repo.findById = lock(new Position(0),function(id,cb){

	var self = this;
	var callback = cb;

	if(this._repo[id]){
	  self._repoT[id]	 =  new Date().getTime();
	  cb(this._repo[id]);	
	}else{
	   slef._es.getSnapshot(id,function(err,ss){
	   	  
	   });
	}
});


repo.create = function(callback){
	
	var self = this;
	var aggre = this._aggreType.create(); 
	if(!aggre.id){
		aggre._data.id = uuid.v4();	
	}	
	aggre._repository = self;
	this._repoT[aggre.id]	 =  new Date().getTime();
	this._repo[aggre.id] = aggre;

	var e = new Event('create',aggre.id);
	e._data.aggreId = aggre.id;
	e._data.aggreType = this._aggreType.name;

	this.publish(e,function(next){
		next();
	})

}

repo.publish = lock(new Position(0,['_data','aggreId']),function(e,cb){
	var self = this;
	this._es.storeEvent(e.aggreId,e,function(){
		cb();
		bus.publish(e);	
	});	
});

module.exports = Repository;
