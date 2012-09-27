module.exports = User; 

function User(){
	// validat	
	this.on('changeName',function(name){
		console.log('now user name is '+this.data('name'));	
	})
}

User.prototype = {
	$updateState:function(){
		this.on('changeName',function(name){
			this.data('name',name);
		})
	},
	changeName:function(name){
		var e = ['changeName',name];
		this.publish(e);
	}
}
