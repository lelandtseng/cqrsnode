var uuid = require('node-uuid');
function User(){
	this._data.name = 'brighthas';
	this._data.email = 'brighthas@gmail.com';
}

User.create = function(){
 var user = new this(uuid.v1());
 return user;
}

module.exports = User;
