var express = require('express')
var app = express()
var server = app.listen(3000);

var fs = require('fs');
var path = require('path');

app.use(express.static('public'));

var socket = require('socket.io');

var io = socket(server);







function getOriginalDirectory() {
	var directory = path.dirname(process.argv[1]);
	
	var pathArr = directory.split('\\');
	pathArr.pop();
	
	var OG = pathArr.join('\\');
	return OG;
	
	
}

var directory = getOriginalDirectory();

var actualPath = directory  + '\\KnownScreenshots\\iOS\\iPhone SE'

var testPath = directory + '\\TestScreenshots\\iOS';

var testFiles = fs.readdirSync(testPath);


var checkFiles = [];
for (var i = 0; i < testFiles.length; i++) {
	var dirName = testFiles[i];
	var fail = dirName.substring(dirName.length - 7);
	if (fail == 'failure') {
		checkFiles += testPath + dirName;
	}
	
}
console.log(testFiles);

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})