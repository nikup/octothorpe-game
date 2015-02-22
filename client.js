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

	$.getJSON("data.json", function(data) {
	   elements = data.elements;
	   config = data.config;
	});
}

function animate() {
	window.requestAnimationFrame(animate);

	context.clearRect(0,0,canvas.width, canvas.height);
	updateElements();
	drawElements();
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
	context.fillStyle = element.color || "#000000";
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
		var boundToElement = _.find(elements, function (element) {
			return element.id === e.boundTo;
		});

		if (boundToElement) {
			var x = _.min([e.x, boundToElement.x]),
				y = _.min([e.y, boundToElement.y]),
				width = Math.abs(e.y - boundToElement.y) < 10 ? e.width + boundToElement.width : e.width, 
				height = Math.abs(e.x - boundToElement.x) < 10 ? e.height + boundToElement.height : e.height;
		};

		_.each(elements, function (second) {
			if(second.stage && second.player === e.player) {
				if (second.y + second.height <= (y || e.y) + (height || e.height)) {
					e.active = false;
					e.y = second.y + second.height - e.height;
				}

				if (second.x + second.width <= (x || e.x) + (width || e.width)) {
					if (boundToElement && e.x < boundToElement.x) {
						e.x = second.x + second.width - e.width - boundToElement.width;	
					} else {
						e.x = second.x + second.width - e.width;
					}
				}

				if (second.x >= (x || e.x)) {
					if (boundToElement && e.x > boundToElement.x) {
						e.x = second.x + e.width;	
					} else {
						e.x = second.x;
					}
				}
			} else if (second.static && second.player === e.player) {
				if ((x || e.x) < second.x + second.width &&
					   (x || e.x) + (width || e.width) > second.x &&
					   (y || e.y) < second.y + second.height &&
					   (height || e.height) + (y || e.y) > second.y) {

				    if (second.y <= (y || e.y) + (height || e.height)) {
						e.active = false;
						e.y = second.y - e.height;
					}
				}
			}
		});
	});
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
				//detectForColisionsLeft(e);
			});
			break;
		case 39: 
			_.each(activeElements, function (e) {
				e.x += 10;
				detectForColisionsRight(e);
			});
			break;
	}

	function detectForColisionsLeft(e) {
		var boundToElement = _.find(elements, function (element) {
			return element.id === e.boundTo;
		});

		if (boundToElement) {
			var x = _.min([e.x, boundToElement.x]),
				y = _.min([e.y, boundToElement.y]),
				width = Math.abs(e.y - boundToElement.y) < 10 ? e.width + boundToElement.width : e.width, 
				height = Math.abs(e.x - boundToElement.x) < 10 ? e.height + boundToElement.height : e.height;
		};
		_.each(elements, function (second) {
			if ((x || e.x) < second.x + second.width &&
			   (x || e.x) + (width || e.width) > second.x &&
			   (y || e.y) < second.y + second.height &&
			   (height || e.height) + (y || e.y) > second.y) {

				if (second.x <= (x || e.x) + (width || e.width)) {
					if (boundToElement && e.x < boundToElement.x) {
						e.x = second.x - e.width - boundToElement.width;	
					} else {
						e.x = second.x - e.width;
					}
				} 
			}
		});
	}

	function detectForColisionsRight(e) {
		var boundToElement = _.find(elements, function (element) {
			return element.id === e.boundTo;
		});

		if (boundToElement) {
			var x = _.min([e.x, boundToElement.x]),
				y = _.min([e.y, boundToElement.y]),
				width = Math.abs(e.y - boundToElement.y) < 10 ? e.width + boundToElement.width : e.width, 
				height = Math.abs(e.x - boundToElement.x) < 10 ? e.height + boundToElement.height : e.height;
		};
		_.each(elements, function (second) {
			if (second.static && second.player === e.player) {
				if ((x || e.x) < second.x + second.width &&
				   (x || e.x) + (width || e.width) > second.x &&
				   (y || e.y) < second.y + second.height &&
				   (height || e.height) + (y || e.y) > second.y) {

					if (second.x + second.width >= (x || e.x)) {
						if (boundToElement && e.x < boundToElement.x) {
							e.x = second.x - boundToElement.width - e.width;	
						} else {
							e.x = second.x - e.width;
						}
					}
				}
			}
		});
	}

}