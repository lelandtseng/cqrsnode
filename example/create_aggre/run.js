var cqrs = require('../..');
cqrs.init({mainPath:__dirname});

var bus = cqrs.commandBus;
var Command = cqrs.commands.CreateUser;

setTimeout(function(){
var cmd = new Command();
bus.execute(cmd,function(r){
			
});
},1000);




