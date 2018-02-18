canvasKnown = document.getElementById("known");
ctxKnown = canvasKnown.getContext("2d");
	
canvasTest = document.getElementById("test");
ctxTest = canvasTest.getContext("2d");

//storing pixel data for images
var actualImgd = [];
var failImgd = [];
var imgName = [];
var transpose = [];
var curr = 0;
var width = 0;
//when document is ready, start to listen to server
$(document).ready(function() {
	socket = io.connect('http://localhost:3000');
	
	//listening to server
	socket.on('images', render);
	fitToContainer();

	ctxKnown.fillRect(0,0, canvasKnown.width, canvasKnown.height);
	ctxTest.fillStyle = "blue";
	ctxTest.fillRect(0,0, canvasTest.width, canvasTest.height);
})


$(window).resize(function() {
	fitToContainer();
	
});



//when window is resized, adjust margins of everything
function fitToContainer() {
	resizeButtons();
	reconfigureArrows();
	

};

function resizeButtons() {
	var rect = canvasKnown.getBoundingClientRect();
	var rightRect = canvasTest.getBoundingClientRect();
	
	$("#phone").css('width', Math.floor(rect.left / 2));
	$("#render").css('width', Math.floor(rect.left / 4));
	$("#remove").css('width', Math.floor(rect.left / 2));
	$("#replace").css('width', Math.floor(rect.left / 2));
	$("#knownDir").css('width', Math.floor(rect.left / 2));
	$("#testDir").css('width', Math.floor(rect.left /2 ));
	width = Math.floor(rect.left / 2);
	console.log($(document).height());
}

function reconfigureArrows() {
	var rect = canvasKnown.getBoundingClientRect();
	var rightRect = canvasTest.getBoundingClientRect();
	
	var rightGap = window.innerWidth - rightRect.right;
	
	//make max 100
	rightGap = Math.min(100, rightGap);
	//make buttons squares
	$("#left").css('width',rightGap);
	$("#left").css('height',rightGap);
	$("#right").css('width', rightGap);
	$("#right").css('height', rightGap);
	
	
	$("#left").css('left',rect.left - rightGap);
	$("#right").css('left', rightRect.right);
	
	$("#left").css('top',rect.top + canvasKnown.height / 2 - rightGap);
	$("#right").css('top',rightRect.top + canvasTest.height / 2 - rightGap);
}



function displayIssue() {
	ctxKnown.clearRect(0,0, canvasKnown.width, canvasKnown.height);
	ctxTest.clearRect(0, 0, canvasTest.width, canvasTest.height);
	
	ctxKnown.putImageData(actualImgd[curr], 0,0)
	ctxTest.putImageData(transpose[curr], 0, 0);

	$('#name').html(imgName[curr]);
}