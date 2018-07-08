// Used in the game to make it seem like it is following the player
function Camera(x_, y_, xBound_, yBound_, toFollow_) {
	this.x = x_;
	this.y = y_;
	this.xBound = xBound_;
	this.yBound = yBound_;

	this.buffer = 100;

	this.scrollSpeed = 5;
	this.toFollow = toFollow_;

	// Used in mouse run when hit
	this.flashTimer = 0;
	this.flashColour = color(255);
	this.shake = 0;
}

// Updates the position of the camera
Camera.prototype.update = function() {
	this.follow();
	this.borders();

	if (this.shake > 0) {
		this.x += random(-this.shake * 0.3, this.shake * 0.3);
		this.y += random(-this.shake * 0.3, this.shake * 0.3);
		this.shake -= 1;
	}
}

// Restricts the camera to the borders of the game
Camera.prototype.borders = function() {
	if (this.x < width/2 - this.buffer) {
		this.x = width/2 - this.buffer;
	} else if (this.x > this.xBound - width/2 + this.buffer) {
		this.x = this.xBound - width/2 + this.buffer;
	}
	if (this.y < height/2 - this.buffer) {
		this.y = height/2 - this.buffer;
	} else if (this.y > this.yBound - height/2 + this.buffer) {
		this.y = this.yBound - height/2 + this.buffer;
	}
}

// Follows the player
Camera.prototype.follow = function() {
	this.x = this.toFollow.pos.x;
	this.y = this.toFollow.pos.y;
}

// Unused - uses arrow keys to scroll the camera
Camera.prototype.arrowKeys = function() {
	if (keyIsDown("A".charCodeAt(0))) {
		this.x -= this.scrollSpeed;
	}
	if (keyIsDown("D".charCodeAt(0))) {
		this.x += this.scrollSpeed;
	}
	if (keyIsDown("W".charCodeAt(0))) {
		this.y -= this.scrollSpeed;
	}
	if (keyIsDown("S".charCodeAt(0))) {
		this.y += this.scrollSpeed;
	}
}

// A red border appears for a moment
Camera.prototype.flash = function(colour) {
	this.flashColour = colour;
	this.flashTimer = 10;
}

// Draws the camera - right now it just draws the flash
Camera.prototype.draw = function() {
	if (this.flashTimer > 0) {
		noFill();
		stroke(this.flashColour);
		strokeWeight(25);
		rect(0, 0, width, height);

		this.flashTimer -= 1;
	}
}

// Used in race to point to the next node
function Pointer(colour_, r_) {
	this.colour = colour_;
	this.r = r_;
}

// Points towards the location of 'pos'
Pointer.prototype.draw = function(pos, camera) {
	var point = createVector(pos.x - camera.x + width/2, pos.y - camera.y + height/2);
	var onScreen = rectContains(point, 0, 0, width, height);

	// Only points if the location is not on screen
	if (!onScreen) {
		// The pointer always stays on the edge of the screen
		if (point.x < this.r) {
			point.x = this.r;
		} else if(point.x > width - this.r) {
			point.x = width - this.r;
		}
		if (point.y < this.r) {
			point.y = this.r;
		} else if(point.y > height - this.r) {
			point.y = height - this.r;
		}

		// Draws the pointer
		fill(this.colour);
		strokeWeight(1);
		stroke(0);
		ellipse(point.x, point.y, this.r * 2, this.r * 2);
	}
}