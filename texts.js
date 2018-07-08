// Text to be drawn on screen
function Text(x_, y_, text_, tSize_, info_) {
	this.x = x_;
	this.y = y_;
	this.moving = false;

	this.tSize = tSize_;
	if (text_ instanceof Function) {
		this.textToDraw = "";
		this.textFunction = text_;
	} else {
		this.textToDraw = text_;
		this.textFunction = null;
	}
	this.info = info_;
}

// Updates the text
Text.prototype.update = function() {
	if (this.textFunction !== null) {
		this.textToDraw = this.textFunction(this);
	}

	if (this.moving) {
		var pos = this.movingFunction(this);
		this.x = pos[0];
		this.y = pos[1];
	}
}

// Draws the text on the screen
Text.prototype.draw = function() {
	if (this.textToDraw !== false) {
		fill(255);
		noStroke();
		textAlign(CENTER);
		textSize(this.tSize);
		text(this.textToDraw, this.x, this.y);
	}
}