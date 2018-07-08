// Used in the settings screen
function Setting(x_, y_, settingName_, currentValue_, minValue_, maxValue_, increment_) {
	this.x = x_;
	this.y = y_;
	this.settingName = settingName_;
	this.currentValue = currentValue_;
	this.minValue = minValue_;
	this.maxValue = maxValue_;
	this.increment = increment_;

	// These two buttons control the setting's value
	// When hovered over, the buttons preview the value which would be set if the button was clicked
	this.leftButton = new Button(this.x - 100, this.y - 25, 50, 50, "<", 
	function(button) { // Hover text function
		var val = button.info.currentValue - button.info.increment;
		// Restricts the setting value between the min and max values
		if (val < button.info.minValue) {
			val = button.info.minValue;
		}
		return val;
	}, 4, 30, 20,
	function(button) { // Click function
		var val = button.info.currentValue - button.info.increment;
		if (val < button.info.minValue) {
			val = button.info.minValue;
		}
		button.info.currentValue = val;
	}, this);

	this.rightButton = new Button(this.x + 50, this.y - 25, 50, 50, ">", 
	function(button) { // Hover text function
		var val = button.info.currentValue + button.info.increment;
		if (val > button.info.maxValue) {
			val = button.info.maxValue;
		}
		return val;
	}, 4, 30, 20,
	function(button) { // Click function
		var val = button.info.currentValue + button.info.increment;
		if (val > button.info.maxValue) {
			val = button.info.maxValue;
		}
		button.info.currentValue = val;
	}, this);
}

// Updates the buttons
Setting.prototype.update = function() {
	this.leftButton.update();
	this.rightButton.update();

	if (this.leftButton.clicked && ((myCursor.clickTime > 30 && myCursor.clickTime % 5 == 0) || (myCursor.clickTime > 120 && myCursor.clickTime % 2 == 0))) {
		this.leftButton.click();
	}
	if (this.rightButton.clicked && ((myCursor.clickTime > 30 && myCursor.clickTime % 5 == 0) || (myCursor.clickTime > 120 && myCursor.clickTime % 2 == 0))) {
		this.rightButton.click();
	}
}

// Resets the value back to the default setting
Setting.prototype.reset = function() {
	this.currentValue = gameSettings[this.settingName][4];
}

// Draws the title, buttons and current value
Setting.prototype.draw = function(x, y) {
	// You can define the draw location if it is dynamic - e.g. moving buttons
	if (x === undefined) {
		x = this.x;
	}
	if (y === undefined) {
		y = this.y;
	}

	this.leftButton.draw(x - 100, y - 25);
	this.rightButton.draw(x + 50, y - 25);

	textAlign(CENTER);
	fill(255);
	noStroke();

	textSize(25);
	text(gameSettings[this.settingName][5], x, y - 40);

	textSize(30);
	text(this.currentValue, x, y + 10)
}

