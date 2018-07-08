// Draws the background
function drawBackground() {
	var edge = 15;
	background(50);
	noFill();
	stroke(75);
	strokeWeight(edge);
	rect(edge * 0.5, edge * 0.5, width - edge, height - edge);
}

function MenuScreen() {
	//Adding a bunch of buttons
	this.buttons = [];

	// Race start button
	this.buttons.push(new Button(75, 150, 200, 50, "Race", "Try out this cool race!", 4, 30, 20,
	function(button) {
		gameScr.game = new Game("race", 1000, 1000);
		gameScr.paused = false;
		screen = gameScr;
	}, {}));

	// Easter egg in this placeholder button
	this.buttons.push(new Button(75, 250, 200, 50, "Click Tester", 
	function(button) { // Hover text function
		// if (button.clicked) {
		// 	return button.info.clickCount * 2;
		// }
		return "Clicks: " + button.info.clickCount;
	}, 4, 30, 20,
	function(button) { // Click function
		//tis an easter egg
		button.info.clickCount += 1;
	}, {clickCount: 0}));

	// Mouse Run  start button
	this.buttons.push(new Button(325, 150, 200, 50, "Mouse Run", "Don't get hit!", 4, 30, 20,
	function(button) {
		gameScr.game = new Game("mouseRun", 1000, 1000);
		gameScr.paused = false;
		screen = gameScr;
	}, {}));

	// Placeholder button
	this.buttons.push(new Button(325, 250, 200, 50, "Settings", "Settings", 4, 30, 20,
	function(button) {
		//settingsScr.load("players", "walls", "nodes", "lives");
		settingsScr.load();
		screen = settingsScr;
	}, {}));

}

// Updates the screen
MenuScreen.prototype.update = function() {
	// Just updates all the buttons
	for(var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update();
	}
}

// Draws the screen
MenuScreen.prototype.draw = function() {
	// Background
	drawBackground();

	// Title - could be a function
	fill(255);
	noStroke();
	textAlign(CENTER);
	textSize(50);
	text("Need a Name Game", width/2, 75)

	// Draws the buttons
	for(var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw();
	}
}

function GameScreen() {
	// Game is defined by the buttons in the menu screen
	this.game = null;

	// Initially the game is unpaused
	this.paused = false;
	this.pausePressed = false;

	// Small back button in the bottom right corner
	this.backButton = new Button(475, 350, 100, 25, "Back", "Menu", 4, 15, 15,
	function(button) {
		screen = menuScr;
	}, {});
}

// Updates the screen
GameScreen.prototype.update = function() {
	// When the P key is released, pause is toggled - could be generalised to a key object, making it reusable with other keys, e.g. Q for quit
	if (this.game != null && !this.paused) {
		this.game.update();
		if (!this.game.ongoing) {
			scoreScr.setScore(this.game.result[0], this.game.result[1]);
			screen = scoreScr;
		}
	}

	if (keyIsDown("P".charCodeAt(0))) {
		if (!this.pausePressed) {
			this.pausePressed = true;
		}
	} else if (this.pausePressed) {
		this.pausePressed = false;
		this.paused = !this.paused;
	}

	this.backButton.update();
}

// Draws the screen
GameScreen.prototype.draw = function() {
	background(50)

	if (this.game != null) {
		// Draws the game
		this.game.draw();
	}

	if (this.paused) {
		// The fill makes the rectangle transparent, making everything darker
		fill(0, 150);
		noStroke();
		rect(0, 0, width, height);

		fill(255);
		noStroke();
		textAlign(CENTER);
		textSize(75);
		text("P to unpause", width/2, 200)
	}

	// Draws the back button
	this.backButton.draw();
}

function SettingsScreen(pages_) {
	// Setting up settings
	this.pages = pages_;
	this.settings = [];

	for (var i = 0; i < this.pages.length; i++) {
		var page = []
		for (var j = 1; j < this.pages[i].length; j++) {
			var current = this.pages[i][j];
			var x = 175;
			if ((j-1) % 2 != 0) {
				x = width - x;
			}
			var y = 175 + 110 * Math.floor((j-1)/2);
			page.push(new Setting(x, y, current, gameSettings[current][0], gameSettings[current][1], gameSettings[current][2], gameSettings[current][3]));
		}
		this.settings.push(page);
	}

	// Starts at page 1 (index 0)
	this.currentPage = 0;

	//Adding a bunch of buttons
	this.buttons = [];

	// Small back button in the bottom right corner
	this.buttons.push(new Button(475, 350, 100, 25, "Back", "Menu", 4, 15, 15,
	function(button) {
		screen = menuScr;
	}, {}));

	// Resets the settings to default (button in the bottom left corner)
	this.buttons.push(new Button(25, 350, 100, 25, "Reset", "To default", 4, 15, 15,
	function(button) {
		for (var i = 0; i < button.info.settings[button.info.currentPage].length; i++) {
			button.info.settings[button.info.currentPage][i].reset();
		};
	}, this));

	// Saves the settings (button in the bottom middle)
	this.buttons.push(new Button(width/2 - 50, 350, 100, 25, "Save", "Save settings", 4, 15, 15,
	function(button) {
		button.info.save();	
	}, this));

	// Next/previous page buttons
	this.buttons.push(new Button(25, 25, 100, 25, "Previous", 
	function(button) { // Hover text function
		var val = button.info.currentPage - 1;
		if (val < 0) {
			val = button.info.pages.length - 1;
		}
		return button.info.pages[val][0];
	}, 4, 15, 15,
	function(button) { // Click function
		var val = button.info.currentPage - 1;
		if (val < 0) {
			val = button.info.pages.length - 1;
		}
		button.info.currentPage = val;
	}, this));

	this.buttons.push(new Button(475, 25, 100, 25, "Next", 
	function(button) { // Hover text function
		var val = button.info.currentPage + 1;
		if (val > button.info.pages.length - 1) {
			val = 0;
		}
		return button.info.pages[val][0];
	}, 4, 15, 15,
	function(button) { // Click function
		var val = button.info.currentPage + 1;
		if (val > button.info.pages.length - 1) {
			val = 0;
		}
		button.info.currentPage = val;
	}, this));
}

// Loads the settings
SettingsScreen.prototype.load = function() {
	for (var i = 0; i < this.settings.length; i++) {
		for (var j = 0; j < this.settings[i].length; j++) {
			var current = this.settings[i][j];
			current.currentValue = gameSettings[current.settingName][0];
		}
	}
	// for (var i = 0; i < this.setting.length; i++) {
	// 	var current = arguments[i];
	// 	var x = 175;
	// 	if (i % 2 != 0) {
	// 		x = width - x;
	// 	}
	// 	var y = 175 + 110 * Math.floor(i/2);
	// 	this.settings.push(new Setting(x, y, current, gameSettings[current][0], gameSettings[current][1], gameSettings[current][2], gameSettings[current][3]));
	// }
}

// Saves the settings to the global settings object
SettingsScreen.prototype.save = function() {
	for (var i = 0; i < this.settings.length; i++) {
		for (var j = 0; j < this.settings[i].length; j++) {
			var current = this.settings[i][j];
			gameSettings[current.settingName][0] = current.currentValue;
		}
	}
}

// Updates the screen
SettingsScreen.prototype.update = function() {
	// Updates the settings

	for (var i = 0; i < this.settings[this.currentPage].length; i++) {
		this.settings[this.currentPage][i].update();
	}

	//  Updates the buttons
	for(var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update();
	}
}

// Draws the screen
SettingsScreen.prototype.draw = function() {
	// Background
	drawBackground();

	// Title - could be a function
	fill(255);
	noStroke();
	textAlign(CENTER);
	textSize(50);
	text(this.pages[this.currentPage][0], width/2, 75)

	// Draws the settings
	for (var i = 0; i < this.settings[this.currentPage].length; i++) {
		this.settings[this.currentPage][i].draw();
	}

	//  Draws the buttons
	for(var i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw();
	}
}

function ScoreScreen() {
	this.mainText = ""
	this.result = ""

	// Small back button in the bottom right corner
	this.backButton = new Button(475, 350, 100, 25, "Back", "Menu", 4, 15, 15,
	function(button) {
		screen = menuScr;
	}, {});
}

// Sets the text depending on how the game ended
ScoreScreen.prototype.setScore = function(mainText_, result_) {
	this.mainText = mainText_;
	this.result = result_;
}

// Updates the screen
ScoreScreen.prototype.update = function() {
	this.backButton.update();
}

// Draws the screen
ScoreScreen.prototype.draw = function() {
	// Background
	drawBackground();

	// Currently has a header text and a large score - could be changed
	fill(255);
	noStroke();
	textAlign(CENTER);

	textSize(75);
	text(this.mainText, width/2, 100)

	textSize(150);
	text(this.result, width/2, 250)

	// Draws the back button
	this.backButton.draw();
}