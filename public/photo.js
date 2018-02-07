canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");

var memory = document.getElementById("memory");

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
	if (transpose.length != 0) {
		displayIssue()
	}
});


function fitToContainer() {
	var ratio = ($( window ).height() * 2/ 3) / canvas.height;
	console.log(ratio);
	canvas.height = canvas.height * ratio;
	canvas.width = canvas.width * ratio;
	$("#failure").css('margin-top', canvas.height/ 2 - 100);
	$('#start').css('margin-top', canvas.height/ 2 - 50);
	$('#select').css('margin-top', canvas.height / 2 + 25);
	
	$('.left').css('margin-top', canvas.height/ 2 - 50);
	$('.left').css('margin-left', -(canvas.width / 2 + 100));
	$('.right').css('margin-top', canvas.height/ 2 - 50);
	$('.right').css('margin-left', canvas.width / 2 + 50);
};

function displayIssue() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
		var imageData = transpose[curr];
		
		memory.width = imageData.width;
		memory.height = imageData.height;
		
		memory.getContext("2d").putImageData(imageData, 0, 0);
		
		ctx.drawImage(memory, 0, 0, canvas.width, canvas.height);

	console.log(imgName[curr]);
	$('#name').html(imgName[curr]);
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
		fitToContainer(); //makes adjusted canvas the same next, put everything onto temp canvas
		
		if (transpose.length != 0) {
			displayIssue();
		} else {
			var phoneText = 'No failures for ' +  $("#phone :selected").text() + '.'
			resetInfo();
			showAndHide(phoneText);
			
		}
		
	}, 0)
}

function showAndHide(phoneText) {
	$("#failure").html(phoneText);
	
	
	
	$("#failure").fadeToggle("slow", function() {
		$("#failure").fadeToggle("slow");
	});
	
	
}
function renderActual() {
	canvas.width = this.width;
	canvas.height = this.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	actualImgd.push(imgd);
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
