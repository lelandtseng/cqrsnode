
var tiny = require('tiny');
var lock = require('lockmethod');
var bus = require('./eventBus');
var Position = lock.Position;

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
	  this._snapshotsDB.find({}).desc('num').limit(1)(function(err,rs){
			
		  if(err || rs.length == 0){
				callback(null);	
			}else{
				var ss = rs[0];
				self._eventsDB.find({snum:rs[0].num})(function(err,rs){
				var aggre = new self._aggreType(id);
				aggre._repository = self;
				aggre._loadSnapshot(ss.data);	
				aggre._loadEvents(rs);	
				self._repoT[id]	 =  new Date().getTime();
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
	if(!aggre.id){
		aggre._data.id = uuid.v4();	
	}	
	aggre._repository = self;
	self._repoT[aggre.id]	 =  new Date().getTime();
	this._repo[aggre.id] = aggre;

	this._snapshotsDB.set(uuid.v1(),{aggreId:aggre.id,num:0,data:aggre._data},function(err){
		if(err){
			callback(err);
		}
		else{
			callback(null,self._repo[aggre.id]);
			var e = new Event('create',self._repo[aggre.id]._data);	
			e._data.aggreType = self._aggreType.name;
			e._data.aggreId = aggre.id;
			self.publish(e,function(next){next();});
		}
	});
	
}

repo.publish = lock(new Position(0,['_data','aggreId']),function(e,cb){
	var self = this;
	this._snapshotsDB.find({aggreId:e.aggreId}).desc('num').limit(1)(function(err,rs){

		var ss = rs[0];

		self._eventsDB.find({snum:ss.num}).desc('num').limit(1)(function(err,rs){
			var num = 0;
			if(rs.length == 0){
			}else{
				num = ++rs[0].num;
			}
			self._eventsDB.set(uuid.v1(),{data:e._data,num:num,snum:ss.num},function(err){
				if(num > 10){
					self._snapshotsDB.set(uuid.v1(),{aggreId:e.aggreId,num:ss.num+1,data:self._repo[e.aggreId]._data},function(err){
						cb();	
					});
				}
			});
		});
	})
	bus.publish(e);	
});

module.exports = Repository;
