"use strict";

// http://codepen.io/B8bop/pen/NqjgOq





// там внизу запускается эта хуита
// здесь всё говно отбирается и передается Хуясу
// и блять, при каждом смещении заново стартует


// из этой хуйни берутся данные для методов, которые 
// с внешними функциями
var Tetris = function() {

	var pattern;
	var patterns;
	var patterni;

	var color;
	var pause = false;
	var restart = false;
	var speed = 700;
	var x;
	var y;

	var pieces = [
	[I, "cyan"],
	[J, "blue"],
	[L, "orange"],
	[Q, "yellow"],
	[S, "green"],
	[T, "purple"],
	[Z, "red"]
];

	newPiece();

		$("body").keydown(key);

	function key(e) {
		switch(e.keyCode) {
			case 37: moveLeft(); break; // J
			case 39: moveRight(); break; // L
			case 40: down(); break; // K
			case 38: rotate(); break; // I
		}
		return false;
	}

	function newPiece() {
		var p = pieces[parseInt(Math.random() * pieces.length, 10)];
		var patterns = p[0];
		var color = p[1];

		Tetris.pattern = patterns[0];
		Tetris.patterns = patterns;
		Tetris.patterni = 0;

		Tetris.color = color;

		Tetris.x = width/2-parseInt(Math.ceil(Tetris.pattern.length/2), 10);
		Tetris.y = -2;
	}

var dropStart = Date.now();

function main() {
	var now = Date.now();
	var delta = now - dropStart;

	if (delta > speed) {
		down();
		dropStart = now;
	}

	if (!done) {
		requestAnimationFrame(main);
	}
}



	this.start = function() {
		done = false;
		Tetris.pause = false;
		return main();
	};

	this.pause = function() {
		done = true;
		Tetris.pause = true;
	};

	this.restart = function() {
		Tetris.restart = true;
		createBoard();
		drawBoard();
		newPiece();
		done = false;
		speed = 700;
		main();
		linecount.textContent = "Lines: 0";

		// game over
	}

	this.init = function() {
		createBoard();
		drawBoard();
		linecount.textContent = "Lines: 0";

	}


var canvas = document.getElementById('board');
var ctx = canvas.getContext("2d");
var linecount = document.getElementById('lines');
var clear = window.getComputedStyle(canvas).getPropertyValue('background-color');
var width = 10;
var height = 20;
var tilesz = 24;
canvas.width = width * tilesz;
canvas.height = height * tilesz;





// var piece = null;

var board;

function createBoard() {
	Tetris.board = [];
	for (var r = 0; r < height; r++) {
		Tetris.board[r] = [];
		for (var c = 0; c < width; c++) {
			Tetris.board[r][c] = "";
		}
	}
}



function drawSquare(x, y) {
	ctx.fillRect(x * tilesz, y * tilesz, tilesz, tilesz);
	var ss = ctx.strokeStyle;
	ctx.strokeStyle = "#555";
	ctx.strokeRect(x * tilesz, y * tilesz, tilesz, tilesz);
	ctx.strokeStyle = "#888";
	ctx.strokeRect(x * tilesz + 3*tilesz/8, y * tilesz + 3*tilesz/8, tilesz/4, tilesz/4);
	ctx.strokeStyle = ss;
}

function drawBoard() {
	var fs = ctx.fillStyle;
	for (var y = 0; y < height; y++) {
		for (var x = 0; x < width; x++) {
			if (Tetris.restart) {
				ctx.fillStyle = clear;
				drawSquare(x, y, tilesz, tilesz);
			} else {

			ctx.fillStyle = Tetris.board[y][x] || clear;
			drawSquare(x, y, tilesz, tilesz);
			}
		}
	}
	ctx.fillStyle = fs;
}


	newPiece();




	function down() {
	if (Tetris.pause){
		return false;
	}
	else if(_collides(0, 1, Tetris.pattern)) {
		lock();
		newPiece();
	} 
	else {
		undraw();
		Tetris.y++;
		draw();
	}
}


var WALL = 1;
var BLOCK = 2;
function _collides(dx, dy, pat) {
	for (var ix = 0; ix < pat.length; ix++) {
		for (var iy = 0; iy < pat.length; iy++) {
			if (!pat[ix][iy]) {
				continue;
			}

			var x = Tetris.x + ix + dx;
			var y = Tetris.y + iy + dy;
			if (y >= height || x < 0 || x >= width) {
				return WALL;
			}
			if (y < 0) {
				// Ignore negative space rows
				continue;
			}
			if (Tetris.board[y][x] !== "") {
				return BLOCK;
			}
		}
	}

	return 0;
}


function _fill(color) {
	var fs = ctx.fillStyle;
	ctx.fillStyle = color;
	var x = Tetris.x;
	var y = Tetris.y;
	for (var ix = 0; ix < Tetris.pattern.length; ix++) {
		for (var iy = 0; iy < Tetris.pattern.length; iy++) {
			if (Tetris.pattern[ix][iy]) {
				drawSquare(x + ix, y + iy);
			}
		}
	}
	ctx.fillStyle = fs;
}

function undraw(ctx) {
	_fill(clear);
}

function draw(ctx) {
	_fill(Tetris.color);
}


var lines = 0;
var done = false;
function lock() {
	for (var ix = 0; ix < Tetris.pattern.length; ix++) {
		for (var iy = 0; iy < Tetris.pattern.length; iy++) {
			if (!Tetris.pattern[ix][iy]) {
				continue;
			}

			if (Tetris.y + iy < 0) {
				ctx.font = "30px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
				done = true;
				return;
			}
			Tetris.board[Tetris.y + iy][Tetris.x + ix] = Tetris.color;
		}
	}

	var nlines = 0;
	for (var y = 0; y < height; y++) {
		var line = true;
		for (var x = 0; x < width; x++) {
			line = line && Tetris.board[y][x] !== "";
		}
		if (line) {
			for (var y2 = y; y2 > 1; y2--) {
				for (var x = 0; x < width; x++) {
					Tetris.board[y2][x] = Tetris.board[y2-1][x];
				}
			}
			for (var x = 0; x < width; x++) {
				Tetris.board[0][x] = "";
			}
			nlines++;
		}
	}

	if (nlines > 0) {
		lines += nlines;
		drawBoard();
		linecount.textContent = "Lines: " + lines;
		speed -= 25;
	}
}

function rotate() {
	var nudge = 0;
	var nextpat = Tetris.patterns[(Tetris.patterni + 1) % Tetris.patterns.length];

	if (Tetris.pause){
		return false;
	}

	if (_collides(0, 0, nextpat)) {
		// Check kickback
		nudge = Tetris.x > width / 2 ? -1 : 1;
	}

	if (!_collides(nudge, 0, nextpat)) {
		undraw();
		Tetris.x += nudge;
		Tetris.patterni = (Tetris.patterni + 1) % Tetris.patterns.length;
		Tetris.pattern = Tetris.patterns[Tetris.patterni];
		draw();
	}
}


function moveRight() {
	if (Tetris.pause){
		return false;
	}

	else if (!_collides(1, 0, Tetris.pattern)) {
		undraw();
		Tetris.x++;
		draw();
	}
}

function moveLeft() {
	if (Tetris.pause){
		return false;
	}
	else if (!_collides(-1, 0, Tetris.pattern)) {
		undraw();
		Tetris.x--;
		draw();
	}
}



};

var game = new Tetris();
game.init();

$("#start").click(function () {
	game.start();
});

$("#pause").click(function () {
	game.pause();
});

$("#restart").click(function () {
	game.restart();
});