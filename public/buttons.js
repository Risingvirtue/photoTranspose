
function showInfo() {
	$('canvas').css('visibility', 'visible');
	$('.left').css('visibility', 'visible');
	$('.right').css('visibility', 'visible');
	$('#render').css('display', 'none');
	$('#select').css('display', 'none');
}
function start() {
	//console.log('click');
	var phoneType = $("#phone").val();
	socket.emit('start', {phoneType: phoneType});
	//displayIssue();
	//showInfo();
}

//need testing
function resetInfo() {
	ctx.clearRect(0,0, canvas.width, canvas.height);
	$('canvas').css('visibility', 'hidden');
	$('.left').css('visibility', 'hidden');
	$('.right').css('visibility', 'hidden');
	$('#render').css('display', 'block');
	$('#select').css('display', 'block');
	
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