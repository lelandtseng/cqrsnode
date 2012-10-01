
var CommandBus = require('./CommandBus');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var EventStore = require('./EventStore');
var load = require('./utils/load');
var ioc = require('./utils/ioc');
var bindCommand = require('./utils/bindCommand');
var QueryBus = require('./QueryBus');
var bindQuery = require('./utils/bindQuery');
var regAggreType = require('./utils/regAggreType');
var bindEventHandle = require('./utils/bindEventHandle');
var bindService = require('./utils/bindService');
var DataStore = require('./DataStore');

function Domain(){

	var self = this;

	var Aggres = {},
			commandHandles = {},
			queryHandles = {},
			services = {},
			eventHandles = {}
			
	// external use.
	///////////////////////////////////////////////////////////////////
	var domain_external_proxy = {
		exec:function(cmd,callback){
			var name = [].shift.call(cmd);
			commandHandles[name].applay(domain_core_proxy,cmd);
		},
		q:function(query,callback){
			var name = [].shift.call(query);
			queryHandles[name].apply(domain_query_proxy,query);
		}
	}

	// Aggre , Service , command handle and event handle use this proxy. 
	///////////////////////////////////////////////////////////////////
	var Domain_core_proxy = extend(EventBus,EventEmitter);
	var domain_core_proxy = new Domain_core_proxy();

	// get Aggre usr Aggre name.
	domain_core_proxy.aggre = function(AggreName){
		return Aggres[AggreName];
	}

	// domain.service(name,arg0,arg1,arg2,callback);
	// callback(result)
	domain_core_proxy.service = function(){
		var name = [].shift.call(arguments);
		services[name].apply(this,arguments);	
	}
	 
	// query handle use.
	///////////////////////////////////////////////////////////////////
	var domain_query_proxy = {}

	iocDomain(aggres,domain_core_proxy);


	this.exec = function(){}
	this.q = function(){}
	
	return domain_external_proxy;

}

function iocDomain(objs,domain){
	for(var k in objs){
		objs[k].prototype.domain = domain;	
	}
}

module.exports = Domain;

