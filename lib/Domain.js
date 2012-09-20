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

	var eventBus = new EventBus(this);
	var commandBus =  new CommandBus(this);

	load(options.mainPath+options.aggresPath,aggreTypes);
	load(options.mainPath+options.commandsPath,commands);
	load(options.mainPath+options.commandHandlesPath,commandHandles);
	load(options.mainPath+options.eventHandlesPath,eventHandles);


	for(var k in aggreTypes){
		regAggreType(repos,aggreTypes,aggreTypes[k],options.Store,eventBus);
	}

	iocCQRS(aggreTypes,this);

	bindCommand(commandBus,commands,commandHandles);

	this.repo = function(typeName){
		return repos[typeName];
	}

	this.execute = function(cmd,callback){
		var CMD  =  commands[cmd.name];
		var handle = commandHandles[cmd.name];
		if(!handle){
			callback(new Error('no handle.'))
		}else if(!CMD){
			handle(cmd.name,cmd.data,callback);
		}else{
			try{
				var c = new CMD(cmd.data);
				handle(cmd.name,cmd.data,callback);
			}catch(e){
				callback(e);
			}
		}
	}

	this.on = function(){
		eventBus.on.apply(eventBus,arguments);
	}

	this.once = function(){
		eventBus.once.apply(eventBus,arguments);
	}

	this.emit = function(){
		eventBus.publish.apply(eventBus,arguments);
	}

}

module.exports = Domain;