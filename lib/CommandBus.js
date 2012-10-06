
module.exports = CommandBus;

function CommandBus(Aggres_,serviceBus_){

	var handles = {};
	var Aggres = Aggres_;
	var serviceBus = serviceBus_;
	var self = this;
	var proxy = {
		service:function(){
			serviceBus.execute(arguments);	
		},
		aggre:function(name){
			return Aggres[name];
		}
	}

	this.bind = function(commandName,handle){
		handles[commandName] = handle;
	}

	this.execute = function(cmdName,command,callback){
		handles[cmdName].call(proxy,command,callback);
	}
}



