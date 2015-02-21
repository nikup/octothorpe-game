var canvas, context, elements, config;

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.oRequestAnimationFrame ||
          function(callback) {
            window.setTimeout(callback, 1000 / 60);
          };

function init() {
	canvas = document.getElementById("game-canvas");
	context = canvas.getContext("2d");

	canvas.width = 1000;
	canvas.height = 500;
	canvas.style.display = "inline";

	context.font = canvas.height / 2 + "px Times New Roman";
	context.textAlign = "center";
	context.textBaseline = "middle";

	$.getJSON("data.json", function(data) {
	   elements = data.elements;
	   config = data.config;
	});
}

function animate() {
	window.requestAnimationFrame(animate);

	context.clearRect(0,0,canvas.width, canvas.height);
	//context.fillText(new Date().toTimeString().substr(0, 8), canvas.width / 2, canvas.height / 2);
	drawElements();
	updateElements();
}

function drawElements() {
	if (!elements) {
		return;
	};

	_.each(elements, function (e) {
		drawElement(e);
	});
}

function drawElement(element) {
	context.fillColor = element.color || "#000000";
	context.fillRect(element.x, element.y, element.width, element.height);
}

function updateElements() {
	if (!elements || !config) {
		return;
	};

	var activeElements = _.filter(elements, function (e) {
		return e.active;
	});

	_.each(activeElements, function (e) {
		e.y += config.speed || 1;
	})
}

function keyPressed(keyCode) {
	if (!elements) {
		return;
	};

	var activeElements = _.filter(elements, function (e) {
		return e.active;
	});

	switch(keyCode) {
		case 40:
			_.each(activeElements, function (e) {
				e.y += 10;
			});
			break;
		case 38: 
			_.each(activeElements, function (e) {
				e.y -= 10;
			});
			break;
		case 37: 
			_.each(activeElements, function (e) {
				e.x -= 10;
			});
			break;
		case 39: 
			_.each(activeElements, function (e) {
				e.x += 10;
			});
			break;
	}

}