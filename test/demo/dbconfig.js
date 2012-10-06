var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

module.exports = {
	url:'localhost',
	dbname:'mydb',
	schemas:{
		Test: {
			name:String,
			age:Number
		}
	}
}
