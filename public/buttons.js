
function start() {
	actualImgd = [];
	failImgd = [];
	tempImgd = [];
	imgName = [];
	transpose = [];
	fileInfo = [];
	curr = 0;
	width = 0;
	knownDir = '';
	testDir = '';
	var phoneType = $("#phone").val();
	socket.emit('start', {phoneType: phoneType});
	$(".arrow").css('display', 'block');

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
	fileInfo = [];
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

function replaceImg() {
	
	socket.emit('replace', imgName[curr]);
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
	console.log(knownDir);
	$("#dirText").html(knownDir + '\\' + fileInfo[curr]);
	$("#dirText").select();
    document.execCommand('copy');
	showAndHide('Copied.')
	//var known = window.open(knownDir);
}

function openTest() {
	$("#dirText").html(testDir + '\\'+  fileInfo[curr]);
	$("#dirText").select();
    document.execCommand('copy');
	showAndHide('Copied.')
}


function openFail() {
	$("#dirText").html(testDir + '\\' + fileInfo[curr] + '_failure');
	$("#dirText").select();
    document.execCommand('copy');
	showAndHide('Copied.')
}


