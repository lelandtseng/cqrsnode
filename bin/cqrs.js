#!/usr/bin/env node

var fs = require('fs');

fs.mkdir('aggres', function(){});
fs.mkdir('commands', function(){});
fs.mkdir('commandHandles', function(){});
fs.mkdir('dbs', function(){});
fs.mkdir('eventHandles', function(){});