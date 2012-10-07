var CommandBus = require('./CommandBus');
var Door = require('./Door');
var EventBus = require('./EventBus');
var Aggre = require('./Aggre');
var extend = require('node-extend');
var Repository = require('./Repository');
var EventStore = require('./EventStore');
var load = require('./utils/load');
var ServiceBus = require('./ServiceBus');
var Loader = require('./Loader');
var ioc = require('./utils/ioc');
var QueryBus = require('./QueryBus');

function Domain(cfg){


	var loader = new Loader(cfg);
	var queryBus = new QueryBus(loader.QAggres);
	var serviceBus = new ServiceBus(loader.Aggres);
	var commandBus = new CommandBus(loader.Aggres,serviceBus);
	var eventBus = new EventBus(loader.Aggres,serviceBus);
	var door = new Door(queryBus,commandBus,eventBus);

	if(this.constructor === Domain){
		this.q = function(){
			door.q.apply(door,arguments);
		}	

		this.exec = function(){
			door.exec.apply(door,arguments);
		}
		
		this.on = function(){
			door.on.apply(door,arguments);
		}
		this.once = function(){
			door.once.apply(door,arguments);
		}
	}

	return door;

}

module.exports = Domain;

