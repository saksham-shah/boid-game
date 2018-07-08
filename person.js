function Person(x_, y_, r_, colour_, pc_, info_) {

	this.acc = createVector(0, 0);
	this.vel = p5.Vector.random2D();
	this.pos = createVector(x_, y_);

	this.maxVel = 3;
	this.maxForce = 0.05;

	this.info = info_;

	this.info.playerControlled = pc_;
	
	// r for radius
	this.r = r_;
	this.colour = colour_;
}

// Updates according to what mode it is
Person.prototype.update = function(mode, xBound, yBound, camera, people, buildings, path, player) {
	if (this.info.playerControlled) {
		if (mode == "race") {
			this.arrowMove(2);
			if (path.nodes.length > 0) {
				this.race(path);
			}
		} else if (mode == "mouseRun") {
			var force = this.getForce(createVector(0, 0));
			force.mult(1.5);
			this.applyForce(force);
		}
		
	} else { // if computer controlled...
		if (mode == "race") {
			if (path.nodes.length > 0) {
				this.followPath(path, 1, player);
			}
		} else if (mode == "mouseRun"){
			this.chase(player, 300, 0.4, camera);
			if (this.info.timer > 0) {
				this.info.timer--
			}
		}
		this.flock(people, 1);
	}

	if (mode == "mouseRun") {
		this.mouse(50, -3, camera);
	}

	// Basic things all balls/boids/people/'I need a name for those' have to do
	this.separate(people, 25, 2.5);
	this.borders(xBound, yBound, 5);
	this.buildings(buildings, 10);
	this.move();
}

// Main movement
Person.prototype.move = function() {
	this.vel.add(this.acc);
	this.vel.limit(this.maxVel);
	this.pos.add(this.vel);
	this.acc.mult(0);
}

// Returns a steering force from a desired direction
Person.prototype.getForce = function(force) {
	force.normalize();
	force.mult(this.maxVel);
	force.sub(this.vel);
	force.limit(this.maxForce);
	return force
}

// Simply applies a force
Person.prototype.applyForce = function(force) {
	this.acc.add(force);
}

// Seeks a target vector
Person.prototype.seek = function(targetPos) {
	var vectorToTarget = p5.Vector.sub(targetPos, this.pos);
	return this.getForce(vectorToTarget);
}

// Seeks a target vector but slows down when close (e.g. used for path following)
Person.prototype.arrive = function(targetPos, dist) {
	var d = p5.Vector.dist(this.pos, targetPos);
	var vectorToTarget = p5.Vector.sub(targetPos, this.pos);
	vectorToTarget.normalize();
	vectorToTarget.mult(this.maxVel);
	if (d < dist) {
		// The force decreases as it gets close to the target; it is 0 when at the target
		vectorToTarget.mult(d/dist);
	}
	vectorToTarget.sub(this.vel);
	vectorToTarget.limit(this.maxForce);
	return vectorToTarget
}

// Creates a steering force with the arrow direction as the desired velocity
Person.prototype.arrowMove = function(weight) {
	var force = createVector(0,0);
	if (keyIsDown(LEFT_ARROW)) {
		force.x -= 1;
	}
	if (keyIsDown(RIGHT_ARROW)) {
		force.x += 1;
	}
	if (keyIsDown(UP_ARROW)) {
		force.y -= 1;
	}
	if (keyIsDown(DOWN_ARROW)) {
		force.y += 1;
	}
	force = this.getForce(force);
	force.mult(weight);
	this.applyForce(force);
}

// Seeks the mouse if within dist
Person.prototype.mouse = function(dist, weight, camera) {
	// screen --> game location conversion using camera location
	var mousePos = createVector(myCursor.x + camera.x - width/2, myCursor.y + camera.y - height/2);
	var d = p5.Vector.dist(mousePos, this.pos);
	if (d < dist || dist == 0) {
		var force = this.seek(mousePos);
		force.mult(weight);
		this.applyForce(force);
	}
}

// Handles borders in a pretty cool way imo
Person.prototype.borders = function(xBound, yBound, weight) {
	if (this.pos.x < 0 || this.pos.x > xBound || this.pos.y < 0 || this.pos.y > yBound) {
		// When outside the border, it gets a steering force towards the centre
		var centre = createVector(xBound/2, yBound/2);
		var force = p5.Vector.sub(centre, this.pos);
		force = this.getForce(force);
		force.mult(weight);
		this.applyForce(force);
	}
}

// Really bad building collisions
Person.prototype.buildings = function(buildings, weight) {
	if (buildings.length > 0) {
		for (var i = 0; i < buildings.length; i++) {
			// Annoyingly long if statement
			if (rectContains(
				this.pos, buildings[i].pos.x - buildings[i].buffer,
				buildings[i].pos.y - buildings[i].buffer,
				buildings[i].dimensions.x + buildings[i].buffer * 2,
				buildings[i].dimensions.y + buildings[i].buffer * 2)) {

				// If 'inside' the building, gets a steering force away from the centre of the building
				var centre = createVector(buildings[i].pos.x + buildings[i].dimensions.x/2, buildings[i].pos.y + buildings[i].dimensions.y/2);
				var force = p5.Vector.sub(this.pos, centre);
				force = this.getForce(force);
				force.mult(weight);
				this.applyForce(force);
			}
		}
	}
} // ew 4 brackets

// Favourite function!
// Follows a path (defined by path object)
Person.prototype.followPath = function(path, weight, player) {
	var currentNode = path.nodes[this.info.nodeCounter];
	var d = p5.Vector.dist(this.pos, currentNode.pos);

	// If it has reached the node, starts seeking the next node
	// + this.r so we know when it juuust touches the node circle
	if (d < currentNode.r + this.r) {
		this.info.nodeCounter++
		if (this.info.nodeCounter >= path.nodes.length) {
			// Nice little loop
			if (player.info.position < gameSettings.players[0]) {
				player.info.position++
			}
			this.info.nodeCounter = 0
			// Unused currently
			this.info.pathsDone++
		}
	} else {
		// 'Arrives' at the node
		force = this.arrive(currentNode.pos, currentNode.r * 2);
		force.mult(weight);
		this.applyForce(force);
	}
}

// followPath but for human players - I don't really need 2 seperate functions for this
Person.prototype.race = function(path) {
	// Here there is no steering as it is player controlled
	// Instead this controls the green highlighted node to guide the player in the race
	var currentNode = path.nodes[this.info.nodeCounter];
	var d = p5.Vector.dist(this.pos, currentNode.pos);
	if (d < currentNode.r + this.r) {
		this.info.nodeCounter++
	}
}

// Seperates the boids/balls/people
Person.prototype.separate = function(people, sepDist, weight) {
	// Algorithm from p5 website because I messed up when trying it myself :'(
	var sepForce = createVector(0, 0);
	var sepCount = 0;

	// Rn checks EVERY other ball - could be optimised, e.g. Quadtree (ref Coding Train)
	for (var i = 0; i < people.length; i++) {
		var d = p5.Vector.dist(this.pos, people[i].pos);
		if ((d > 0) && (d < sepDist)) {
			var vectorAwayFromTarget = p5.Vector.sub(this.pos, people[i].pos);
			vectorAwayFromTarget.normalize();

			// Force decreases as you go further away
			vectorAwayFromTarget.div(d);

			// Calculates and adds a seperation force for each ball
			sepForce.add(vectorAwayFromTarget);
			sepCount++;
		}
	}

	// Average seperation direction
	if (sepCount > 0) {
		sepForce.div(sepCount);
	}

	// Gets the steering if there is a net desired direction
	if (sepForce.mag() > 0) {
		sepForce = this.getForce(sepForce)
	}

	sepForce.mult(weight);
	this.applyForce(sepForce);
}

// Chases the player
Person.prototype.chase = function(player, dist, weight, camera) {
	var d = p5.Vector.dist(player.pos, this.pos);
	if (d < dist || dist == 0) {
		var force = this.seek(player.pos);
		force.mult(weight);
		this.applyForce(force);

		if (d <= this.r + player.r && this.info.timer == 0) {
			this.info.timer = 600;
			player.info.lives -= 1;
			camera.flash(color(255, 0, 0));
			camera.shake = 25;
		}
	}
}

// Draws to the screen
Person.prototype.draw = function(camera) {
	// if (this.info.timer == 0) {
	fill(this.colour);
	// } else {
	// 	fill(0);
	// }
	strokeWeight(1);
	stroke(0);

	// game --> screen location conversion using camera location
	ellipse(this.pos.x - camera.x + width/2, this.pos.y - camera.y + height/2, this.r * 2, this.r * 2);
}