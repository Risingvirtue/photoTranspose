
function start() {
	//console.log('click');
	var phoneType = $("#phone").val();
	socket.emit('start', {phoneType: phoneType});
	$(".arrow").css('display', 'block');
	//displayIssue();
	//showInfo();
}

//need testing
function resetInfo() {
	ctxKnown.clearRect(0,0, canvasKnown.width, canvasKnown.height);
	ctxTest.clearRect(0,0, canvasTest.width, canvasTest.height);

	$('#name').html('Photo Transpose');
	actualImgd = [];
	failImgd = [];
	imgName = [];
	transpose = [];
	curr = 0;

}
function showRemove() {
	$('.modal').css('display', 'block');
}
function remove() {
	var phoneType = $("#phoneRemove").val();
	socket.emit('remove', {phoneType: phoneType});
	$('.modal').css('display', 'none');
	showAndHide($("#phoneRemove :selected").text() + ' failure folders deleted.');
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

function openKnown() {
	console.log('http://127.0.0.1:8000' + knownDir);
	window.open('http://127.0.0.1:8000' + knownDir);
	//var known = window.open(knownDir);
}

function openTest() {
	console.log(testDir);
	var test =  window.open('http://127.0.0.1:8000' + testDir);
}

