var Domain = require('../..');
var Store = require('../../lib/stores/tiny')
var domain = new Domain({mainPath:__dirname,Store:Store});

var bus = domain.commandBus;
var Command = domain.commands.CreateUser;

setTimeout(function(){
var cmd = new Command();
bus.execute('CreateUser',cmd,function(r){
			
});
},2000);




