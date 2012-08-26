
var repo = {}

var commandBus = {

	register:function(commandName,handle){
			repo[commandName] = handle;
	},
  execute:function(command,callback){
			repo[command.__proto__.constructor.name](command,callback);
	}
}

module.exports = commandBus;
