var cqrs = require('../lib/CQRS');

cqrs.init({mainPath:__dirname});

var userRepo = cqrs.repos['User'];

setTimeout(function(){

	userRepo.findById('77618e40-ef80-11e1-a891-e726540d9cb6',function(u,next){
		u.changeName('brighthas');
		next();
	})
},1000);

