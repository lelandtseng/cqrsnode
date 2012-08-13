
var repo = {}

var commandBus = {

	register:function(commandName,handle){
			repo[commandName] = handle;
	},
  execute:function(command){
			repo[command.__proto__.constructor.name](command);
	}
}

module.exports = commandBus;
