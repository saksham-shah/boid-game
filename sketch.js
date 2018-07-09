var screen, prevScreen;
var menuScr, gameScr, scoreScr, settingsScr;
var myCursor;

function preload() {
	backgroundMusic = loadSound("background_music.mp3");
}

function setup() {
	createCanvas(600, 400);
	//background(0);
	
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
	// switch (screen) {
	// 	case "menu":
	// 		menuScr.update();
	// 		menuScr.draw();
	// 		break;
	// 	case "game":
	// 		gameScr.update();
	// 		gameScr.draw();
	// 		break;
	// 	case "settings":
	// 		settingsScr.update();
	// 		settingsScr.draw();
	// 		break;
	// 	// case "otherSettings":
	// 	// 	otherSettingsScr.update();
	// 	// 	otherSettingsScr.draw();
	// 	// 	break;
	// 	case "score":
	// 		scoreScr.update();
	// 		scoreScr.draw();
	// 		break;
	// 	default:
	// 		background(0);
	// }

	myCursor.update();
	myCursor.draw();
}

// function mousePressed() {
// 	if (screen == "menu") {
// 		screen = "game";
// 		game.start();
// 	} else {
// 		screen = "menu";
// 	}
// }
