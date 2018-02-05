var express = require('express')
var app = express()
var server = app.listen(3000);

var fs = require('fs');
var path = require('path');

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

var directory = getOriginalDirectory();

function newConnection(socket) {
	console.log('New Connection: ' + socket.id);
	
	socket.on('start', start);
	function start() {
		var actualPath = directory  + '\\KnownScreenshots\\iOS\\iPhone SE'

		var testPath = directory + '\\TestScreenshots\\iOS';

		var testFiles = fs.readdirSync(testPath);
		
		var checkFiles = getFails(testFiles);
		
		
		var checkImages = [];
		for (test of checkFiles) {
			for (img of test.img) {
				var actualPath = test.actualPath + '\\' + img;
				var failPath = test.failPath + '\\' + img;
				
				var actualImg = getImage(actualPath);
				var failImg = getImage(failPath);
				
				var actualData =  "data:image/png;base64,"+ actualImg.toString("base64");
				var failData =  "data:image/png;base64,"+ failImg.toString("base64");
				
				var name = img.split('.')[0];
				
				checkImages.push({name: name, actualData: actualData, failData: failData});
				
			}
		}
		
		socket.emit('images', checkImages);
		
	}
	
}

function getOriginalDirectory() {
	var directory = path.dirname(process.argv[1]);
	
	var pathArr = directory.split('\\');
	pathArr.pop();
	
	var OG = pathArr.join('\\');
	return OG;
}

function getFails(testFiles) {
	var checkFiles = [];
	for (var i = 0; i < testFiles.length; i++) {
		var dirName = testFiles[i];
		var fail = dirName.substring(dirName.length - 7);
		var file = dirName.substring(0, dirName.length - 8);
		if (fail == 'failure') {
			var failPath = '..\\TestScreenshots\\iOS' + '\\' +  dirName;
			var truePath = '..\\KnownScreenshots\\iOS\\iPhone SE' + '\\' + file;
			var testImg = fs.readdirSync(failPath);
			checkFiles.push({actualPath: truePath, failPath: failPath, file: file, img: testImg});
		}
	}
	return checkFiles;
}


function getImage(currPath) {
	//console.log(currPath);
	
	var bitmap = fs.readFileSync(currPath);
	return bitmap;

}