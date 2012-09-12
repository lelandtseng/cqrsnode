var Snapshot = require('../lib/Snapshot');
var Event = require('../lib/Event');
var EventStore = require('../lib/EventStore');
var Store = require('../lib/stores/memory');

var store = new Store('Bill');
var es = new EventStore('Bill',store);

var aggreId = 'id001';
var aggreState = {name:'tjss',mony:123};
var e = new Event('changeName','xxxddd');
var e2 = new Event('changeAag','cccccc');
var e3 = new Event('dfdfdfdf','ssss')
es.storeEvent(aggreId,aggreState,e,function(err){
	
})

es.storeEvent(aggreId,aggreState,e2,function(err){
	
})

var sss = new Snapshot('Bill',aggreId);
sss._data.aggreState = {name:'ddddd',mony:5454};


es.createSnapshot(aggreId,sss,function(err,ss){
	
})

es.storeEvent(aggreId,aggreState,e3,function(err){
	
})

es.getSnapshot(aggreId,0,function(err,s){
	
});