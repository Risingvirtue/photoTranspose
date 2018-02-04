canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");
var height = 1136;
var width = 640;
canvas.height = height;
canvas.width = width;


function b64(e){var t="";var n=new Uint8Array(e);var r=n.byteLength;for(var i=0;i<r;i++){t+=String.fromCharCode(n[i])}return window.btoa(t)}
/*
var actual = new Image();
actual.onload = testing
actual.src = "actual.png";
var actualInfo;
var actualData;


var test = new Image();

test.src = "test.png";
var testData;
*/
$(document).ready(function() {
	socket = io.connect('http://localhost:3000');
	//listening to server
	
	socket.on('images', render);
})


function start() {
	socket.emit('start');
}




function render(data) {
	console.log(canvas.height, canvas.width);
	//var array = new Uint8ClampedArray(data.actualImg);
	//var img = new ImageData(array, canvas.width, canvas.height);
	//var src = "data:image/png;base64,"+ b64(data.actualImg)
	//console.log(src);
	var img = new Image();
	img.src = data.actualImg;
	console.log(data.actualImg);
	setTimeout(function () {
		console.log('hello');
		ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	}, 4000)
	
	//ctx.fillRect(0,0, canvas.width, canvas.height);
	//renderActual(data.actualImg);
	/*
	for (test of data) {
		for (img of test.img) {
			var actualPath = test.actualPath + '\\' + test.file + '\\' + test.img;
			var failPath = test.failPath + '\\' + test.file + '\\' + test.img;
			renderActual(actualPath);
		}
	}
	*/
}

function renderActual(actualPath) {
	console.log(actualPath);
	
	var actual = new Image();
	actual.src = actualPath;
	console.log(actual.height);
	canvas.width = actual.width;
	canvas.height = actual.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	//ctx.drawImage(actual, 0, 0, canvas.width, canvas.height);
	//var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	//console.log(imgd);
	//return imgd;
}

function renderTest() {
	console.log('hello');
	canvas.width = test.width;
	canvas.height = test.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(test, 0, 0, canvas.width, canvas.height);
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	actualInfo = imgd;
	testData = imgd.data;
	console.log(testData);
}

function changePixel() {
	for (var i = 0, n = testData.length; i < n; i += 4) {
		var actualPix = {r: actualData[i], g: actualData[i+1], b: actualData[i+ 2], a: actualData[i+3]};
		var testPix = {r: testData[i], g: testData[i+1], b: testData[i+ 2]};
		if ( testPix.r == 0 && testPix.g == 0 && testPix.b == 0) {
			testData[i] = actualPix.r;
			testData[i+1] = actualPix.g;
			testData[i+2] = actualPix.b;
			testData[i+3] = actualPix.a;
		}
	}
	actualInfo.data = testData;
	console.log(testData);
	ctx.putImageData(actualInfo, 0, 0);
	$("#photo").css('visibility', 'visible');
}

