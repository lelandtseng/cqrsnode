var CommandBus = require('./CommandBus');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var EventStore = require('./EventStore');
var load = require('./utils/load');
var extendAggre = require('./utils/extendAggre');
var iocCQRS = require('./utils/iocCQRS');
var bindCommand = require('./utils/bindCommand');
var regAggreType = require('./utils/regAggreType');

var defaultOptions = { 
	aggresPath : '/aggres',
	commandsPath : '/commands',
	commandHandlesPath : '/commandHandles',
	eventHandlesPath : '/eventHandles' }

function Domain(options){

	if(!options.mainPath) 
		throw new Error('No set mainPath,please set it.');

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

	this.eventBus = new EventBus(this);
	this.commandBus =  new CommandBus(this);

	load(options.mainPath+options.aggresPath,aggreTypes);
	load(options.mainPath+options.commandsPath,commands);
	load(options.mainPath+options.commandHandlesPath,commandHandles);
	load(options.mainPath+options.eventHandlesPath,eventHandles);


	for(var k in aggreTypes){
		regAggreType(repos,aggreTypes,aggreTypes[k],options.Store,this.eventBus);
	}

	iocCQRS(aggreTypes,this);


	

	this.commands = commands;
	bindCommand(this.commandBus,commands,commandHandles);



	this.repo = function(typeName){
		return repos[typeName];
	}

	this.command = function(name){
		return commands[name];
	}

}

module.exports = Domain;