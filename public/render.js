//gets data from server (base64 conversion of images) and 
function render(data) {
	resetInfo();
	//console.log(data);
	for (test of data) {
		
		//creates images
		var actualImg = new Image();
		actualImg.onload = renderActual; //gets pixel information
		actualImg.src = test.actualData;
		

		var failImg = new Image();
		failImg.onload = renderTest;  //gets pixel information
		failImg.src = test.failData;
	
		imgName.push(test.name);
		fileInfo.push(test.fileInfo);
	}
	
	setTimeout(function() {
		
		for (var i = 0; i < actualImgd.length; i++) {
			
			var newData = changePixel(tempImgd[i].data, failImgd[i].data);
			
			tempImgd[i].data = newData;
			transpose.push(tempImgd[i]);
		}

		fitToContainer(); 
		if (transpose.length != 0) {
			//showInfo();
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
	$("#failure").css({opacity: 0, visibility: "visible"}).animate({opacity: 1}, 1500);
	$("#failure").css({opacity: 1, visibility: "visible"}).animate({opacity: 0}, 1500);
}

function renderActual() {
	canvasKnown.width = this.width;
	canvasKnown.height = this.height;
	//draws image onto the canvas and gets pixel information
	ctxKnown.clearRect(0,0, canvasKnown.width, canvasKnown.height);
	ctxKnown.drawImage(this, 0, 0, canvasKnown.width, canvasKnown.height);
	var imgd = ctxKnown.getImageData(0, 0, canvasKnown.width, canvasKnown.height);

	actualImgd.push(imgd); //stores info
	var secondImgd = ctxKnown.getImageData(0, 0, canvasKnown.width, canvasKnown.height);
	tempImgd.push(secondImgd);
	
}

// gets pixel information
function renderTest() {
	canvasTest.width = this.width;
	canvasTest.height = this.height;
	
	//draws image onto the canvas and gets pixel information
	ctxTest.clearRect(0,0, canvasTest.width, canvasTest.height);
	ctxTest.drawImage(this, 0, 0, canvasTest.width, canvasTest.height);
	var imgd = ctxTest.getImageData(0, 0, canvasTest.width, canvasTest.height);
	failImgd.push(imgd);  //stores info

}

//changes black pixels of test to known pixel
function changePixel(temp, fail) {
	var pixels = [];
	for (var i = 0, n = fail.length; i < n; i += 4) {
		var actualPix = {r: temp[i], g: temp[i+1], b: temp[i+ 2], a: temp[i+3]};
		var testPix = {r: fail[i], g: fail[i+1], b: fail[i+ 2], a: fail[i+3]};
		if (testPix.r != 0 || testPix.g != 0 || testPix.b != 0) {
			temp[i] = testPix.r;
			temp[i+1] = testPix.g;
			temp[i+2] = testPix.b;
			temp[i+3] = testPix.a;
		} 
	}
	
	return temp;
}
