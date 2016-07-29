var blockSize = 24;
var columns = 10;
var rows = 20;
var maxRotations = 4;
var FPS = 60;

var ENABLE_GHOST = true;

var UPDATE_INTERVAL = 1000.0/3.0; // 3 Squares per second.

var LINES_PER_LEVEL = 10;

var COLOR_EMPTY = '#101020';
var COLOR_RED = '#aa2222';
var COLOR_GREEN = '#22aa22';
var COLOR_BLUE = '#2222aa';
var COLOR_MAGENTA = '#aa22aa';

var COLORS = [COLOR_RED,COLOR_GREEN,COLOR_BLUE,COLOR_MAGENTA];

var SHAPE_EMPTY = [ [ 0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 0 ]  ];

var SHAPE_O = [ [ 0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ],
               [ 0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ],
               [ 0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ],
               [ 0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ] ];

var SHAPE_I = [ [  0, 1, 0, 0,
                   0, 1, 0, 0,
                   0, 1, 0, 0,
                   0, 1, 0, 0, ],
                [  0, 0, 0, 0,
                   1, 1, 1, 1,
                   0, 0, 0, 0,
                   0, 0, 0, 0, ],
              [  0, 0, 1, 0,
                   0, 0, 1, 0,
                   0, 0, 1, 0,
                   0, 0, 1, 0, ],
                [  0, 0, 0, 0,
                   0, 0, 0, 0,
                   1, 1, 1, 1,
                   0, 0, 0, 0, ]];

var SHAPE_S = [ [  0, 0, 0, 0,
                0, 0, 1, 1,
                0, 1, 1, 0,
                0, 0, 0, 0,  ],
              [  0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 1, 0,  ],
              [  0, 0, 0, 0,
                0, 0, 1, 1,
                0, 1, 1, 0,
                0, 0, 0, 0,  ],
              [  0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 1, 0,  ]];

var SHAPE_Z = [ [  0, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ],
              [  0, 0, 0, 0,
                0, 0, 1, 0,
                0, 1, 1, 0,
                0, 1, 0, 0, ],
              [  0, 0, 0, 0,
                1, 1, 0, 0,
                0, 1, 1, 0,
                0, 0, 0, 0, ],
              [  0, 0, 0, 0,
                0, 0, 1, 0,
                0, 1, 1, 0,
                0, 1, 0, 0, ]];

var SHAPE_L = [ [  0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0, ],
              [  0, 0, 0, 0,
                0, 0, 0, 0,
                0, 1, 1, 1,
                0, 1, 0, 0, ],
              [  0, 0, 0, 0,
                0, 1, 1, 0,
                0, 0, 1, 0,
                0, 0, 1, 0, ],
              [  0, 0, 0, 0,
                0, 0, 0, 0,
                0, 0, 0, 1,
                0, 1, 1, 1, ]];

var SHAPE_J = [ [  0, 0, 0, 0,
                0, 0, 1, 0,
                0, 0, 1, 0,
                0, 1, 1, 0, ],
              [  0, 0, 0, 0,
                0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 1, ],
              [  0, 0, 0, 0,
                0, 1, 1, 0,
                0, 1, 0, 0,
                0, 1, 0, 0, ],
              [  0, 0, 0, 0,
                0, 0, 0, 0,
                0, 1, 1, 1,
                0, 0, 0, 1, ]];

var SHAPE_T = [ [  0, 0, 0, 0,
                1, 1, 1, 0,
                0, 1, 0, 0,
                0, 0, 0, 0, ],
              [  0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 0, 0,
                0, 1, 0, 0, ],
              [  0, 0, 0, 0,
                0, 1, 0, 0,
                1, 1, 1, 0,
                0, 0, 0, 0, ],
              [  0, 0, 0, 0,
                0, 1, 0, 0,
                0, 1, 1, 0,
                0, 1, 0, 0, ]
              ];

var SHAPES = [ SHAPE_I , SHAPE_O,  SHAPE_S, SHAPE_Z, SHAPE_L, SHAPE_J, SHAPE_T ];

var allowedShapes = SHAPES.length;

/*
  Helper Functions
*/

function updateStatus(val) {
  $(".status").html(val);
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function ColorLuminance(hex, lum) {
	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
    // convert the hex value into a int
		c = parseInt(hex.substr(i*2,2), 16);
    // multiply the new int with the luminance and ensure
    // we keep the max and min value between 0 and 255
    // convert the value back into hex
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}

function at(x,y,w) {
  return x + y * w;
}

/* 
  Misc Game functions
*/

function Block() {
  this.x = 3;
  this.y = -4;  
  this.color = COLORS[Math.floor(( Math.random() * COLORS.length ))];
  this.shape = SHAPE_EMPTY;  
  this.shapeIndex = 0;
  this.rotation = 0;
  this.checkCollisionRight = false;
  this.checkCollisionLeft = false;
}

function CellInfo() {
  this.color = COLOR_EMPTY;
}

function GameGrid() {
  this.cells = createArray(columns,rows); 
  this.init = function() {
    for(var x = 0; x < columns; x++) {
      for(var y = 0; y < rows; y++) {
        this.cells[x][y] = new CellInfo();        
        }
    }
  }; 
}

function getContext() {
  var c = document.getElementById("tetris-game");
  var ctx = c.getContext("2d");
  return ctx;
}

// 1: One Line
// 2: Two Lines
// 3: ...
var LINE_SCORE = [ 0, 40, 100, 300, 1200 ];

function getScore(lines) {  
  return level * LINE_SCORE[lines];
}

/*
  Game Logic
*/
var isGameOver = false;
var grid = undefined;
var activeBlock = undefined;
var nextBlock = undefined;
var keyReady = false;
var level = 1;
var score = 0;
var linesThisLevel = 0;
var lastUpdate = new Date();
$(document).ready(function() {
  
  $(document).keydown(function(event) {
    if(keyReady === false) return;
    var key = event.which;
    switch(key) {
      case 32: forceDown();
        return false;
        break;
      case 37: moveLeft();
        break;
      case 38: rotate();
        return false;
        break;
      case 39: moveRight();
        break;
      case 40: moveDown();
        return false;
        break;
    }
    handleCollision();
  });
  
  function startGame() {
    updateStatus("");   
    
    grid = new GameGrid();
        
    score = 0;
    setLevel(1);
    isGameOver = false;

    gameLoop();
  }
     
  function setLevel(lvl) {
    linesThisLevel = 0;
    level = lvl; 
    grid.init();
  }
  
  function rotate() {
    if(activeBlock !== undefined) {
      activeBlock.rotation++;
      
      if(activeBlock.rotation == maxRotations)
        activeBlock.rotation = 0;
      
      activeBlock.shape = SHAPES[activeBlock.shapeIndex][activeBlock.rotation];      
    }
  }  
  function moveDown() {
    applyGravity();
    
    handleCollision();  
  }
  
  function moveLeft() {
    if(activeBlock!=undefined) {
      activeBlock.x--;
      activeBlock.checkCollisionRight = false;
      activeBlock.checkCollisionLeft = true;
    }    
  }
  function moveRight() {
    if(activeBlock!=undefined) {
      activeBlock.x++;
      activeBlock.checkCollisionRight = true;
      activeBlock.checkCollisionLeft = false;
    }
  }
  function forceDown() {
    
    for(var i = 0; i < rows; i++) {
      applyGravity();
      handleCollision();  
    }
    checkLines();
  }
  
  function createBlock() {
      var activeBlock = new Block();
      activeBlock.shapeIndex = Math.floor(( Math.random() * allowedShapes )) ;
      activeBlock.rotation = 0;//Math.floor(( Math.random() * maxRotations ));
      activeBlock.shape = SHAPES[ activeBlock.shapeIndex ][activeBlock.rotation];
    return activeBlock;
  }
  
  function gameLoop() {            
    keyReady = true;
    if(activeBlock == undefined) {
      if(nextBlock == undefined){
          activeBlock = createBlock();
        }
      else {
        activeBlock = nextBlock;
      }
      nextBlock = createBlock();
    }
    
    $(".score").html("You have <b>" + score + "</b> points");
    $(".level").html("You are on level <b>"+level+"</b>");
        
    checkLines();
    
    var timeNow = new Date();
    if( Math.abs(timeNow - lastUpdate) > UPDATE_INTERVAL ) {
    
      if( isGameOver === true ) return;

      applyGravity();        

      handleCollision();    
      
      lastUpdate = timeNow;
    }
    
    drawGameboard();
    
    drawNextBlock();
    
    if( ENABLE_GHOST === true )
      drawGhost();
    
    if( isGameOver === true ) return;
    
    if( linesThisLevel >= LINES_PER_LEVEL ) {
      setLevel(level+1);
      activeBlock = undefined;
      updateStatus("<font style='color: green;'>Yay! Congratulations! You've completed level " + level-1 + "!</font>");
    }
    
    setTimeout(gameLoop, 1000 / (FPS + ((level-1)*2)));
  }
  
  function handleCollision() {
      var hitGround = forceInsideBounds();
      if( hitGround ) {        
        stickBlock();
        
        checkLines(); 
        
        activeBlock = undefined;               
      }
    return false;
  }
  
  function checkLines() {
    var linesRemoved = 0;
    for(var y = 0; y < rows; y++) {
      var cellsThisRow = 0;
      for(var x = 0; x < columns; x++) {
        if(grid.cells[x][y].color !== COLOR_EMPTY) {
          cellsThisRow++;          
          if( y < 2 ) {
            gameOver();                 
            return
          }
        }        
        if(cellsThisRow == columns) {  
          cellsThisRow = 0;
          linesRemoved++; 
          removeLine(y);
          break;
        }
      }
    }
    linesThisLevel += linesRemoved;
    score += getScore(linesRemoved);
  }
  
  function removeLine(row) {
    updateStatus("Remove Line: " + row);
    for(var x = 0; x < columns; x++) {
      grid.cells[x][row].color = COLOR_EMPTY;
    }
    
        
     for(var y = row; y > 0; y--) {
      for(var x = 0; x < columns; x++) {
        if(y-1>=0) {
          grid.cells[x][y].color = grid.cells[x][y-1].color;
        }
      }
    } 
    
  }
  
  function gameOver() {
    isGameOver=true;
    activeBlock = undefined;
    updateStatus("<font style='color: red;'><b>Game Over!</b><br/>New game will start in 3 seconds</font>");
    setTimeout(startGame,3000);
  }   
  
  function forceInsideBounds() {
    if(activeBlock != undefined) { 
      
      for(var col = 0; col < 4; col++) {
          for(var row = 0; row < 4; row++) {  
            var cellValue = activeBlock.shape[col + row * 4];
            if(cellValue == 1) {
              var x = activeBlock.x + col;              
              var y = activeBlock.y + row;
                            
              if( x >= columns ) {
               // updateStatus("Force insideBounds: x >= col" );
                activeBlock.x--;
                return false;
              }
              
              if( x < 0 ) {
             //   updateStatus("Force insideBounds: x < col" );
                activeBlock.x++;
                return false;
              }
              
              if( y >= rows ) {
            //    updateStatus("Force insideBounds: y > row" );
                activeBlock.y--;
                return true;
              } 
              
              if(grid.cells[x][y] !== undefined && grid.cells[x][y].color !== COLOR_EMPTY) {
                // return true;
                if(activeBlock.checkCollisionRight === true) { 
                  activeBlock.checkCollisionRight = false;
                  activeBlock.x--; // Force jump to the left
                  return false;
                }
                else if(activeBlock.checkCollisionLeft === true) { 
                  activeBlock.checkCollisionLeft = false;
                  activeBlock.x++; // Force jump to the right
                  return false;
                }
                else {
                  activeBlock.y--;                  
                  return true;
                }
              }
              
            }
          } // end for
        } // end for
      activeBlock.checkCollisionLeft = false;
      activeBlock.checkCollisionRight = false;
    } // end if         
    return false;
  }
  
  function applyGravity() {
    if(activeBlock != undefined) {      
      activeBlock.y++;
    }
  }  

  function drawBackground(x, y, w, h)
  {
    for(var col = 0; col < w; col++) {
      for(var row = 0; row < h; row++) {        
        drawCell(col+x,row+y, COLOR_EMPTY);
      }
    }
  }
  
  function drawGameboard() {
    for(var col = 0; col < columns; col++) {
      for(var row = 0; row < rows; row++) {        
        drawCell(col,row, grid.cells[col][row].color);
      }
    }
    
            
    if( activeBlock != undefined) {
      
      drawBlock(activeBlock, activeBlock.x, activeBlock.y);

    } // end if     
  }
  
  function stickBlock() {
    if( activeBlock != undefined) {
      for(var col = 0; col < 4; col++) {
          for(var row = 0; row < 4; row++) {  
            var cellValue = activeBlock.shape[col + row * 4];
            if(cellValue == 1) {
              var x = col+activeBlock.x;
              var y = row+activeBlock.y;
              if( activeBlock == undefined ) return;
              grid.cells[x][y].color = activeBlock.color;
            }
          } // end for
        } // end for 
    } // end if
  }
  
  function drawBlock(block,x,y, color)
  {
    for(var col = 0; col < 4; col++) {
          for(var row = 0; row < 4; row++) {  
            var cellValue = block.shape[col + row * 4];
            if(cellValue == 1) {
              var targetX = x + col;
              var targetY = y + row;
              if(targetY >= 0 && targetX >= 0) {
                if(color === undefined)
                  drawCell(targetX, targetY, block.color);
                else 
                  drawCell(targetX, targetY, color);
              }
            }
          } // end for
        }
  }
  
  function drawGhost() {
    
    // var ctx = getContext();
    // ctx.globalAlpha=0.2;
    
   // drawBlock(activeBlock, activeBlock.x, rows-3, "#FFFFFF");
    
    // ctx.globalAlpha=1;
  }
  
  function drawNextBlock() {
     drawBackground(columns+2,2,4,4);
     drawBlock(nextBlock, columns+2,2);
     
  }
  
  function drawCell(x,y,color) {
    var lighter = ColorLuminance(color, 0.2);
    var darker = ColorLuminance(color, -0.2);
    var borderWidth = 2;
    var ctx = getContext();
    ctx.fillStyle = color;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
    
    ctx.fillStyle = lighter;
    ctx.fillRect(x * blockSize, y * blockSize, blockSize, borderWidth);
    ctx.fillRect((x * blockSize) + blockSize - borderWidth, y * blockSize, borderWidth, blockSize);
    
    ctx.fillStyle = darker;
    ctx.fillRect(x * blockSize, (y * blockSize) + blockSize - borderWidth, blockSize, borderWidth);
    ctx.fillRect(x * blockSize, y * blockSize, borderWidth, blockSize);    
  }  
  
  startGame();  
});

// http://codepen.io/zerratar/pen/xGLeKd