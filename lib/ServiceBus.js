module.exports = ServiceBus;

function ServiceBus(Aggres_,services_){

	var services = services_;
	var Aggres = Aggres_;
	var self = this;

	var proxy = {
		service:function(){
			self.execute.apply(self,arguments);			
		},
		aggre:function(name){
			return Aggres[name];
		}
	}

	this.bind = function(serviceName,service){
		services[serviceName] = service;	
	}

	this.execute = function(){
		var name = [].shift.apply(arguments);
		var Serv = services[name];
        Serv.apply(proxy,arguments);
	}

}
