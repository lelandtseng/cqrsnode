var EventStore = require('./EventStore');
var path = require('path');
var fs = require('fs');

module.exports = Loader;

function Loader(cfg,bus){

	var self  =  this;

	var mainPath = path.join(cfg.configPath,cfg.mainPath)
	var AggresPath = path.join(mainPath,cfg.AggresPath);
	var servicesPath = path.join(mainPath,cfg.servicesPath);
	var queryHandlesPath = path.join(mainPath,cfg.queryHandlesPath);
	var commandHandlesPath = path.join(mainPath,cfg.commandHandlesPath);
	var eventHandlesPath = path.join(mainPath,cfg.eventHandlesPath);

	var AggreNames = fs.readdirSync(AggresPath);
	var serviceNames = fs.readdirSync(servicesPath);
	var queryHandleNames = fs.readdirSync(queryHandlesPath);
	var commandHandleNames = fs.readdirSync(commandHandlesPath);
	var eventHandleNames = fs.readdirSync(eventHandlesPath);

	this.DB = new cfg.DB(cfg.dbconfig);
	this.Aggres = {},this.services = {},this.queryHandles = {}, this.commandHandles = {} , this.eventHandles = {};

	AggreNames.forEach(function(name){
		var name = name.split('.')[0];
		self.Aggres[name] = require(path.join(AggresPath,name));	
	})

	load(serviceNames,this.services,servicesPath);
	load(queryHandleNames,this.queryHandels,queryHandlesPath);
	load(commandHandleNames,this.commandHandles,commandHandlesPath);
	
	eventHandleNames.forEach(function(name){
		var name = name.split('.')[0];
		var f = require(path.join(eventHandlesPath,name));	
		
    for(var k in f){
		   if(f.hasOwnProperty(k)){
			 		var args = k.split('.')
					args.push(f[k]);
					bus.publish.apply(bus,args)
		 	 }
 	  }		
	});

	function load(names,container,path){
	 names.forEach(function(name){
		var name = name.split('.')[0];
		var f = require(path.join(path,name));	
		if(typeof f === 'function')	container[name] = f;	
		else{
		   for(var k in f){
			   if(f.hasOwnProperty(k)){
						container[k] = f[k];
				 }
			 }	
		}
	 })
	}

	var ESDriver = cfg.ESDriver;
	var esDriver = new ESDriver();
		
}
