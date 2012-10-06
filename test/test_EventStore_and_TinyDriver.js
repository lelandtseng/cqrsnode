var assert = require("assert")
var EventStore = require('../lib/EventStore');
var Snapshot = require('../lib/Snapshot');
var Event = require('../lib/Event');
var should = require('should');
var TinyDriver = require('../../cqrsnode.eventstore').Tiny;

var driver = null;
var es = null;

describe('TinyDriver', function(){
  it('#new', function(){
	driver = new TinyDriver('Test');
  })

  it('#new',function(done){
     es  =  new EventStore('Test',driver);
     setTimeout(function(){
		 	done()
		 },50)

  });

  it('#getSnapshot',function(done){
     es.getSnapshot('id001',function(err,ss){
	      should.exist(ss);	
				done();
     })
  });

  it('#createSnapshot',function(done){
     var ss = new Snapshot('Test','id001');
     es.createSnapshot('id001',ss,function(err){
		 done()
			should.not.exist(err)
     })
  });

  it('#storeEvent',function(){
     var state = {name:'leoz',age:100}
		 var e = new Event('testEvent',{name:'leoz'});
		 e._data.aggreType = 'Test';
		 e._data.aggreId = 'id001';
		 es.storeEvent('id001',state,e,function(err){
			should.not.exist(err)
		 })
  });

  it('#storeEvent 2',function(){
     var state = {name:'leoz2',age:100}
		 var e = new Event('testEvent22',{name:'leoz'});
		 e._data.aggreType = 'Test';
		 e._data.aggreId = 'id001';
		 es.storeEvent('id001',state,e,function(err){
			should.not.exist(err)
		 })
  });

	it('#findEvents',function(){
		 es.findEvents('id001',0,5,function(err,rs){
		 })	
	})

	it('#findEvents',function(){
		es.count('id001',function(err,len){})
	});

})
