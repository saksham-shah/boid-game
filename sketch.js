var screen, prevScreen;
var menuScr, gameScr, scoreScr, settingsScr;
var myCursor;
var backgroundMusic;

function preload() {
	backgroundMusic = loadSound("background_music.mp3");
}

function setup() {
	createCanvas(600, 400);
	
	// Musiiiiiic
	backgroundMusic.setVolume(0);
	backgroundMusic.loop();

	menuScr = new MenuScreen();
	gameScr = new GameScreen();
	settingsScr = new SettingsScreen([
		["Main", "players", "walls"],
		["Race", "nodes", "nodeRadius"],
		["Mouse Run", "lives", "zones", "store", "zoneRadius"]
		]);
	scoreScr = new ScoreScreen();

	// Starts in main menu
	screen = menuScr;
	prevScreen = screen;

	// Removing the normal cursor and adding one I draw myself
	noCursor();
	myCursor = new mouseCursor();
}

function draw() {
	screen.update();
	if (prevScreen == screen) {
		screen.draw();
	} else {
		prevScreen = screen;
	}

	myCursor.update();
	myCursor.draw();
}
