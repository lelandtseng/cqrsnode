module.exports = ServiceBus;

function ServiceBus(Aggres_){

	var services = {}	
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
		services[name].apply(arguments)
	}

}
