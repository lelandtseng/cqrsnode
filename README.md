Note 
========
publish version 0.0.7alpha , Please note this version is still too unstable.Need to wait for 0.2.0 stable version.

cqrsnode
=========
    CQRS framework for node.js

install
=========
    npm install cqrsnode 

create a app
============
    cqrsnode appName

    result is create dirs:
        Aggres | eventHandles | commandHandles | queryHandles | services


Aggre code example
===================
    
		module.exports = User;

		function User(){

		}
		
		User.prototype = {
		  // all update operating for .
			$updateState:function(){
				this.on('change name',function(name){
				  this.data('name',name);	
				});

				this.on('change age',function(age){
					this.data('age',age);	
				})

				this.on('change',function(info){
					this.data('age',info.age);	
					this.data('name',info.name);	
				})
			},
			changeName:function(name){
				var e = ['change name',name];
				this.publish(e);
			},
			changeAge:function(age){
				var e = ['change age',age];
				this.publish(e);
			},
			changeUser:function(name,age){
				var e = ['change',{name:name,age:age}]	
				this.publish(e);
			}
		}	

		User.findByIds = function(ids,callback){
			...
		}

		User.findByName = function(name,callback){
			...	
		}


command handle example 
======================

    module.exports = {

	  'change user name':function(cmd,callback){
     var User = this.aggre('User')	
		 User.get(cmd,id,function(u,next){
		    u.changeName(cmd.name); 
				callback();
				next();
		 })
	  },

	  'change user age':function(cmd,callback){
     var User = this.aggre('User')	
		 User.get(cmd,id,function(u,next){
		    u.changeAge(cmd.age); 
				callback();
				next();
		 })
	  },

		'transfer':function(cmd,callback){
		   this.service(cmd.id1,cmdid2,cmd.money) 
		}

    }

query handle example
======================
    module.exports = {

    'same user':function(query,callback){
			var User = this.aggre('User');	
			User.findByIds(query.ids,callback)
		},

		'get a user':function(query,callback){
			var User = this.aggre('User');	
			User.findById(query.id,callback)
		}

    }


event handle example
=====================

    module.exports = {

    'User.change name':[
     function(event){},
     function(event){}
    ],

		'User.change age':[
     function(event){},
     function(event){}
    ]
    }

service example
=====================

    module.exports = {
     'transfer':function(id1,id2,money){
		 		var User = this.aggre('User');	 
				var user_1 = null;
				var user_2 = null;
				User.get(id1,function(u,next){
					user_1 = u;
					next();
					User.get(id2,function(u2,next2){
					user_2 = u2;
					next2();
					})	

         	user_1.Outlay(money); 
					user_2.Income(money);

				})
		 }	
		}






