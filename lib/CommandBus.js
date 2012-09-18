function CommandBus(domain){
	this.repo = {};
	this.domain = domain;
}

CommandBus.prototype = {

bind:function(commandName,handle){
	this.repo[commandName] = handle;
},

execute:function(cmdName,command,callback){
	this.repo[cmdName](command,callback);
}

}

module.exports = CommandBus;
