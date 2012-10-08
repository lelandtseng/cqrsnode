var db = require('cqrsnode.dbstore').Mongoose;
var esdriver = require('cqrsnode.eventstore').Tiny;
var dbconfig = require('./dbconfig');

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

	dbconfig:dbconfig
}
