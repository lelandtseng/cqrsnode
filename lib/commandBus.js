
var repo  =  {};

module.exports {

register:function(commandName,handle){
	repo[commandName] = handle;
},

execute:function(command,callback){
	repo[command.__proto__.constructor.name](command,callback);
}

}
