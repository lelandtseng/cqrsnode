var bus =  require('./eventBus');
var lock = require('lockmethod');
var Position = lock.Position;
var Event = require('./Event');
var tiny = require('tiny');
var uuid = require('node-uuid');


function Repository(aggreType){

 this._aggreType = aggreType;
 var self = this;
 this._snapshotsDB = null;
 this._eventsDB = null;

 tiny('dbs/'+aggreType.name+'_snapshots',function(err,db){
   self._snapshotsDB = db;							 
 });


 tiny('dbs/'+aggreType.name+'_events',function(err,db){
   self._eventsDB = db;							 
 });

 this._repo = {}

}

var repo = Repository.prototype;

repo.findById = lock(new Position(0),function(id,cb){

	var self = this;
	var callback = cb;

	if(this._repo[id]){
	  cb(this._repo[id]);	
	}else{
	  this._snapshotsDB.find({}).desc('num').limit(1)(function(err,rs){
			
		  if(err || rs.length == 0){
				callback(null);	
			}else{
				var ss = rs[0];
				self._eventsDB.find({snum:rs[0].num})(function(err,rs){
				var aggre = new self._aggreType(id);
				aggre._repository = self;
				aggre.loadSnapshot(ss.data);	
				aggre.loadEvents(rs);	
				self._repo[id] = aggre;
				callback(aggre);
				})
			}
		});
	}

	
});


repo.create = function(callback){
	
	var self = this;
	var aggre = this._aggreType.create(); 
	aggre._repository = self;
	this._repo[aggre.id] = aggre;
	callback(this._repo[aggre.id]);

	this._snapshotsDB.set(uuid.v1(),{aggreId:aggre.id,num:0,data:aggre._data},function(err){
		callback(err)									
	});

}

repo.publish = lock(new Position(0,['_data','aggreId']),function(e,cb){
	var self = this;
	this._snapshotsDB.find({aggreId:e.aggreId}).desc('num').limit(1)(function(err,rs){
		var ss = rs[0];
		self._eventsDB.find({snum:0}).desc('num').limit(1)(function(err,rs){
			var num = 0;
			if(rs.length == 0){
			}else{
				num = ++rs[0].num;
			}
			self._eventsDB.set(uuid.v1(),{data:e._data,num:num,snum:ss.num},function(err){
				cb();	
			});
		});
	})
	bus.publish(e);	
});

module.exports = Repository;

