canvas = document.getElementById("photo");
ctx = canvas.getContext("2d");

var actual = new Image();
actual.onload = renderActual;
actual.src = "actual.png";
var actualData;


var test = new Image();
//test.onload = renderTest;
test.src = "test.png";
var testData;

/*

canvas.width = 300;
canvas.height = 300;
ctx.fillStyle = "red";
ctx.fillRect(0,0, canvas.width, canvas.height);
var data = ctx.getImageData(0, 0, canvas.width, canvas.height);

console.log(data.data);
*/

function renderActual() {
	console.log('actual');
	canvas.width = actual.width;
	canvas.height = actual.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(actual, 0, 0, canvas.width, canvas.height);
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	actualData = imgd.data;
	console.log(actualData);
	renderTest();
}


function renderTest() {
	console.log('hello');
	canvas.width = test.width;
	canvas.height = test.height;
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.drawImage(test, 0, 0, canvas.width, canvas.height);
	
	var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
	testData = imgd.data;
	console.log(testData);
	

	changePixel(imgd);
	
}

function changePixel(imgd) {
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
	imgd.data = testData;
	console.log(testData);
	ctx.putImageData(imgd, 0, 0);
	//ctx.drawImage(actual, 0,0, canvas.width, canvas.height);

}

