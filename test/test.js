var assert = require('assert');
var should = require('should');
var Domain = require('..');
var Store = require('cqrsnode.store').Mem;

describe('Domain', function(){

  describe('#new', function(){
    it('create new domain', function(done){
        var domain = new Domain({mainPath:__dirname+'/dir01',Store:Store});
        done()
    })
  })

})

describe('User',function(){

	var domain = new Domain({mainPath:__dirname+'/dir01',Store:Store});
	var obj = null;
	var id = null;

	describe('#create',function(){

		it('create new User',function(done){
			setTimeout(function(){
				var cmd = {name:'CreateUser'};
				domain.execute(cmd,function(result){
					obj = result;
					result.should.be.a('object');
					done()
				});
			},1000)
		})

	})

	describe('#command',function(){
		 it('change user name',function(done){

		 	obj.changeName('brighthas');
		 	obj._data.name.should.equal('brighthas');
		 	id  =  obj._data.id;
		 	done()
		 })
	})


	describe('#findbyID',function(){
		 it('find user',function(done){

		 	var cmd = {name:'FindUser',data:{id:id}};
		 	domain.execute(cmd,function(result,next){
		 		next();
				done();

		 	})
		 	
		 })
	})

	
})