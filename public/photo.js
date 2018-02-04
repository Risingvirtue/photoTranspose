canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");
var height = 1136;
var width = 640;
canvas.height = height;
canvas.width = width;

var actualImgd = [];
var failImgd = [];
var transpose = [];
$(document).ready(function() {
	socket = io.connect('http://localhost:3000');
	socket.emit('start');
	//listening to server
	socket.on('images', render);
})


function start() {
	$('canvas').css('visibility', 'visible');
}

function render(data) {
	for (test of data) {
		
		var actualImg = new Image();
		actualImg.onload = renderActual;
		actualImg.src = test.actualData;
		
	
		var failImg = new Image();
		failImg.onload = renderTest;
		failImg.src = test.failData;
	}
	
	setTimeout(function() {
		for (var i = 0; i < actualImgd.length; i++) {
			//console.log(actualImgd[i]);
			var newData = changePixel(actualImgd[i].data, failImgd[i].data);
			
			failImgd[i].data = newData;
			transpose.push(failImgd[i]);
		}
	}, 0)
}

function renderActual() {
	canvas.width = this.width;
	canvas.height = this.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
	
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	actualImgd.push(imgd);
	//console.log(imgd);
	//return imgd;
}

function renderTest() {
	canvas.width = this.width;
	canvas.height = this.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
	
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	failImgd.push(imgd);

}

function changePixel(actual, fail) {
	for (var i = 0, n = fail.length; i < n; i += 4) {
		var actualPix = {r: actual[i], g: actual[i+1], b: actual[i+ 2], a: actual[i+3]};
		var testPix = {r: fail[i], g: fail[i+1], b: fail[i+ 2]};
		if ( testPix.r == 0 && testPix.g == 0 && testPix.b == 0) {
			fail[i] = actualPix.r;
			fail[i+1] = actualPix.g;
			fail[i+2] = actualPix.b;
			fail[i+3] = actualPix.a;
		}
	}
	
	return fail;

	
}

