var assert = require('assert');
var should = require('should');
var Domain = require('..');
var EventStore = require('../../cqrsnode.eventstore').Tiny;
var DBStore = require('../../cqrsnode.dbstore').Mongoose; 

describe('Domain', function(){
var domain;
var id = null;

 describe('#new', function(){
    it('create new domain', function(done){
        domain = new Domain({mainPath:__dirname+'/dir01',Store:EventStore,dbs:[]});
        done()
    })
  })

describe('#create',function(){

		it('create new User',function(done){
			setTimeout(function(){
				var cmd = {name:'CreateUser'};
				domain.execute(cmd,function(err,result){
					id = result.data('id');
					done()
				});
			},500)
		})

	})

	describe('#command',function(){
		 it('change user name',function(done){
			var cmd = {
				name:'ChangeUserName',
				data:{
					id:id,
					name:"brighthas oklll"
				}
			}

			domain.execute(cmd,function(){
			
			});

		 	done()
		 })
	})


	describe('#findbyID',function(){
		 it('find user',function(done){

		 	var cmd = {name:'FindUser',data:{id:id}};
		 	domain.execute(cmd,function(err,result,next){
		 		next();
				done();
		 	})
		 	
		 })
	})

	
})


