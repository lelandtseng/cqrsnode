var Snapshot = require('../lib/Snapshot');
var Event = require('../lib/Event');
var EventStore = require('../lib/EventStore');
var Store = require('../lib/stores/memory');

var store = new Store('Bill');
var es = new EventStore('Bill',store);

var aggreId = 'id001';
var aggreState = {name:'tjss',mony:123};
var e = new Event('changeName','xxxddd');

es.storeEvent(aggreId,aggreState,e,function(err){
	
})

es.storeEvent(aggreId,aggreState,e,function(err){
	
})

es.getSnapshot(aggreId,function(err,s){
	console.log(s)
});