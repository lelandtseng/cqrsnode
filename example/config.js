var db = require('../../cqrsnode.dbstore').Tiny;
var esdriver = require('cqrsnode.eventstore').Tiny;
var dbconfig = require('./dbconfig');
var dbconfig2 = require('./dbconfig2');

module.exports = {

	DB:db,
	ESDriver:esdriver,
	configPath:__dirname,	
	mainPath:'.',
	AggresPath:'Aggres',
	servicesPath:'services',
	queryHandlesPath:'queryHandles',
	commandHandlesPath:'commandHandles',
	eventHandlesPath:'eventHandles',

	dbconfig:dbconfig2
}
