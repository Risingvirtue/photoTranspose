canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");
var height = 1136;
var width = 640;
canvas.height = height;
canvas.width = width;

//storing pixel data for images
var actualImgd = [];
var failImgd = [];
var imgName = [];
var transpose = [];
var curr = 0;

//when document is ready, start to listen to server
$(document).ready(function() {
	
	socket = io.connect('http://localhost:3000');
	
	//listening to server
	socket.on('images', render);
	fitToContainer();
})


$(window).resize(function() {
	fitToContainer();
});

//when window is resized, adjust margins of everything
function fitToContainer() {
	/*
	var ratio = ($(window).height() * 2 / 3) / canvas.height;
	canvas.height = $(window).height() * 2 / 3;
	canvas.width = ratio * canvas.width;
	
	*/
	$('#start').css('margin-top', canvas.height/ 2 - 50);
	$('#select').css('margin-top', canvas.height / 2 + 25);
	
	$('.left').css('margin-top', canvas.height/ 2 - 50);
	$('.left').css('margin-left', -(canvas.width / 2 + 100));
	$('.right').css('margin-top', canvas.height/ 2 - 50);
	$('.right').css('margin-left', canvas.width / 2 + 50);
};

//when render button is clicked
function start() {
	//console.log('click');
	var phoneType = $("#phone").val();
	
	//gets path for type of phone from server
	socket.emit('start', {phoneType: phoneType});
	
	//displayIssue();
	
	//hide buttons and reveal canvas
	$('canvas').css('visibility', 'visible');
	$('.left').css('visibility', 'visible');
	$('.right').css('visibility', 'visible');
	$('#render').css('display', 'none');
	$('#select').css('display', 'none');
	
	
}

//go through images
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

//displays current image
function displayIssue() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.putImageData(transpose[curr], 0, 0);
	console.log(imgName[curr]);
	$('#name').html(imgName[curr])
}


//gets data from server (base64 conversion of images) and 
function render(data) {
	for (test of data) {
		
		//creates images
		var actualImg = new Image();
		actualImg.onload = renderActual; //gets pixel information
		actualImg.src = test.actualData;
		
	
		var failImg = new Image();
		failImg.onload = renderTest;  //gets pixel information
		failImg.src = test.failData;
	
		imgName.push(test.name);
	}
	
	setTimeout(function() {
		for (var i = 0; i < actualImgd.length; i++) {
			
			var newData = changePixel(actualImgd[i].data, failImgd[i].data);
			
			failImgd[i].data = newData;
			transpose.push(failImgd[i]);
		}
		fitToContainer();
		displayIssue();
		
	}, 0)
}

// gets pixel information
function renderActual() {
	canvas.width = this.width;
	canvas.height = this.height;
	//draws image onto the canvas and gets pixel information
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	actualImgd.push(imgd); //stores info
	//console.log(imgd);
	//return imgd;
}

// gets pixel information
function renderTest() {
	canvas.width = this.width;
	canvas.height = this.height;
	
	//draws image onto the canvas and gets pixel information
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	failImgd.push(imgd);  //stores info

}

//changes black pixels of test to known pixel
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
