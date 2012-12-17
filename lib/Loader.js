var Aggre = require('./Aggre');
var path = require('path');
var fs = require('fs');
var util = require('util');

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
                self.Aggres[AggreObj.aggreName] = (function(AggreObj,Aggre){
                    // 合体
                    function mx(){
                        Aggre.apply(this,arguments);
                        AggreObj.apply(this,arguments);
                    }

                    for(var k in Aggre){
                        mx[k] = Aggre[k];
                    }

                    for(var k in AggreObj){
                        mx[k] = AggreObj[k];
                    }

                    util.inherits(mx,Aggre);

                    for(var k in AggreObj.prototype){
                        mx.prototype[k] = AggreObj.prototype[k];
                    }
                    return mx;
                })(AggreObj,Aggre)
                self.Aggres[AggreObj.aggreName]._db = self.DB;
            }else{
                self.Aggres[name] = (function(AggreObj,Aggre){
                    // 合体
                    function mx(){
                        Aggre.apply(this,arguments);
                        AggreObj.apply(this,arguments);
                    }

                    for(var k in Aggre){
                        mx[k] = Aggre[k];
                    }

                    for(var k in AggreObj){
                        mx[k] = AggreObj[k];
                    }

                    util.inherits(mx,Aggre);

                    for(var k in AggreObj.prototype){
                        mx.prototype[k] = AggreObj.prototype[k];
                    }
                    return mx;
                })(AggreObj,Aggre);
                self.Aggres[name].aggreName = name;
                self.Aggres[name]._db = self.DB;
            }
        }else{
            for(var k in AggreObj){
                var AO = AggreObj[k];
                if(AO.aggreName){
                    self.Aggres[AO.aggreName] = (function(AggreObj,Aggre){
                        // 合体
                        function mx(){
                            Aggre.apply(this,arguments);
                            AggreObj.apply(this,arguments);
                        }

                        for(var k in Aggre){
                            mx[k] = Aggre[k];
                        }

                        for(var k in AggreObj){
                            mx[k] = AggreObj[k];
                        }

                        util.inherits(mx,Aggre);

                        for(var k in AggreObj.prototype){
                            mx.prototype[k] = AggreObj.prototype[k];
                        }
                        return mx;
                    })(AO,Aggre);
                    self.Aggres[AO.aggreName]._db = self.DB;
                }else{
                    self.Aggres[k] = (function(AggreObj,Aggre){
                        // 合体
                        function mx(){
                            Aggre.apply(this,arguments);
                            AggreObj.apply(this,arguments);
                        }

                        for(var k in Aggre){
                            mx[k] = Aggre[k];
                        }

                        for(var k in AggreObj){
                            mx[k] = AggreObj[k];
                        }

                        util.inherits(mx,Aggre);

                        for(var k in AggreObj.prototype){
                            mx.prototype[k] = AggreObj.prototype[k];
                        }
                        return mx;
                    })(AO,Aggre);
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
