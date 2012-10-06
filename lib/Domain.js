var CommandBus = require('./CommandBus');
var Door = require('./Door');
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

	var loader = new Loader(cfg);
	var serviceBus = new ServiceBus(loader.Aggres);
	var commandBus = new CommandBus(loader.Aggres,serviceBus);
	var eventBus = new EventBus(loader.Aggres,serviceBus);

	var door = new Door(queryBus,commandBus,eventBus);
	


}

module.exports = Domain;

