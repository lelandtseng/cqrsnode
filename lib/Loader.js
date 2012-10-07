var EventStore = require('./EventStore');
var Aggre = require('./Aggre');
var path = require('path');
var fs = require('fs');
var extend = require('node-extend');

module.exports = Loader;

function Loader(cfg){
	
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
	this.eventStores = {};
	this.Aggres = {},this.QAggres = {}, this.services = {},this.queryHandles = {}, this.commandHandles = {} , this.eventHandles = {};

	AggreNames.forEach(function(name){
		var name = name.split('.')[0];
		self.Aggres[name] = extend(require(path.join(AggresPath,name)),Aggre,null,true);
		self.eventStores[name] = new EventStore(name,new cfg.ESDriver(name));
	})

	load(serviceNames,this.services,servicesPath);
	load(queryHandleNames,this.queryHandles,queryHandlesPath);
	load(commandHandleNames,this.commandHandles,commandHandlesPath);
	
	eventHandleNames.forEach(function(name){
		var name = name.split('.')[0];
		var f = require(path.join(eventHandlesPath,name));	
		
    for(var k in f){
		   if(f.hasOwnProperty(k)){
					var key  =  k.replace('.','');
					if(!self.eventHandles[key]){
						self.eventHandles[key] = [];	
					}
					if(f[k].constructor === Array)
					self.eventHandles[key] = self.eventHandles[key].concat(f[k]);
					else
					self.eventHandles[key].push(f[k]);
		 	 }
 	  }		
	});

	function load(names,container,mypath){
	 names.forEach(function(name){
		var name = name.split('.')[0];
		var f = require(path.join(mypath,name));	
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

	// create QAggres
	for(var k in this.Aggres){


		self.QAggres[k] = (function(A){
			
		var AG = A;
		var QG = {}

		for(var key in AG){
		console.log(key)
		if(key.indexOf('find') != -1){
			QG[key] = function(){
				AG[key].apply(AG,arguments);
			}
		}
		}

		return QG;

		})(this.Aggres[k]);	

	}	
		
}
