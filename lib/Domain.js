var CommandBus = require('./CommandBus');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var EventStore = require('./EventStore');
var load = require('./utils/load');
var extendAggre = require('./utils/extendAggre');
var iocCQRS = require('./utils/iocCQRS');

var defaultOptions = { 
	aggresPath : '/aggres',
	commandsPath : '/commands',
	commandHandlesPath : '/commandHandles',
	eventHandlesPath : '/eventHandles' }

function Domain(options){

	if(!options.mainPath) 
		throw new Error('no set mainPath,please set.');

	var options = options;
	for(var k in defaultOptions){
		if(options[k]);
		else{
			options[k] = defaultOptions[k];
		}
	}

	var Store = options.Store;

	var aggreTypes = {};
	var repos = {};
	var commands = {};
	var commandHandles = {};
	var eventHandles = {};

	load(options.mainPath+options.aggresPath,aggreTypes);
	load(options.mainPath+options.commandsPath,commands);
	load(options.mainPath+options.commandHandlesPath,commandHandles);
	load(options.mainPath+options.eventHandlesPath,eventHandles);

	extendAggre(aggreTypes,this);
	iocCQRS(aggreTypes,this);


	this.regAggreType = function(aggType){
		var Type = extend(aggType,Aggre);
		aggreTypes[Type.name] = Type;
		var es  =  new EventStore(Type.name,new Store(Type.name));
		var r = new Repository(Type,es,this.eventBus);
		repos[Type.name] = r;
	}


	this.eventBus = new EventBus(this);

	this.commandBus =  new CommandBus(this);

	this.repo = function(typeName){
		return repos[typeName];
	}

	this.command = function(name){
		return commands[name];
	}

}

module.exports = Domain;