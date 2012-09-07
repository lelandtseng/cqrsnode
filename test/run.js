var cqrs = require('..');
cqrs.init({mainPath:__dirname});

var bus = cqrs.commandBus;
console.log(cqrs.commands);
var ChangeCommand = cqrs.commands.ChangeUserName;
var Command = cqrs.commands.CreateUser;


setTimeout(function(){

var cmd = new Command();
bus.execute(cmd,function(r){
	console.log(r)	
});

/*

	var cmd = new ChangeCommand('90938b30-f01a-11e1-af18-61547d0c9da4','bright');
	bus.execute(cmd,function(r){
		console.log(r)	
	});
*/

},1000);

