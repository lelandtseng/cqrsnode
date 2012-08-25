var eventBus = require('./eventBus');
var commandBus = require('./commandBus');
var util = require('util');
var Event = require('./Event');
var Aggre = require('./Aggre');
var Repository = require('./Repository');
var fs = require('fs');
var path = require('path');

var options  =  {
	mainPath:null
}

var aggres = {}
var repositories = {}
var eventHandles = {}
var commands = {}
var commandHandles = {}
var queries = {}
var queryHandles = {}

function load(_path,container){
	var mypath = path.resolve(options.mainPath + _path );
	var names = fs.readdirSync(mypath)
	names.forEach(function(name){
	    var jsname = path.basename(name,'.js');		
	    var jspath = path.resolve(mypath+'/'+jsname);
	    container[jsname] = require(jspath); 
	});
}

function bingEventHandle(){
	for(var n in eventHandles){
		eventBus.on("",n,eventHandles[n])	
	}
}

function bingCommandHandle(){
	for(var n in commands){
		var handle = commandHandles[n+'Handle']
		
		if(handle){
			commandBus.register(n,handle);	
		}
	}
}

module.exports = {
	
	init:function(_options){

		options = _options; 		 

		load('/domain/aggres',aggres)
		load('/domain/repositories',repositories);
		load('/eventHandles',eventHandles);
		load('/commands',commands);
		load('/commandHandles',commandHandles);
		load('/queries',queries);
		load('/queryHandles',queryHandles);

		bingEventHandle();
		bingCommandHandle()

	}

 ,aggres:aggres
 ,repositories:repositories
 ,factories:factories
 ,entities:entities
 ,Aggre:Aggre
 ,Event:Event
 ,eventBus:eventBus
 ,Repository:Repository
 ,commands:commands
 ,commandBus:commandBus

}
