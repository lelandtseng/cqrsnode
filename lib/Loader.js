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
	this.Aggres = {},this.QAggres = {}, this.services = {},this.queryHandles = {}, this.commandHandles = {} , this.eventHandles = {};

	AggreNames.forEach(function(name){
		var name = name.split('.')[0];
        var AggreObj = require(path.join(AggresPath,name));
        if(typeof AggreObj === 'function'){
            if(AggreObj.aggreName){
                self.Aggres[AggreObj.aggreName] = extend(AggreObj,Aggre,null,true);
                self.Aggres[AggreObj.aggreName]._db = self.DB;
            }else{
                self.Aggres[name] = extend(AggreObj,Aggre,null,true);
                self.Aggres[name].aggreName = name;
                self.Aggres[name]._db = self.DB;
            }
        }else{
            for(var k in AggreObj){
                var AO = AggreObj[k];
                if(AO.aggreName){
                    self.Aggres[AO.aggreName] = extend(AO,Aggre,null,true);
                    self.Aggres[AO.aggreName]._db = self.DB;
                }else{
                    self.Aggres[k] = extend(AO,Aggre,null,true);
                    self.Aggres[k].aggreName = k;
                    self.Aggres[k]._db = self.DB;
                }
            }
        }

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
		QG.aggreName = AG.aggreName;

		for(var key in AG){
		if(key.indexOf('find') != -1 || key == '_db'){
			QG[key] = AG[key];
		}
		}

		return QG;

		})(this.Aggres[k]);	

	}	

}
