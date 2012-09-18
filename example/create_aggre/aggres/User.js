var uuid = require('node-uuid');
function User(id){
	this._data.id = id;
	this._data.name = 'brighthas';
	this._data.email = 'brighthas@gmail.com';
	this.on('changeName',function(name){
		console.log(name)
	})
}

User.create = function(){
 var user = new this('id003');
 return user;
}

User.prototype = {
	changeName:function(name){
		var event = ['changeName',name];
		this.publish(event);
	},
	updateDate : function(event,data){
		switch(event.name){
			case 'changeName':
				data.name = event.data;
				console.log(123)
			break;
		}
	}
}
module.exports = User;
