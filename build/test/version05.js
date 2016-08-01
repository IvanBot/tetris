var stage;
var fieldArray=[];
var landedArr=[];
var tetrominoes=[];
var colors=[];
var fieldSprite;
var masker;
var currentTetromino;
var nextTetromino;
var currentRotation;
var tRow;
var tCol;
var timeCount;
var next_t;
var GRID_ROW=18;
var GRID_COL=10;
var TS=24;
var gameOver=false;

init();
function init(){
    var canvas = document.getElementById("canvas");
	stage = new createjs.Stage(canvas);
	// CREATING BACKGROUND AND START THE GAME
	generateField();
	initTetrominoes();
	nextTetromino=Math.floor(Math.random()*7);
	generateTetromino();
	// UPDATE THE CANVAS
	createjs.Ticker.addListener(window);
	stage.update();
    
	$(document).keydown(onkeydown);
}

function generateField() {
	var colors=['#222222','#333333'];
	fieldSprite = new createjs.Shape();
	// MASKER TO MASK THE UPPER PORTION OF THE GAME
	masker = new createjs.Shape();
	masker.graphics.beginFill('#ffffff');
	masker.graphics.rect(0,TS*2,TS*GRID_COL,TS*(GRID_ROW-2));
	fieldSprite.mask = masker;
	fieldSprite.graphics.beginStroke('#000000');
	for (var i = 0; i < GRID_ROW; i++) {
		fieldArray[i] = [];
		landedArr[i] = [];
		for (var j = 0; j < GRID_COL; j++) {
			fieldArray[i][j]=0;
			landedArr[i][j]=null;
			fieldSprite.graphics.beginFill(colors[((j % 2) + (i % 2)) % 2], 0);
			fieldSprite.graphics.rect(TS*j,TS*i,TS,TS);
		}
	}
	stage.addChild(fieldSprite);
	colors=null;
}
function initTetrominoes() {
	// I
	tetrominoes[0]=[[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]];
	colors[0]='#00FFFF';
	// T
	tetrominoes[1]=[[[0,0,0,0],[1,1,1,0],[0,1,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,0,0],[0,1,0,0],[0,0,0,0]],[[0,1,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]];
	colors[1]='#AA00FF';
	// L
	tetrominoes[2]=[[[0,0,0,0],[1,1,1,0],[1,0,0,0],[0,0,0,0]],[[1,1,0,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],[[0,0,1,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[0,1,1,0],[0,0,0,0]]];
	colors[2]='#FFA500';
	// J
	tetrominoes[3]=[[[1,0,0,0],[1,1,1,0],[0,0,0,0],[0,0,0,0]],[[0,1,1,0],[0,1,0,0],[0,1,0,0],[0,0,0,0]],[[0,0,0,0],[1,1,1,0],[0,0,1,0],[0,0,0,0]],[[0,1,0,0],[0,1,0,0],[1,1,0,0],[0,0,0,0]]];
	colors[3]='#0000FF';
	// Z
	tetrominoes[4]=[[[0,0,0,0],[1,1,0,0],[0,1,1,0],[0,0,0,0]],[[0,0,1,0],[0,1,1,0],[0,1,0,0],[0,0,0,0]]];
	colors[4]='#FF0000';
	// S
	tetrominoes[5]=[[[0,0,0,0],[0,1,1,0],[1,1,0,0],[0,0,0,0]],[[0,1,0,0],[0,1,1,0],[0,0,1,0],[0,0,0,0]]];
	colors[5]='#00FF00';
	// O
	tetrominoes[6]=[[[0,1,1,0],[0,1,1,0],[0,0,0,0],[0,0,0,0]]];
	colors[6]='#FFFF00';
}
function generateTetromino(){
	if (gameOver) return;
	currentTetromino=nextTetromino;
	currentRotation=0;
	tRow=0;
	tCol=3;
	drawTetromino();
	nextTetromino=Math.floor(Math.random()*7);
	drawNext();
	// TIMER INTERVAL TO FALL THE TETROMINO
	if (canFit(tRow,tCol,currentRotation)) {
		clearTimeout(timeCount);
		timeCount = setInterval(onTime, 500);
	} else {
		gameOver=true;
	}

}
function drawTetromino() {
	var ct=currentTetromino;
	tetromino = new createjs.Shape();
	stage.addChild(tetromino);
	tetromino.mask = masker;
	tetromino.graphics.beginStroke('#111111');
	for (var i=0; i<tetrominoes[ct][currentRotation].length; i++) {
		for (var j=0; j<tetrominoes[ct][currentRotation][i].length; j++) {
			if (tetrominoes[ct][currentRotation][i][j]==1) {
				tetromino.graphics.beginFill(colors[ct]);
				tetromino.graphics.drawRect(TS*j,TS*i,TS,TS);
			}
		}
	}
	placeTetromino();
}
function placeTetromino() {
	tetromino.x=tCol*TS;
	tetromino.y=tRow*TS;
}

function onkeydown(e) {
	switch (e.keyCode) {
		case 37 : // LEFT
		if (gameOver) return;
		if (canFit(tRow,tCol-1,currentRotation)) {
			tCol--;
			placeTetromino();
		}
		e.preventDefault();
		break;
		case 39 : // RIGHT
		if (gameOver) return;
		if (canFit(tRow,tCol+1,currentRotation)) {
			tCol++;
			placeTetromino();
		}
		e.preventDefault();
		break;
		case 38 : // UP/ROTATE
		if (gameOver) return;
		if (tRow < 0) tRow = 0;
		if (tCol < 0) tCol = 0;
		if (tCol > GRID_COL - tetrominoes[currentTetromino][currentRotation].length) 
			tCol = GRID_COL - tetrominoes[currentTetromino][currentRotation].length;
		var ct=currentRotation;
		// SET TEMPORARY VALUE 
		// TO CHECK IF THE NEXT ROTATE IS CAN FIT
		var tmpRow = tRow;
		var tmpCol = tCol;
		var tmpRot = ct;
		var rot = (ct + 1) % tetrominoes[currentTetromino].length;
		if (canFit(tRow, tCol, rot)) {
			currentRotation=rot;
			stage.removeChild(tetromino);
			drawTetromino();
			placeTetromino();
		} 
		if(!canFit(tRow, tCol, rot)) {
			currentRotation = tmpRot;
			tCol = tmpCol;
			tRow = tmpRow;
			stage.removeChild(tetromino);
			drawTetromino();
			placeTetromino();
		}
		e.preventDefault();
		break;
		case 40 : // DOWN
		if (gameOver) return;
		if (canFit(tRow+1,tCol)) {
			tRow++;
			placeTetromino();
		} else {
			landTetromino();
			generateTetromino();
		}
		e.preventDefault();
		break;
        default:break;
	}
	
}
function canFit(row, col, rot) {
	var ct=currentTetromino;
	for (var i=0; i<tetrominoes[ct][currentRotation].length; i++) {
		for (var j=0; j<tetrominoes[ct][currentRotation][i].length; j++) {
			if (tetrominoes[ct][currentRotation][i][j]==1) {
				
				// OUT OF LEFT BOUNDARY
				if (col+j<0) return false;
				
				// OUT OF RIGHT BOUNDARY
				if (col + j > GRID_COL - 1) return false;
				
				// OUT OF BOTTOM BOUNDARY
				if (row+i>GRID_ROW-1) return false;
				
				// HIT ANOTHER TETROMINO
				if (fieldArray[row+i][col+j]==1) return false;
				
			}
		}
	}
	return true;
}
function landTetromino(){
	var ct=currentTetromino;
	var landed;
	for (var i=0; i<tetrominoes[ct][currentRotation].length; i++) {
		for (var j=0; j<tetrominoes[ct][currentRotation][i].length; j++) {
			if (tetrominoes[ct][currentRotation][i][j]==1) {
				landed=new createjs.Shape();
				landed.mask = masker;
				landed.graphics.beginStroke('#111111');
				landed.graphics.beginFill(colors[currentTetromino]);
				landed.graphics.drawRect(TS*(tCol+j),TS*(tRow+i),TS,TS);
				stage.addChild(landed);
				
				fieldArray[tRow+i][tCol+j]=1;
				
				landedArr[tRow+i][tCol+j]=landed;
			}
		}
	}
	stage.removeChild(tetromino);
	
	clearInterval(timeCount);
	checkForLines();
}
function checkForLines() {
	for (var i=0; i<GRID_ROW; i++) {
		if (fieldArray[i].indexOf(0) == -1) {
			// REMOVING LINE(S)
			for (var j=0; j<GRID_COL; j++) {
				fieldArray[i][j]=0;
				stage.removeChild(landedArr[i][j]);
			}
			// OFFSETING THE TETROMINOES
			for (j=i; j>=0; j--) {
				//if (fieldArray[j].indexOf(1) == -1) break;
				for (var k=0; k<GRID_COL; k++) {
					if (fieldArray[j][k]==1) {
						fieldArray[j][k]=0;
						fieldArray[j+1][k]=1;
						landedArr[j][k].y+=TS;
						landedArr[j+1][k]=landedArr[j][k];
					}
				}
			}
		}
	}
}
function onTime(){
	if (canFit(tRow+1,tCol,currentRotation)) {
		tRow++;
		placeTetromino();
	} else {
		landTetromino();
		generateTetromino();
	}
}
// WILL DRAW THE NEXT TETROMINO
function drawNext() {
	if (next_t) stage.removeChild(next_t);
	next_t=new createjs.Shape();
	next_t.x=TS*(GRID_COL+1);
	next_t.y=TS*1;
	stage.addChild(next_t);
	next_t.graphics.beginStroke('#111111');
	for (var i=0; i<tetrominoes[nextTetromino][0].length; i++) {
		for (var j=0; j<tetrominoes[nextTetromino][0][i].length; j++) {
			if (tetrominoes[nextTetromino][0][i][j]==1) {
				next_t.graphics.beginFill(colors[nextTetromino]);
				next_t.graphics.drawRect(TS*j,TS*i,TS,TS);
				next_t.graphics.endFill();
			}
		}
	}
	// ADD THE "NEXT" TEXT
	var nextTxt = new createjs.Text('NEXT', 'Bold 25px Helvetica', '#000000');
	nextTxt.x=TS*(GRID_COL+1);
	nextTxt.y=0;
	stage.addChild(nextTxt);
}
function tick(){ 
	stage.update(); 
}
