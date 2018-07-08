// Multiple node objects make up a path object for people to follow
function Node(x_, y_, r_) {
	this.pos = createVector(x_, y_);
	this.r = r_;
}

// Draws a circle to represent the node
Node.prototype.draw = function(camera, highlighted, filled) {
	// Hard coded colours right now
	if (highlighted) {
		colour = color(0, 255, 0);
	} else {
		colour = color(255);
	}
	stroke(colour);
	if (filled) {
		fill(colour);
	} else {
		noFill();
	}
	strokeWeight(3);

	// game --> screen location conversion using camera location
	ellipse(this.pos.x - camera.x + width/2, this.pos.y - camera.y + height/2, this.r * 2);
}

// Used in race mode
function Path() {
	// A path just has a list of nodes
	this.nodes = [];
}

// Adds a node to the path
Path.prototype.addNode = function(node) {
	this.nodes.push(node);
}

// Draws each node
Path.prototype.draw = function(camera, highlighted) {
	for (var i = 0; i < this.nodes.length; i++) {
		var highlight = false;
		var fill = false;

		// If this node is supposed to be highlighted
		if (i == highlighted) {
			highlight = true;
		}

		// If this is the last node of the path list
		if (i == this.nodes.length - 1) {
			fill = true;
		}

		this.nodes[i].draw(camera, highlight, fill)
	}
}

// Used in mouse run mode
function Zone(r_, store_) {
	this.pos = createVector(0, 0);
	this.newX = null;
	this.newY = null;
	this.maxR = r_;

	// How many points you can get before it starts to close - NOTE: you can still get points even when it is closing
	this.store = store_;
	this.points = null;
	this.draining = false;

	// To do with the in and out animations - percentage is how big the zone currently is (relative to max size)
	this.changing = 0;
	this.percentage = 0;
	this.changeSpeed = 5;

	// Radius starts at 0 and gets bigger
	this.r = 0;
}

// Randomly picks a new position
Zone.prototype.locate = function(xBound, yBound) {
	this.changing = -1;
	this.newX = random(this.maxR, xBound - this.maxR);
	this.newY = random(this.maxR, yBound - this.maxR);
	this.points = this.store;
}

// Updates the radius (due to animation) and the points
Zone.prototype.update = function(person, xBound, yBound) {

	// Enter/exit animation

	// If it is getting smaller
	if (this.changing == -1) {
		if (this.percentage > 0) {
			this.percentage -= this.changeSpeed;
		} else {
			this.changing = 1;
			this.pos.x = this.newX;
			this.pos.y = this.newY;
		}
	// If it is getting bigger
	} else if (this.changing == 1) {
		if (this.percentage < 100) {
			this.percentage += this.changeSpeed;
		} else {
			this.changing = 0;
		}
	}

	this.r = this.maxR * this.percentage * 0.01;

	// If the player is in the zone, points are drained
	var d = p5.Vector.dist(person.pos, this.pos);
	if (d < person.r + this.r) {
		this.draining = true;
		this.points -= 1;
	} else {
		this.draining = false;
	}

	// If it has run out of points, it relocates to a new random position
	if (this.points <= 0 && this.changing == 0) {
		this.locate(xBound, yBound);
	}

	return this.draining;
}

// Draws the zone
Zone.prototype.draw = function(camera) {
	// Colour changes if you are in the zone
	if (this.draining) {
		fill(100, 155, 100)
	} else {
		fill(200);
	}

	stroke(255);
	strokeWeight(5);

	// game --> screen location conversion using camera location
	ellipse(this.pos.x - camera.x + width/2, this.pos.y - camera.y + height/2, this.r * 2);
}