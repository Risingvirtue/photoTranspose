/*
var morning = [	{r:235, g: 237, b: 79},
				{r:198, g: 196, b: 109},
				{r: 167, g: 162, b: 134},
				{r:123, g: 113, b: 171},
				{r:73, g: 60, b: 210}];

var sunset = [{r:64, g: 40, b: 74},
				{r:115, g: 67, b: 75},
				{r:179, g: 77, b: 37},
				{r:240, g: 126, b: 7},
				{r:247, g: 222, b: 85}];

var highNoon = [{r:238, g: 105, b: 47},
				{r:231, g: 200, b: 69},
				{r:225, g: 176, b: 24},
				{r:231, g: 126, b: 40},
				{r:73, g: 60, b: 210}];
*/

const sunset = [{r:64,g:40,b:74},
			{r:240,g:126,b:7}];
			
const morning = [{r:169 ,g:241, b:246},
				{r:255,g:233,b:166}];

const name = [{r:240,g:126,b:7},{r: 0,g: 0,b: 0}]

var colors = [sunset, morning];
var index = 1;
var currPalette = [{},{}];
var currName = {r:240,g:126,b:7};

var count = 0;

function rgb(dict) {
	return 'rgb(' + dict.r + ',' + dict.g + ',' + dict.b + ')';
}
function getLinearGradient(sky) {

	var allColors = [];
	for (color of sky) {
		var colorString = rgb(color);
		allColors.push(colorString);
	}
	allColors = allColors.join(',');
	return 'linear-gradient(' + allColors + ')';
}



function setCurrPalette(palette) {
	for (var i = 0; i < palette.length; i++) {
		currPalette[i].r = palette[i].r;
		currPalette[i].g = palette[i].g;
		currPalette[i].b = palette[i].b;
	}
}

function backgroundChange() {
	
	var color1 = currPalette;
	var color2 = colors[index]; 
	
	var name1 = currName;
	var name2 = name[index];
	if (count == 20) {
		clearInterval(interval);
		index = (index + 1) % colors.length;
	} else {
		//name
		
		var nr = name2.r - name1.r;
		var ng = name2.g - name1.g;
		var nb = name2.b - name1.b;
			
		var newName = {r: Math.round(count * nr / 20) + name1.r,
						g: Math.round(count * ng / 20) + name1.g,
						b: Math.round(count * nb / 20) + name1.b}
		currName = newName;
		
		for (var i = 0; i < color1.length; i++) {
			//background
			var dr = color2[i].r - color1[i].r;
			var dg = color2[i].g - color1[i].g;
			var db = color2[i].b - color1[i].b;
			
			var newColor = {r: Math.round(count * dr / 20) + color1[i].r,
							g: Math.round(count * dg / 20) + color1[i].g,
							b: Math.round(count * db / 20) + color1[i].b}
			currPalette[i] = newColor;
		}

		count++;
		drawBackground(currPalette);
		drawName(currName);
	}
}

function drawBackground(palette) {
	$('body').css('background', getLinearGradient(palette));
}

function drawName(palette) {
	$('#name').css('color', rgb(palette));
}

function changeColor() {
	count = 0;
	
	if (typeof interval !== 'undefined') {
		clearInterval(interval);
		index = (index + 1) % colors.length;
	}
	interval = setInterval(backgroundChange, 100);
}
setCurrPalette(sunset);
drawBackground(currPalette);

drawName(currName);

