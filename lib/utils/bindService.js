
module.exports = function(services,domain){

	for(var k in services){

		  var service = services[k];	
			services[k] = function(){
				var serv = service;
				var self = {}	
				self.domain = domain;
				serv.call(self,arguments);	
			}
	}

}
