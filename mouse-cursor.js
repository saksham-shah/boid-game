// Cursor object
function mouseCursor() {
	this.x = -100;
	this.y = -100;
	this.offset = createVector(0,0);
	this.hovering = false;
	this.clicked = false;
	this.clickX = 0;
	this.clickY = 0;
	this.rotation = -0.15;
	this.r = 5;
	this.restTime = 0;
	this.clickTime = 0;
}

// Updates the state of the cursor - e.g. if it is clicked, hovering etc.
mouseCursor.prototype.update = function() {
	var onScreen = rectContains(createVector(mouseX, mouseY), -50, -50, width + 100, height + 100)
	if ((this.x == mouseX && this.y == mouseY) || !onScreen) {
		// If the cursor is still for a long time, it disappears
		this.restTime++;
	} else {
		this.restTime = 0;
	}

	if (onScreen) {
		this.x = mouseX + this.offset.x;
		this.y = mouseY + this.offset.y;
	}

	if (mouseIsPressed) {
		if (this.clicked == false) {
			this.clickX = this.x;
			this.clickY = this.y;
			this.clickTime = 0;
		}
		this.clicked = true;
		this.clickTime++
		this.restTime = 0;
		this.r = 4;
	} else {
		this.clicked = false;
		this.clickTime = 0;
		this.r = 5;
	}

	// this.offset.x += random(-5,5);
	// this.offset.y += random(-5,5);
}

// Draws the cursor according to its state
mouseCursor.prototype.draw = function() {
	// Only draws the cursor if it has recently moved
	if (this.restTime < 100) {
		push();

		// This makes the cursor easier to draw
		translate(this.x, this.y);
		rotate(PI * this.rotation);

		fill(100, 0, 0);
		strokeWeight(1);
		stroke(50, 0, 0);

		// Different colour if hovering
		if (this.hovering) {
			this.restTime = 0;
			fill(0, 100, 0);
			stroke(0, 50, 0);
		}
		
		// Draws an arrow
		beginShape();
		vertex(0 * this.r, 0 * this.r);
		vertex(2 * this.r, 3 * this.r);
		vertex(1 * this.r, 4 * this.r);
		vertex(0 * this.r, 1 * this.r);
		vertex(-1 * this.r, 4 * this.r); 
		vertex(-2 * this.r, 3 * this.r);
		vertex(0 * this.r, 0 * this.r);
		endShape();
		pop();
	}

	this.hovering = false;
}