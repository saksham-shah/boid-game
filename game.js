// switch (this.mode) {
// 		case "race":
// 			// stuff...
// 			break;
// 		case "race":
// 			// stuff...
// 			break;
// 		default:
// 			// optional?

// Global settings object
var gameSettings = {
	players: [100, 1, 150, 1, 100, "Players"],
	walls: [10, 0, 20, 1, 10, "Walls"],
	nodes: [10, 2, 20, 1, 10, "Race length"],
	nodeRadius: [50, 20, 150, 5, 50, "Checkpoint size"],
	lives: [10, 1, 20, 1, 10, "Lives"],
	zones: [5, 1, 10, 1, 5, "Zones"],
	store: [150, 50, 500, 10, 150, "Zone points"],
	zoneRadius: [75, 20, 300, 5, 75, "Zone size"],
	music: [50, 0, 100, 10, 50, "Music volume"]
}

// Initiate function, with the game settings as parameters
function Game(mode_, xBound_, yBound_) {
	this.xBound = xBound_;
	this.yBound = yBound_;

	this.mode = mode_;

	// For the score screen when the game is over
	this.ongoing = true;
	this.result = [];

	// Adding people and scores
	this.people = [];

	switch (this.mode) {
			case "race":
				var info = {
					nodeCounter: 0,
					position: 1,
					pathsDone: 0	
				}
				break;
			case "mouseRun":
				var info = {
					timer: 0,
					lives: gameSettings.lives[0]
				}
				break;
			default:
				 var info = {}
	}

	// First player is the human (shown by the 'true')
	this.player = new Person(random(0, this.xBound), random(0, this.yBound), 8, color(255, 0, 0), true, Object.assign({}, info));

	// Rest are computers
	this.people.push(this.player);
	for (var i = 0; i < gameSettings.players[0] - 1; i++) {
		var person = new Person(random(0, this.xBound), random(0, this.yBound), 8, color(255), false, Object.assign({}, info));
		this.people.push(person);
	}

	if (this.mode == "race") {
		// Making path if the mode is Race
		this.path = new Path();
		var nodeR = gameSettings.nodeRadius[0];
		for (var i = 0; i < gameSettings.nodes[0]; i++) {
			var node = new Node(random(nodeR, this.xBound - nodeR), random(nodeR, this.yBound - nodeR), nodeR);
			this.path.addNode(node);
		}
	} else if (this.mode == "mouseRun") {
		// Making point zones if the mode is Mouse Run
		this.zones = []
		this.points = 0
		for (var i = 0; i < gameSettings.zones[0]; i++) {
			var zone = new Zone(gameSettings.zoneRadius[0], gameSettings.store[0]);
			zone.locate(this.xBound, this.yBound)
			this.zones.push(zone);
		}
	}

	// Adding buildings
	this.buildings = [];
	for (var i = 0; i < gameSettings.walls[0]; i++) {
		// How far from the edge buildings have to be
		var buffer = 50;

		// These are walls which can be vertical or horizontal	
		if (random(1) < 0.5) {
			var w = 200;
			var h = 20;
		} else {
			var w = 20;
			var h = 200;
		}
		// Random location
		var building = new Building(random(buffer, this.xBound - w - buffer), random(buffer, this.yBound - h - buffer), w, h, 10);
		this.buildings.push(building);
	}

	// Creating a camera object
	this.camera = new Camera(this.xBound/2, this.yBound/2, this.xBound, this.yBound, this.player);

	// Pointer will point towards the next node in the path
	this.pointer = new Pointer(color(0, 255, 0), 10);

	// These are the scores
	this.texts = [];

	switch (this.mode) {
		case "race":
			this.texts.push(new Text(25, height - 25, (text) => text.info.nodeCounter, 30, this.player.info));
			this.texts.push(new Text(25, 25,
				function(text) {
					if (text.info.position > 1) {
						return text.info.position - 1;
					}
					return false;
				}, 30, this.player.info));
			break;
		case "mouseRun":
			this.texts.push(new Text(25, height - 25, (text) => text.info.lives, 30, this.player.info));
			this.texts.push(new Text(width/2, 25, (text) => text.info.points, 30, this));
			break;

	}
}

// Updates everything
Game.prototype.update = function() {
	// Updates the people
	for (var i = 0; i < this.people.length; i++) {
		this.people[i].update(this.mode, this.xBound, this.yBound, this.camera, this.people, this.buildings, this.path, this.player);
	}

	// Points system in Mouse Run mode
	if (this.mode == "mouseRun") {
		for (var i = 0; i < this.zones.length; i++) {
			if (this.zones[i].update(this.player, this.xBound, this.yBound)) {
				this.points++;
			}
		}
	}

	this.camera.update();

	for (var i = 0; i < this.texts.length; i++) {
		this.texts[i].update();
	}

	// Checks for the game over condition
	switch (this.mode) {
		case "race":
			if (this.texts[0].textToDraw >= this.path.nodes.length) {
				this.ongoing = false;
				this.result = ["Your position is", String(this.player.info.position) + "/" + String(this.people.length)]
			}
			break;
		case "mouseRun":
			if (this.texts[0].textToDraw <= 0) {
				this.ongoing = false;
				this.result = ["You scored", String(this.points)]
			}
			break;
		default:
			console.log("Error game.js line 125 switch case - unexpected mode")
			// optional?
	}
}

// Draws the game
Game.prototype.draw = function() {
	// Game border
	noFill();
	strokeWeight(2);
	stroke(255);
	rect(width/2 - this.camera.x, height/2 - this.camera.y, this.xBound, this.yBound);

	if (this.mode == "race") {
		// Draws the path in Race mode
		this.path.draw(this.camera, this.player.info.nodeCounter);
	} else if (this.mode == "mouseRun") {
		// Draws the point zones in Mouse Run mode
		for (var i = 0; i < this.zones.length; i++) {
			this.zones[i].draw(this.camera);
		}
	}

	// Draws the people
	for (var i = 0; i < this.people.length; i++) {
		this.people[i].draw(this.camera);
	}

	// Draws the buildings
	for (var i = 0; i < this.buildings.length; i++) {
		this.buildings[i].draw(this.camera);
	}

	if (this.mode == "race") {
		// Only draws the pointer in race mode
		if (this.path.nodes.length > 0 && this.ongoing) {
			this.pointer.draw(this.path.nodes[this.player.info.nodeCounter].pos, this.camera);
		}
	}

	// Draws the camera
	this.camera.draw();

	// Draws the score
	for (var i = 0; i < this.texts.length; i++) {
		this.texts[i].draw();
	}
}
