Note
========
publish version 0.0.1 alpha , Please note this version is still too unstable.Need to wait for 0.0.2 version.


Tutorial
========
[Tutorials](https://github.com/brighthas/cqrsnode/wiki)

cqrsnode
=========
    CQRS framework for node.js


install
=========

    npm install cqrsnode 


    and
    
    var	Domain  = require('cqrsnode');

    var domain1 = new Domain(cfg,domainname);
    var domain2 = new Domain(domainname);
    var domain3 = new Domain(cfg);

		domain1.on('User','changeName',function cb(){...})
		domain1.once('Product','price',function cb(){...})

		var query01 = ['alluser']
		domain1.q(query01,function callback(){...})

		var cmd01 = ['changeUserName','id001','leo']
		domain1.exec(com01,function cb(){...})


example
=========

    cqrsnode appName

    result is create dirs:
        Aggres | eventHandles | commandHandles | queryHandles | services

    
Aggre API and Example:
=======================

		// create like it at /aggres dir.

		module.exports = User;

		function User(){}

		User.prototype = {

			// this function change aggre state,
			// state is aggre._data private state.
			// when aggre emit a event, you can use this function to listen.
			$updateState:function(){
				// example, listen 'changeName' event.
				this.on('changeName',function(name){
					// this.data is aggre._data.
					this.data('name',name);
				})
			},

			// you can create self function,
			// and each function will emit event,
			// so you use "this.publish" emit event.
			// please don't use this function change self._data, 
			// aggre function only create event and publish.
			// change self state , please write in $updateSate function.
			changeName:function(name){
				var e = ['changeName',name];
				this.publish(e);
			},

			// ... you can create other functions,
			// top only a example of function.
		}


