module.exports = User;

function User(){

}

User.create = function(name){
	var user = new this();
	user._data.name = name;
	return user;
}

User.prototype = {
	$updateState:function(data){
		this.on('changeName',function(name){
			this.data.name = name;
		})
	},
	changeName:function(name){
		var e = ['changeName',name];
		this.publish(e);
	}
}