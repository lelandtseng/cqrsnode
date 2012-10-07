var assert = require("assert")
var should = require('should');
var bus = new require('../lib/EventBus');

describe('Loader.js', function(){

  var Loader = null;
	var loader = null;

  it('#require', function(){
	 Loader = require('../lib/Loader');
	 should.exist(Loader)
	 Loader.should.be.a('function');
  })

  it('#new', function(){
	 (function(){new Loader();}).should.throw();	
  })
	
  it('#new 2', function(){
		
		var cfg = require('./demo/config');
		loader = new Loader(cfg,bus);

	})

  it('#Aggres', function(){
		loader.Aggres.should.have.property('Test');
	})

  it('#queryHandles', function(){
		loader.queryHandles.should.have.property('query1');
		loader.queryHandles.should.have.property('query2');
		loader.queryHandles.should.have.property('query3');
		loader.queryHandles['query1'].should.be.a('function');
		loader.queryHandles['query2'].should.be.a('function');
		loader.queryHandles['query3'].should.be.a('function');
	})

  it('#commandHandles', function(){
		loader.commandHandles.should.have.property('cmd1');
		loader.commandHandles.should.have.property('cmd2');
		loader.commandHandles.should.have.property('cmd3');
		loader.commandHandles['cmd1'].should.be.a('function');
		loader.commandHandles['cmd2'].should.be.a('function');
		loader.commandHandles['cmd3'].should.be.a('function');
	})

  it('#services', function(){
		loader.services.should.have.property('service1');
		loader.services.should.have.property('service2');
		loader.services.should.have.property('service3');
		loader.services['service1'].should.be.a('function');
		loader.services['service2'].should.be.a('function');
		loader.services['service3'].should.be.a('function');
	
	})

  it('#eventHandles', function(){
		loader.eventHandles.should.have.property('Testtestevent')
		loader.eventHandles['Testtestevent'].should.be.an.instanceOf(Array)
		loader.eventHandles['Testtestevent'].length.should.equal(3)

	})

	it('#DB',function(){
		loader.DB.should.have.property('remove');	
		loader.DB.should.have.property('update');	
		loader.DB.should.have.property('find');	
		loader.DB.should.have.property('save');	
	})

	it('#eventStores',function(){
		loader.eventStores.should.be.a('object');
	})
	it('#QAggres',function(){
		loader.QAggres.should.be.a('object')
	})

});
