// Text to be drawn on screen
function Text(x_, y_, text_, tSize_, info_, moveF_) {
	this.startPos = createVector(x_, y_);
	this.pos = this.startPos.copy();

	this.moving = false;

	this.tSize = tSize_;
	if (text_ instanceof Function) {
		this.textToDraw = "";
		this.textFunction = text_;
	} else {
		this.textToDraw = text_;
		this.textFunction = null;
	}

	this.movingFunction = moveF_;

	this.info = info_;
}

// Make the text do its movement
Text.prototype.move = function () {
	this.moving = true;
	this.pos = this.startPos.copy();
}

// Updates the text
Text.prototype.update = function() {
	if (this.textFunction !== null) {
		this.textToDraw = this.textFunction(this);
	}

	// Text can move with the moving function (which is defined when the text object is created)
	if (this.moving && this.movingFunction !== undefined) {
		var pos = this.movingFunction(this);
		this.pos.x = pos[0];
		this.pos.y = pos[1];
	}
}

// Draws the text on the screen
Text.prototype.draw = function() {
	if (this.textToDraw !== false) {
		fill(255);
		noStroke();
		textAlign(CENTER);
		textSize(this.tSize);
		text(this.textToDraw, this.pos.x, this.pos.y);
	}
}
