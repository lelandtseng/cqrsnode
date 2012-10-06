var assert = require("assert")
var should = require('should');
var TestAggre = require('./demo/Aggres/Test');
var EventStore = require('../lib/EventStore');
var EventBus = require('../lib/EventBus');
var TinyDriver = require('cqrsnode.eventstore').Tiny;

var extend = require('node-extend');

describe('TinyDriver', function(){
var Aggre = null;
var Test = null;
var a = null;

  it('require', function(){
	 Aggre = require('../lib/Aggre');
  })
  it('extend', function(done){
	TestAggre._es = new EventStore('Test',new TinyDriver('Test'));
	TestAggre._bus = new EventBus();
	Test = extend(TestAggre,Aggre,[0],true);	
	Test.should.be.a('function');
	setTimeout(function(){done();},1300);
  })

  it('#new', function(){
		a = new Test();			
		Test._repo[a.id] = a;
	})

  it('#changeName', function(){
			a.changeName('leo');
			a.data('name').should.eql('leo');
			Test.find.should.be.a('function')
	})

	it('#get',function(){
		Test.get('88570ba0-0f81-11e2-9b2b-151343a86b91',function(err,obj,next){
		console.log(obj.data())
		})	
	})

})
