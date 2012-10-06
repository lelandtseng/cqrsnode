#!/usr/bin/env node


var fs = require('fs');

var projectName = "";
if(process.argv.length > 2){
	projectName = process.argv[2]+'/';
	fs.mkdirSync(projectName);
}

fs.mkdir(projectName+'aggres', function(){});
fs.mkdir(projectName+'commandHandles', function(){});
fs.mkdir(projectName+'eventHandles', function(){});
fs.mkdir(projectName+'extensions', function(){});
fs.mkdir(projectName+'queryHandles', function(){});
fs.mkdir(projectName+'services', function(){});
var cfg = fs.readFileSync(__dirname+'/../lib/config.js','utf-8');
var dbcfg = fs.readFileSync(__dirname+'/../lib/dbconfig.js','utf-8');
fs.writeFileSync(projectName+'config.js',cfg,'utf-8');
fs.writeFileSync(projectName+'dbconfig.js',dbcfg,'utf-8');

