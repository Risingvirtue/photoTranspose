canvasKnown = document.getElementById("known");
ctxKnown = canvasKnown.getContext("2d");
	
canvasTest = document.getElementById("test");
ctxTest = canvasTest.getContext("2d");

//storing pixel data for images
var actualImgd = [];
var failImgd = [];
var tempImgd = [];
var imgName = [];
var transpose = [];
var fileInfo = [];
var curr = 0;
var width = 0;
var knownDir;
var testDir;
//when document is ready, start to listen to server
$(document).ready(function() {
	
	socket = io.connect('http://localhost:3000');
	
	//listening to server
	socket.on('images', render);
	socket.on('directories', putDir);
	fitToContainer();
})


$(window).resize(function() {
	fitToContainer();
});

//when window is resized, adjust margins of everything
function fitToContainer() {
	resizeButtons();
	reconfigureArrows();
};


window.onclick = function(event) {
	modal = document.getElementById('myModal')
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function resizeButtons() {
	var rect = canvasKnown.getBoundingClientRect();
	var rightRect = canvasTest.getBoundingClientRect();
	
	$("#phone").css('width', Math.floor(rect.left / 2));
	$("#render").css('width', Math.floor(rect.left / 4));
	$("#remove").css('width', Math.floor(rect.left / 2));
	$("#replace").css('width', Math.floor(rect.left / 2));
	$("#knownDir").css('width', Math.floor(rect.left / 2));
	$("#testDir").css('width', Math.floor(rect.left /2 ));
	$("#failDir").css('width', Math.floor(rect.left /2 ));
	$("#dirText").css('width', Math.floor(rect.left / 2));
	width = Math.floor(rect.left / 2);
	//console.log($(document).height());
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
	
	
	$("#left").css('left',rect.left - rightGap - 10);
	$("#right").css('left', rightRect.right + 10);
	
	$("#left").css('top',rect.top + canvasKnown.height / 2 - rightGap);
	$("#right").css('top',rightRect.top + canvasTest.height / 2 - rightGap);
}

function putDir(data) {
	
	knownDir = data.actualPath;
	testDir = data.testPath;
}


function displayIssue() {
	ctxKnown.clearRect(0,0, canvasKnown.width, canvasKnown.height);
	ctxTest.clearRect(0, 0, canvasTest.width, canvasTest.height);
	
	ctxKnown.putImageData(actualImgd[curr], 0,0)
	ctxTest.putImageData(tempImgd[curr], 0, 0);

	$('#name').html(imgName[curr]);
}