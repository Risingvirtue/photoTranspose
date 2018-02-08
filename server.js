var express = require('express')
var app = express()
var server = app.listen(3000);

var fs = require('fs');
var path = require('path');

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);

//listens to localhost
io.sockets.on('connection', newConnection);

var directory = getOriginalDirectory();

function newConnection(socket) {
	console.log('New Connection: ' + socket.id);
	
	socket.on('start', start);
	//when render button is pressed
	function start(data) {
		console.log(data);
		var dirInfo = getFilePath(data.phoneType); //gets path of files based on phone
		
		var actualPath = directory  + dirInfo.actualDir;

		var testPath = directory + dirInfo.testDir;

		var testFiles = fs.readdirSync(testPath); //gets names of all the folders
		
		var checkFiles = getFails(testFiles, dirInfo); // gets all the folders ending in failure
		
		
		var checkImages = [];
		for (test of checkFiles) {
			for (img of test.img) {
				var actualPath = test.actualPath + '\\' + img;
				var failPath = test.failPath + '\\' + img;
				
				var actualImg = getImage(actualPath);
				var failImg = getImage(failPath);
				//converts image to base 64;
				var actualData =  "data:image/png;base64,"+ actualImg.toString("base64");
				var failData =  "data:image/png;base64,"+ failImg.toString("base64");
				
				var name = img.split('.')[0];
				
				
				checkImages.push({name: name, actualData: actualData, failData: failData});
				
			}
		}
		//sends converted images back to client
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

function getFilePath(phoneType) {
	switch (phoneType) {
		case 'se':
			return {actualDir: '\\KnownScreenshots\\iOS\\iPhone SE', testDir: '\\TestScreenshots\\iOS'}
			break;
		case '6gen':
			return {actualDir: '\\KnownScreenshots\\iOS\\iPod 6gen', testDir: '\\TestScreenshots\\iOS'}
			break;
		case 's7':
			return {actualDir: '\\KnownScreenshots\\Android\\s7', testDir: '\\TestScreenshots\\Android'}
			break;
	}
}



function getFails(testFiles, dirInfo) {
	var checkFiles = [];
	for (var i = 0; i < testFiles.length; i++) {
		var dirName = testFiles[i];
		var fail = dirName.substring(dirName.length - 7);
		var file = dirName.substring(0, dirName.length - 8);
		if (fail == 'failure') {
			var failPath = '..' + dirInfo.testDir   + '\\' +  dirName;
			var truePath = '..' + dirInfo.actualDir + '\\' + file;
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