"use strict";

var tetris = {

	// Shape colors 
	colors: ['#eaeaea','yellow','turquoise','green',
		'pink','purple','blue','red'],

	// Starting line for each shape
	startAt: [0, -1, -1, -1, -1, -1, -1, -1],

	// Points per number of lines
	points: [0, 40, 100, 300, 1200],

	// Combination of each shape
	shapes: [
		// none
		[],
		// I
		[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]],
		// T
		[[[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]],
		// L
		[[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],
		 [[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],
		 [[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]]],
		// J
		[[[0,0,0,0],[1,0,0,0],[1,1,1,0],[0,0,0,0]],
		 [[0,0,0,0],[0,1,1,0],[0,1,0,0],[0,1,0,0]],
		 [[0,0,0,0],[0,0,0,0],[1,1,1,0],[0,0,1,0]],
		 [[0,0,0,0],[0,1,0,0],[0,1,0,0],[1,1,0,0]]],
		// Z
		[[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],
		 [[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]],
		// S
		[[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],
		 [[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]],
		// O
		[[[0,0,0,0],[0,1,1,0],[0,1,1,0],[0,0,0,0]]]],

	// Pre-load elements of the grid
	// Таблица готова, просто забираются id
	init: function() {
		var i, j, k;
		tetris.cells = [];
		for (i = -3; i < 18; ++i) {
			tetris.cells[i] = [];
			for (j = 1; j < 11; ++j) {
				k = String.fromCharCode(i + 97);
				tetris.cells[i][j] = $(['#', k, j].join(''));
			}
		}
		tetris.bound = $.browser == 'msie' ? '#tetris' : window;
	}, 

	// Initialize to start the game
	start: function() {
		// Stats
		tetris.level = 0;
		tetris.lines = 0;
		tetris.score = 0;
		// Array which contains data of the grid
		tetris.grid = [
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,0,0,0,0,0,0,0,0,0,0,1],
      [1,0,0,0,0,0,0,0,0,0,0,1],
			[1,1,1,1,1,1,1,1,1,1,1,1]];
    
		$('#grid td').css('backgroundColor', tetris.colors[0]);
		$('#start').unclick(tetris.start).val('pause').click(tetris.pause);
		$('#stop').set('disabled', false);
		$(tetris.bound).keydown(tetris.key);
		tetris.next = tetris.newShape();
		tetris.shift();
		tetris.duration = 600;
		tetris.refresh();
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration);
	},

	// Define the action to be fired depending on key entry
	key: function(e) {
		switch(e.keyCode) {
			case 37: tetris.moveLeft(); break; // J
			case 39: tetris.moveRight(); break; // L
			case 40: tetris.moveDown(); break; // K
			case 38: tetris.rotate(); break; // I
		}
		return false;
	},

	// Generate a random shape
	newShape: function() {
		return Math.ceil(Math.random() * 7);
	},

	// Define then draw the next shape
	setNext: function() {
		var i, j, s, c, d, n = tetris.colors[0];
		tetris.next = tetris.newShape();
		s = tetris.shapes[tetris.next][0];
		c = tetris.colors[tetris.next];
		//This for loop checks all 16 squares for the "next square" display
    for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				//If the square is not to be coloured, leave it blank
        if(s[i][j]) {
          d = c;
        }
        else {
          d = n;
        }
        //Here we colour the squares with our selected colour
				$(['#x', j, i].join('')).css('backgroundColor', d);
			}
		}
	},

	// The next shape becomes the current one; reset coordinates
	shift: function() {
		tetris.cur = tetris.next;
		tetris.x = tetris.x0 = 4;
		tetris.y = tetris.startAt[tetris.cur];
		tetris.y0 = tetris.y - 2;
		tetris.r = tetris.r0 = 0;
		tetris.curShape = tetris.shapes[tetris.cur];
		if (tetris.canGo(0, tetris.x, tetris.y)) {
			tetris.setNext();
			return true;
		}
		return false;
	},

	// Pause the game
	pause: function() {
		$(tetris.bound).unkeypress(tetris.key);
		window.clearInterval(tetris.timer);
		tetris.timer = null;
		$('#start').unclick(tetris.pause).val('resume').click(tetris.resume);
	},

	// Resume the game
	resume: function() {
		$(tetris.bound).keydown(tetris.key);
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration);
		$('#start').unclick(tetris.resume).val('pause').click(tetris.pause);
	},

	// Stop the game
	gameOver: function() {
		var i, j;
    
		// Manage buttons
		if (tetris.timer) {
			$(tetris.bound).unkeypress(tetris.key);
			window.clearInterval(tetris.timer);
			tetris.timer = null;
			$('#start').unclick(tetris.pause).val('start').click(tetris.start);
		} 
    
    else {
			$('#start').unclick(tetris.resume).val('start').click(tetris.start);
		}
		$('#stop').set('disabled', true);
    
		// Draw everything in white
		for (i = 0; i < 18; ++i) {
			for (j = 1; j < 11; ++j) {
				if (tetris.grid[i][j]) {
					tetris.cells[i][j].css('backgroundColor', '#cccccc');
				}
			}
		}
		tetris.draw(tetris.r0, tetris.x0, tetris.y0, '#cccccc');
	},

	// Check overlays
	canGo: function(r, x, y) {
		var i, j;
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[r][j][i] && tetris.grid[y + j] &&
						tetris.grid[y + j][x + i]) {
					return false;
				}
			}
		}
		return true;
	},

	// Move the current shape to the left
	moveLeft: function() {
		if (tetris.canGo(tetris.r, tetris.x - 1, tetris.y)) {
			tetris.x -= 1;
			tetris.refresh();
		}
	},

	// Move the current shape to the right
	moveRight: function() {
		if (tetris.canGo(tetris.r, tetris.x + 1, tetris.y)) {
			tetris.x += 1;
			tetris.refresh();
		}
	},

	// Rotate the current shape
	rotate: function() {
		
    
    if (tetris.r == tetris.curShape.length - 1) {
      var r = 0;
    }
    else {
      r = tetris.r + 1;
    }
		if (tetris.canGo(r, tetris.x, tetris.y)) {
			tetris.r0 = tetris.r;
			tetris.r = r;
			tetris.refresh();
		}
	},

	// Move down the current shape
	moveDown: function() {
		if (tetris.canGo(tetris.r, tetris.x, tetris.y + 1)) {
			tetris.y += 1;
			tetris.refresh();
		} else {
			tetris.touchDown();
		}
	},

	// The current shape touches down
	touchDown: function() {
		var i, j, k, r, f;
		// mark the grid
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[tetris.r][j][i] &&
						tetris.grid[tetris.y + j]) {
					tetris.grid[tetris.y + j][tetris.x + i] = tetris.cur;
				}
			}
		}
		// search complete lines
		f = 0;
		for (i = 17, k = 17; i > -1 && f < 4; --i, --k) {
			if (tetris.grid[i].join('').indexOf('0') == -1) {
				// Complete lines become white
				for (j = 1; j < 11; ++j) {
					tetris.cells[k][j].css('backgroundColor', '#cccccc');
				}
				++f;
				for (j = i; j > 0; --j) {
					tetris.grid[j] = tetris.grid[j - 1].concat();
				}
				++i;
			}
		}
		// animate
		if (f) {
			window.clearInterval(tetris.timer);
			tetris.timer = window.setTimeout(function(){tetris.after(f);}, 100);
		}
		// try to continue
		if (tetris.shift()) {
			tetris.refresh();
		} else {
			tetris.gameOver();
		}
	},

	// Finish the touchdown process
	after: function(f) {
		var i, j, l = (tetris.level < 20 ? tetris.level : 20) * 25;
		// stats
		tetris.lines += f;
		if (tetris.lines % 10 === 0) {
			tetris.level = tetris.lines / 10;
		}
		window.clearTimeout(tetris.timer);
		tetris.timer = window.setInterval(tetris.moveDown, tetris.duration - l);
		tetris.score += (tetris.level + 1) * tetris.points[f];
		// redraw the grid
		for (i = 0; i < 18; ++i) {
			for (j = 1; j < 11; ++j) {
				tetris.cells[i][j].css('backgroundColor',
					tetris.colors[tetris.grid[i][j]]);
			}
		}
		tetris.refresh();
	},

	// Draw the current shape
	draw: function(r, x, y, c) {
		var i, j;
		for (i = 0; i < 4; ++i) {
			for (j = 0; j < 4; ++j) {
				if (tetris.curShape[r][j][i]) {
					tetris.cells[y + j][x + i].css('backgroundColor', c);
				}
			}
		}
	},

	// Refresh the grid
	refresh: function() {
		// remove from the old position
		tetris.draw(tetris.r0, tetris.x0, tetris.y0, tetris.colors[0]);
		// draw to the next one
		tetris.draw(tetris.r, tetris.x, tetris.y, tetris.colors[tetris.cur]);
		// change stats
		$('#level').html(tetris.level + 1);
		$('#lines').html(tetris.lines);
		$('#score').html(tetris.score);
		// reset coordinates
		tetris.x0 = tetris.x;
		tetris.y0 = tetris.y;
		tetris.r0 = tetris.r;
	}

};

// Everything starts here
$(window).load(function() {
	tetris.init();
	$('#grid table, #next table').css('backgroundColor', tetris.colors[0]);
	$('#start').click(tetris.start);
	$('#stop').click(tetris.gameOver);
});

// http://codepen.io/ktomlee/pen/aNrZqG