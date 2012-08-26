var eventBus = require('./eventBus');
var commandBus = require('./commandBus');
var util = require('util');
var Event = require('./Event');
var Repository = require('./Repository');
var fs = require('fs');
var path = require('path');
var Aggre = require('./Aggre');

var options  =  {
	mainPath:null
}

var repos = {}
var aggres = {}
var eventHandles = {}
var commands = {}
var commandHandles = {}

function load(_path,container){
	var mypath = path.resolve(options.mainPath + _path );
	var names = fs.readdirSync(mypath)
	names.forEach(function(name){
	 var jsname = path.basename(name,'.js');		
	 var jspath = path.resolve(mypath+'/'+jsname);
	 container[jsname] = require(jspath); 
	});
}

function bingEventHandle(){
	for(var n in eventHandles){
		eventBus.on("",n,eventHandles[n])	
	}
}

function bingCommandHandle(){

	for(var n in commands){
		var handle = commandHandles[n+'Handle']
		
		if(handle){
			commandBus.register(n,handle);	
		}
	}
}

function bingRepo(){
	for(var n in aggres){
		var r = new Repository(aggres[n]);
		repos[aggres[n].name] = r;
	}
}

var isInit = false;

module.exports = {
	
	init:function(_options){

		if(!isInit){
		options = _options; 		 

		load('/aggres',aggres);
		load('/eventHandles',eventHandles);
		load('/commands',commands);
		load('/commandHandles',commandHandles);

		bingEventHandle();
		bingCommandHandle();
		bingRepo();

		isInit = true;

		}

	}

 ,aggres:aggres
 ,Event:Event
 ,Aggre:Aggre
 ,commands:commands
 ,commandBus:commandBus
 ,repos:repos

}
