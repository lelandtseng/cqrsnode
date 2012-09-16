var CommandBus = require('./CommandBus');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var EventStore = require('./EventStore');

function Domain(options){

	var options = options;
	var Store = options.Store;

	var aggreTypes = {};
	var repos = {};

	this.eventBus = new EventBus;
	this.commandBus =  new CommandBus;

	this.regAggreType = function(aggType){
		var Type = extend(aggType,Aggre);
		aggreTypes[Type.name] = Type;
		var es  =  new EventStore(Type.name,new Store(Type.name));
		var r = new Repository(Type,es);
		repos[Type.name] = r;
	}

	this.repo = function(name){
		return repos[name];
	}

}

module.exports = Domain;