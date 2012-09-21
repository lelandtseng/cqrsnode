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
var bindEventHandle = require('./utils/bindEventHandle');


var defaultOptions = { 
	aggresPath : '/aggres',
	commandsPath : '/commands',
	commandHandlesPath : '/commandHandles',
	eventHandlesPath : '/eventHandles' }

function Domain(options){

	var self = this;
	// external use.
	var proxy01 = {
		execute:function(cmd,callback){
			self.execute(cmd,callback);
		}
	}

	// command handle,event handle and aggre use.
	var proxy02 = {
		repo:function(typeName){
			return self.repo(typeName);
		}
	}

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

	var eventBus = new EventBus(proxy02);
	var commandBus =  new CommandBus(proxy02);

	load(options.mainPath+options.aggresPath,aggreTypes);
	load(options.mainPath+options.commandsPath,commands);
	load(options.mainPath+options.commandHandlesPath,commandHandles);
	load(options.mainPath+options.eventHandlesPath,eventHandles);

	for(var k in aggreTypes){
		regAggreType(repos,aggreTypes,aggreTypes[k],options.Store,eventBus);
	}

	iocCQRS(aggreTypes,proxy02);
	bindCommand(commandBus,commands,commandHandles);
	bindEventHandle(eventHandles,eventBus);

	this.repo = function(typeName){
		return repos[typeName];
	}

	this.execute = function(cmd,callback){
		var CMD  =  commands[cmd.name];
		var handle = commandHandles[cmd.name];
		if(!handle){
			callback(new Error('no handle.'))
		}else if(!CMD){
			
		}else{
			try{
				var c = new CMD(cmd.data);
				commandBus.execute(cmd.name,cmd.data,callback);
			}catch(e){
				callback(e);
			}
		}
	}

	return proxy01;
}

module.exports = Domain;