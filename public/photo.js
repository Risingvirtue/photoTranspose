canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");
var height = 1136;
var width = 640;
canvas.height = height;
canvas.width = width;

var actualImgd = [];
var failImgd = [];
var imgName = [];
var transpose = [];
var curr = 0;
$(document).ready(function() {
	
	socket = io.connect('http://localhost:3000');
	
	//listening to server
	socket.on('images', render);
	fitToContainer();
})


$(window).resize(function() {
	fitToContainer();
});


function fitToContainer() {
	$('#start').css('margin-top', canvas.height/ 2 - 50);
	$('#select').css('margin-top', canvas.height / 2 + 25);
	
	$('.left').css('margin-top', canvas.height/ 2 - 50);
	$('.left').css('margin-left', -(canvas.width / 2 + 100));
	$('.right').css('margin-top', canvas.height/ 2 - 50);
	$('.right').css('margin-left', canvas.width / 2 + 50);
};


function start() {
	//console.log('click');
	var phoneType = $("#phone").val();
	socket.emit('start', {phoneType: phoneType});
	//displayIssue();
	$('canvas').css('visibility', 'visible');
	
	$('.left').css('visibility', 'visible');
	$('.right').css('visibility', 'visible');
	$('#render').css('display', 'none');
	$('#select').css('display', 'none');
	
}


//need testing
function resetInfo() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	$('canvas').css('visibility', 'hidden');
	$('.left').css('visibility', 'hidden');
	$('.right').css('visibility', 'hidden');
	$('#render').css('display', 'block');
	$('#select').css('display', 'block');
	actualImgd = [];
	failImgd = [];
	imgName = [];
	transpose = [];
	curr = 0;
	
}
function next() {
	curr = (curr + 1) % transpose.length;
	displayIssue();
	console.log(curr);
}

function prev() {
	
	curr = (curr - 1 + transpose.length)  % transpose.length;
	displayIssue();
	console.log(curr);
}

function displayIssue() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(transpose[curr], 0, 0);
	console.log(imgName[curr]);
	$('#name').html(imgName[curr])
}



function render(data) {
	for (test of data) {
		
		var actualImg = new Image();
		actualImg.onload = renderActual;
		actualImg.src = test.actualData;
		
	
		var failImg = new Image();
		failImg.onload = renderTest;
		failImg.src = test.failData;
		//console.log(test);
		imgName.push(test.name);
	}
	
	setTimeout(function() {
		for (var i = 0; i < actualImgd.length; i++) {
			
			var newData = changePixel(actualImgd[i].data, failImgd[i].data);
			
			failImgd[i].data = newData;
			transpose.push(failImgd[i]);
		}
		
		displayIssue();
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
