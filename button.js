// Executes the clickFunction when clicked
function Button(x_, y_, w_, h_, text_, hoverText_, sWeight_, tSize_, htSize_, clickFunction_, info_) {
	this.pos = createVector(x_, y_);
	this.dimensions = createVector(w_, h_);
	if (text_ instanceof Function) {
		this.textToDraw = "";
		this.textFunction = text_;
	} else {
		this.textToDraw = text_;
		this.textFunction = null;
	}
	if (hoverText_ instanceof Function) {
		this.hoverTextToDraw = "";
		this.hoverTextFunction = hoverText_;
	} else {
		this.hoverTextToDraw = hoverText_;
		this.hoverTextFunction = null;
	}
	// this.textToDraw = text_;
	// this.hoverTextToDraw = hoverText_;
	
	// // Colours
	// this.fillColour = colourScheme_.fillColour;
	// this.strokeColour = colourScheme_.strokeColour;
	// this.clickedFill = colourScheme_.clickedFill;
	// this.clickedStroke = colourScheme_.clickedStroke;
	// this.textColour = colourScheme_.textColour;

	this.sWeight = sWeight_;
	this.tSize = tSize_;
	this.htSize = htSize_;

	this.clickFunction = clickFunction_;
	this.hovered = false;
	this.clicked = false;
	this.info = info_;
}

// Determines whether the button is being hovered over or clicked, and updates function defined text
Button.prototype.update = function() {
	// Updating text and hover text if a function was entered
	if (this.textFunction != null) {
		this.textToDraw = this.textFunction(this);
	}
	if (this.hoverTextFunction != null) {
		this.hoverTextToDraw = this.hoverTextFunction(this);
	}

	// Updates hovered boolean
	this.hovered = false;
	var mousePos = createVector(myCursor.x, myCursor.y);
	if (rectContains(mousePos, this.pos.x, this.pos.y, this.dimensions.x, this.dimensions.y)) {
		this.hovered = true;
		myCursor.hovering = true;
		if (this.clicked && !myCursor.clicked) {
			this.click();
		}
	}

	// Updates clicked boolean
	this.clicked = false;
	if (myCursor.clicked) {
		var clickPos = createVector(myCursor.clickX, myCursor.clickY);
		if (rectContains(clickPos, this.pos.x, this.pos.y, this.dimensions.x, this.dimensions.y)) {
			this.clicked = true;
		} else {
			this.hovered = false;
			if (rectContains(mousePos, this.pos.x, this.pos.y, this.dimensions.x, this.dimensions.y)) {
				myCursor.hovering = false;
			}
		}
	}
}

// Click!
Button.prototype.click = function() {
	this.clickFunction(this);
}

// Draws the button and the text in it
Button.prototype.draw = function(x, y) {
	if (this.hovered) {
		fill(150);
		stroke(100);
	} else {
		// Switches the colours around when hovered over
		fill(100);
		stroke(150);
	}
	if (this.clicked) {
		fill(75);
		stroke(200);
	}
	
	// You can define the draw location if it is dynamic - e.g. moving buttons
	if (x === undefined) {
		x = this.pos.x;
	}
	if (y === undefined) {
		y = this.pos.y;
	}

	strokeWeight(this.sWeight);
	rect(x, y, this.dimensions.x, this.dimensions.y);

	// Draws text in the centre of the button
	textAlign(CENTER);
	fill(255);
	noStroke();
	if (this.hovered || this.clicked) {
		textSize(this.htSize);
		text(this.hoverTextToDraw, x + this.dimensions.x/2, y + this.dimensions.y/2 + this.tSize/3);//, this.dimensions.x, this.dimensions.y);
	} else {
		textSize(this.tSize);
		text(this.textToDraw, x + this.dimensions.x/2, y + this.dimensions.y/2 + this.tSize/3);//, this.dimensions.x, this.dimensions.y);
	}
}