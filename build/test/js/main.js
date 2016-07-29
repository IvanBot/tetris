// http://jsfiddle.net/ova777/kFxja/

var fs = "1111:01|01|01|01*011|110:010|011|001*110|011:001|011|010*111|010:01|11|01:010|111:10|11|10*11|11*010|010|011:111|100:11|01|01:001|111*01|01|11:100|111:11|10|10:111|001", now = [3,0], pos = [4,0];
var gP = function(x,y) { return document.querySelector('[data-y="'+y+'"] [data-x="'+x+'"]'); };
var draw = function(ch, cls) {
    var f = fs.split('*')[now[0]].split(':')[now[1]].split('|').map(function(a){return a.split('')});
    for(var y=0; y<f.length; y++)
        for(var x=0; x<f[y].length; x++)
            if(f[y][x]=='1') {
                if(x+pos[0]+ch[0]>9||x+pos[0]+ch[0]<0||y+pos[1]+ch[1]>19||gP(x+pos[0]+ch[0],y+pos[1]+ch[1]).classList.contains('on')) return false;
                gP(x+pos[0]+ch[0], y+pos[1]+ch[1]).classList.add(cls!==undefined?cls:'now');
            }
    pos = [pos[0]+ch[0], pos[1]+ch[1]];
}
var deDraw = function(){ if(document.querySelectorAll('.now').length>0) deDraw(document.querySelector('.now').classList.remove('now')); }
var check = function(){
	for(var i=0; i<20; i++)
		if(document.querySelectorAll('[data-y="'+i+'"] .brick.on').length == 10) 
			return check(roll(i), document.querySelector('#result').innerHTML=Math.floor(document.querySelector('#result').innerHTML)+10);
};
var roll = function(ln){ if(false !== (document.querySelector('[data-y="'+ln+'"]').innerHTML = document.querySelector('[data-y="'+(ln-1)+'"]').innerHTML) && ln>1) roll(ln-1); };
window.addEventListener('keydown', kdf = function(e){
    if(e.keyCode==38&&false!==(now[1]=((prv=now[1])+1)%fs.split('*')[now[0]].split(':').length) && false===draw([0,0], undefined, deDraw())) draw([0,0],undefined, deDraw(), now=[now[0],prv]);
    if((e.keyCode==39||e.keyCode==37)&&false===draw([e.keyCode==39?1:-1,0],undefined,deDraw())) draw([0,0],undefined,deDraw());
    if(e.keyCode == 40)
        if(false === draw([0,1], undefined, deDraw())) {
            if(draw([0,0], 'on', deDraw())||true) check();
            if(false === draw([0,0], undefined, now = [Math.floor(Math.random()*fs.split('*').length),0], pos = [4,0])) { 
				toV=-1; 
				alert('Your score: '+document.querySelector('#result').innerHTML); 
			}
        }
});
toF = function() {
    kdf({keyCode:40});
    setTimeout(function(){if(toV>=0)toF();}, toV=toV>0?toV-0.5:toV);
}
toF(toV = 500);

//
/**
 * @param options Parameters
 * @param options.elem DOM element for component
 * @param options.width Width of game field
 * @param options.height Height of game field
 */
function Tetris(options) {
  var elem = options.elem;
  var width = (+options.width < 10) ? 10 : ~~(+options.width);
  var height = (+options.height < 20) ? 21 : ~~(+options.height + 1);

  var controlTimeoutHandle;
  var fallingTimeoutHandle;

  var predictionField;
  var scoreField;
  var gameField;

  var tetraminoForms = [
    [
      ['i', 'i', 'i', 'i']
    ],

    [
      ['j', '.', '.'],
      ['j', 'j', 'j']
    ],

    [
      ['.', '.', 'l'],
      ['l', 'l', 'l']
    ],

    [
      ['o', 'o'],
      ['o', 'o']
    ],

    [
      ['.', 's', 's'],
      ['s', 's', '.']
    ],

    [
      ['.', 't', '.'],
      ['t', 't', 't']
    ],

    [
      ['z', 'z', '.'],
      ['.', 'z', 'z']
    ]
  ];

  var fieldArray = [];

  var currentTetramino;
  var nextTetramino;

  var coordsToMove = [0, 0];

  var fallSpeed = 1000;

  function generateComponent() {

    function generateUI() {
      var divUi = document.createElement('div');

      predictionField = document.createElement('table');

      for (var i = 0; i < 4; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < 4; j++) {
          var td = document.createElement('td');
          tr.appendChild(td);
        }
        predictionField.appendChild(tr);
      }

      scoreField = document.createElement('div');
      scoreField.classList.add('score-field');
      scoreField.innerHTML = 0;

      divUi.appendChild(predictionField);
      divUi.appendChild(scoreField);

      divUi.classList.add('ui');

      elem.appendChild(divUi);
    }

    function generateGlassUI() {
      var divGameField = document.createElement('div');

      gameField = document.createElement('table');
      gameField.classList.add('glass')

      for (var i = 0; i < height; i++) {
        var tr = document.createElement('tr');
        for (var j = 0; j < width; j++) {
          var td = document.createElement('td');
          tr.appendChild(td);
        }
        gameField.appendChild(tr);
      }

      divGameField.appendChild(gameField);

      divGameField.classList.add('game');

      elem.appendChild(divGameField);
    }

    function generateFieldArray() {
      for (var i = 0; i < height; i++) {
        fieldArray.push([]);
        for (var j = 0; j < width; j++) {
          fieldArray[i].push('.');
        }
      }
    }

    generateUI();
    generateGlassUI();
    generateFieldArray();
  }

  // ------------- Tetramino Class ------------------

  function Tetramino(type) {
    this.form = tetraminoForms[type].slice(0);
    this.coords = [~~(width / 2) - ~~(tetraminoForms[type][0].length / 2), 0];
    this.prevCoords;
  }

  Tetramino.prototype.rotate = function() {
    var temp = new Array(this.form[0].length);

    for (var i = 0; i < temp.length; i++) {
      temp[i] = new Array(this.form.length);
      for (var j = 0; j < temp[i].length; j++) {
        temp[i][j] = this.form[temp[i].length - j - 1][i];
      }
    }

    for (var i = 0; i < temp.length; i++) {
      for (var j = 0; j < temp[i].length; j++) {
        if (fieldArray[this.coords[1] + i] !== undefined &&
          fieldArray[this.coords[1] + i][this.coords[0] + j] !== undefined &&
          fieldArray[this.coords[1] + i][this.coords[0] + j] === '.') {

          continue;
        } else {
          return;
        }
      }
    }

    this.form = temp;
  };

  Tetramino.prototype.control = function(coords) {
    if (coords[0] === 0 && coords[1] === -1) {
      this.rotate();
      return;
    }

    if (this.coords[0] + coords[0] >= 0 &&
      this.coords[0] + coords[0] + this.form[0].length <= fieldArray[0].length) {

      if (checkSideCoords(this.coords[0] + coords[0], coords[0])) {
        this.coords[0] += coords[0];
      }
    }

    if (this.coords[1] + coords[1] >= 0 &&
      this.coords[1] + coords[1] + this.form.length <= fieldArray.length) {
      this.coords[1] += coords[1];
    }
  };

  // ----------- Tetramino Class End ---------------

  function drawField() {
    for (var i = 0; i < fieldArray.length; i++) {
      for (var j = 0; j < fieldArray[i].length; j++) {
        gameField.rows[i].cells[j].className = '';
        gameField.rows[i].cells[j].classList.add(fieldArray[i][j]);
      }
    }
  }

  function drawNextTetramino() {
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        predictionField.rows[i].cells[j].className = '';
      }
    }

    for (var i = 0; i < nextTetramino.form.length; i++) {
      for (var j = 0; j < nextTetramino.form[i].length; j++) {
        predictionField.rows[i].cells[j].classList.add(nextTetramino.form[i][j]);
      }
    }
  }

  function controlTetramino(event) {
    var code = event.keyCode;

    if (code === 37) coordsToMove = [-1, 0];
    if (code === 38) coordsToMove = [0, -1];
    if (code === 39) coordsToMove = [1, 0];
    if (code === 40) coordsToMove = [0, 1];
  }

  function runTetris() {
    currentTetramino = new Tetramino(Math.floor(Math.random() * (6 + 1)));
    nextTetramino = new Tetramino(Math.floor(Math.random() * (6 + 1)));

    drawNextTetramino();

    moveTetramino();
    fallTetramino();
  }

  function moveTetramino() {
    controlTimeoutHandle = setTimeout(function() {

      if (currentTetramino.prevCoords) {
        for (var i = 0; i < currentTetramino.form.length; i++) {
          for (var j = 0; j < currentTetramino.form[i].length; j++) {
            if (currentTetramino.form[i][j] == '.') continue;
            fieldArray[i + currentTetramino.prevCoords[1]][j + currentTetramino.prevCoords[0]] = '.';
          }
        }
      }

      currentTetramino.control(coordsToMove);

      for (var i = 0; i < currentTetramino.form.length; i++) {
        for (var j = 0; j < currentTetramino.form[i].length; j++) {
          if (currentTetramino.form[i][j] == '.') continue;
          fieldArray[i + currentTetramino.coords[1]][j + currentTetramino.coords[0]] = currentTetramino.form[i][j];
        }
      }

      currentTetramino.prevCoords = currentTetramino.coords.slice(0);
      coordsToMove = [0, 0];

      drawField();
      checkBlocksUnderTetramino();

      moveTetramino();
    }, 0);
  }

  function fallTetramino() {
    fallingTimeoutHandle = setTimeout(function() {

      coordsToMove = [0, 1];

      fallTetramino();
    }, fallSpeed);
  }

  function checkBlocksUnderTetramino() {
    if (currentTetramino.coords[1] + currentTetramino.form.length === fieldArray.length) {
      changeTetramino();
      return;
    }

    for (var i = currentTetramino.form.length - 1; i >= 0; i--) {
      for (var j = currentTetramino.form[i].length - 1; j >= 0; j--) {

        if (currentTetramino.form[i][j] === '.') continue;

        if (fieldArray[currentTetramino.coords[1] + i + 1][currentTetramino.coords[0] + j] !== '.' &&
          fieldArray[currentTetramino.coords[1] + i][currentTetramino.coords[0] + j] !== '.' &&
          (currentTetramino.form[i + 1] === undefined || currentTetramino.form[i + 1][j] === '.')) {
          changeTetramino();
          return;
        }
      }
    }
  }

  function checkSideCoords(coords, side) {
    if (coords === 0 && coords === fieldArray[0].length) {
      return false;
    }

    var side = (side === -1) ? -1 : currentTetramino.form[0].length;

    for (var i = 0; i < currentTetramino.form.length; i++) {
      if (fieldArray[currentTetramino.coords[1] + i][currentTetramino.coords[0] + side] !== '.' &&
        currentTetramino.form[i][(side === -1) ? 0 : currentTetramino.form[0].length - 1] !== '.') {
        return false;
      }
    }

    return true;
  }

  function changeTetramino() {
    checkAndRemoveFilledRow();

    isGameOver();

    currentTetramino = nextTetramino;
    nextTetramino = new Tetramino(Math.floor(Math.random() * (6 + 1)));
    drawNextTetramino();
    scoreField.innerHTML++;
  }

  function checkAndRemoveFilledRow() {
    for (var i = 0; i < fieldArray.length; i++) {
      var toClean = true;
      for (var j = 0; j < fieldArray[i].length; j++) {
        if (fieldArray[i][j] === '.') {
          toClean = false;
          break;
        }
      }
      if (toClean) {
        fieldArray.splice(i, 1);
        fieldArray.unshift([]);

        for (var j = 0; j < width; j++) {
          fieldArray[0].push('.');
        }

        scoreField.innerHTML = +scoreField.innerHTML + width;
        fallSpeed = (fallSpeed > 300) ? fallSpeed - 50 : fallSpeed;
      }
    }
  }

  function isGameOver() {
    if (currentTetramino.coords[1] <= 1) {
      alert('game over');
      resetGame();
    }
  }

  function resetGame() {
    for (var i = 0; i < fieldArray.length; i++) {
      for (var j = 0; j < fieldArray[i].length; j++) {
        fieldArray[i][j] = '.';
      }
    }

    scoreField.innerHTML = 0;
    fallSpeed = 1000;
  }

  generateComponent();
  drawField();
  document.body.addEventListener('keydown', controlTetramino, false);
  runTetris();
}

var tetris = new Tetris({
  elem: document.getElementById('tetris'),
  width: 10,
  height: 20
});


////


// More about:
// http://mootools.net/forge/p/utetris

window.addEvent('domready', function() {
  var container = $('container'), preview = $('preview'), tetris = new uTetris(container, preview, {
    keypress: true,
    box_width: "20px",
    box_height: "20px"
  });

  var play = $("play"),
      score = $("score"),
      level = $("level"),
      lines = $("lines");

  tetris.addEvents({
    "start": function(e) {
      container.addClass('game');
      preview.addClass('game');
      setInfo(e);
      setPause();
    },
    "lines": setInfo,
    "fixed": setInfo,
    "pause": setPause,
    "gameover": function() {
      container.removeClass('game');
      preview.removeClass('game');
      play.set("html", "Play");
    }
  });

  function setLabel(str) {
    play.set("html", str);
  }

  function setInfo(obj) {
    level.set("html", "Level: " + obj.level || 0);
    score.set("html", "Score: " + obj.score || 0);
    lines.set("html", "Lines: " + obj.lines || 0);
  }

  function setPause(pause) {
    setLabel(pause ? "Resume" : "Pause");
  }

  play.addEvent("click", function() {
    if (this.isStop()) {
      this.restart();
    } else {
      this.pause();
    }
  }.bind(tetris));
});


/*
---

name: uTetris
description: uTetris base Class
license: MIT-Style License <http://www.lbnstudio.fr/license.txt>
copyright: Jose Luis Quintana <http://www.lbnstudio.fr/>
authors: Jose Luis Quintana <joseluisquintana20@gmail.com>
requires: 
  - Core: 1.4/*
provides: uTetris
 
...
*/

window.uTetris = new Class({
    version: '1.0',
    
    Implements: [Events, Options],
    
    container: null,
    preview: null,
    form: null,
    nForm: -1,
    retade: null,
    timeout: 100,
    
    _gameover: false,
    _win: false,
    _pause: false,
    _stop: true,
    _running: false,
    _isdown: false,
    
    score: 0,
    level: 0,
    lines: 0,
    lines_values: [40, 100, 600, 3600],
    current_line: 0,
    brickclass: '',
    brickclass_preview: '',
    first_step: true,
    
    options: {
        auto: false,
        keypress: false,
        speed: 800,
        speed_reduction: 100,
        score_increase: 200,
        score_top: 1000000,
        number_lines: 10,
        aX: 10,
        aY: 15,
        box_width: "20px",
        box_height: "20px",
        lines_animation: {
            base_class: "animate",
            out_class: "out",
            duration: 1
        },
        brick_classes: [{
            name:'cube'
        },{
            name:'bar'
        },{
            name:'zleft'
        },{
            name:'t'
        },{
            name:'zright'
        },{
            name:'lright'
        },{
            name:'lleft'
        }]
    },
    initialize: function(container, preview, options) {
        this.container = container;
        this.preview = preview;
        this.setOptions(options);
        this.buildStructure();
        
        if (this.options.auto) {
            this.start();
        }
    },
    buildStructure: function() {
        this.buildStage();
        this.buildPreview();
    },
    buildStage: function() {
        var tr,y,n;
        
        for (y = 0; y <= (this.options.aY-1); y++) {
            tr = new Element("<tr/>");
            tr.set('tween', {
                duration: 'long'
            });
            
            for (n = 0; n <= this.options.aX-1; n++) {
                this.getBox().inject(tr);
            }
            
            tr.inject(this.container);
        }
    },
    buildPreview: function() {
        var tr,y,n;
        
        for(y = 0; y <= 3; y++) {
            tr = new Element("<tr/>");
            
            for(n = 0; n <= 3; n++){
                this.getBox().inject(tr);
            }
            
            tr.inject(this.preview);
        }
    },
    setEvents: function() {
        if (this.options.keypress) {
            document.addEvent('keydown', this.keydown.bind(this));
        }
    },
    unsetEvents: function() {
        if (this.options.keypress) {
            document.removeEvents('keydown');
        }
    },
    isPause: function() {
        return this._pause;
    },
    isStop: function() {
        return this._stop;
    },
    isGameover: function() {
        return this._gameover;
    },
    isRunning: function() {
        return this._running;
    },
    keydown: function(e) {
        if (!this._gameover) {
            switch(e.code) {
                case 13:
                case 19:
                    if (this._gameover) {
                        this.restart();
                    } else {
                        this.pause();
                    }
                    break;
                case 37:
                    this.left();
                    break;
                case 39:
                    this.right();
                    break;
                case 32:
                    this.rotate();
                    break;
                case 40:
                    this.down();
                    break;
            }
        }
        
        e.preventDefault();
    },
    start: function() {
        if (!this._running) {            
            this.unsetEvents();
            this.create();
            this.timeline(false);
            this.move = this._running = true;
            this._stop = this._win = this._lose = this._pause = this._gameover = false;
            this.score = this.lines = this.level = 0;
            this.setEvents();
            this.fireEvent("start", [{
                level: this.level, 
                score: this.score, 
                lines: this.lines
            }]);
        }
    },
    restart: function() {
        if (this._stop || this._gameover || this._win) {
            this.stop();
            this.start();
            this.fireEvent("restart");
        }
    },
    stop: function() {
        clearTimeout(this._timeout_id);
        this._pause = this._running = false;
        this._stop = true;
        
        for (this.y = 0; this.y <= (this.options.aY-1); this.y++) {
            this.deleteLine(this.y);
        }
        
        this.fireEvent("stop");
    },
    pause: function() {
        if (!this.isAnimate && !this._gameover && !this._win) {
            this._pause = !this._pause;
            this.init = this._pause;
            this._running = !this._pause;
            this.fireEvent("pause", this._pause);
        }
    },
    left: function() {
        if (!this.isAnimate && !this.isAnimate && !this._gameover && !this._pause && !this._win) {
            if (this.move && this.validForm(this.x-1, this.y, this.pos)) {
                this.del();
                this.x--;
                this.renderStage();
                this.fireEvent("leftmove");
            }
        }
    },
    right: function() {
        if (!this.isAnimate && !this._gameover && !this._pause && !this._win) {
            if(this.move && this.validForm((this.x+1), this.y, this.pos)){
                this.del();
                this.x++;
                this.renderStage();
                this.fireEvent("rightmove");
            }
        }
    },
    down: function() {
        if (!this.isAnimate && !this._gameover && !this._pause && !this._win) {
            if (this.move) {
                this._isdown = true;
                
                if (this.validForm(this.x, (this.y+1), this.pos)) {
                    this.del(true);
                    this.y++;
                    this.renderStage();
                }
                
                this._isdown = false;
            }
        }
    },
    rotate: function() {
        if (!this.isAnimate && !this._gameover && !this._pause && !this._win) {
            if (this.move) {
                this.rePos();
                this.fireEvent("rotate");
            }
        }
    },
    getBox: function() {
        return new Element("td",{
            "width" : this.options.box_width,
            "height" : this.options.box_height,
            "border-width": 1
        });
    },
    timeline: function(del) {
        if (!this.isAnimate) {
            if (this._pause || this._stop) {
                this.stopTimeline();
            } else {
                if (this.validForm(this.x, (this.y+1), this.pos)) {                
                    this.startTimeline(del);
                
                    if (this.first_step) {
                        this.first_step = false;
                        this.fireEvent("create", [this.brickclass, this.brickclass_preview]);
                    }
                } else {
                    this.resetBricks(del);
                }
            }
        }
    },
    startTimeline: function(del) {
        if (del) {
            this.del();
        }
        
        this.y++;
        this.renderStage();
        
        this._timeout_id = setTimeout(function(){
            this.timeline(true);
        }.bind(this), this.options.speed - (this.level * this.options.speed_reduction));
    },
    stopTimeline: function() {
        this._timeout_id = setTimeout(function(){
            if (this.init) {
                this.y--;
                this.init = false;
            }
                
            this.timeline();
        }.bind(this), this.timeout);
    },
    resetBricks: function(del) {
        if(del) {
            this.fix();
            this.checkLines();
            this.create();
            this.timeline(false);
            this.move = true;
        } else {
            this._gameover = this._stop = true;
            this._running = false;
            this.fireEvent("gameover", [{
                level: this.level, 
                score: this.score, 
                lines: this.lines
            }]);
        }  
    },
    create: function() {
        this.current_line = 0;
        this.x = Math.round((this.options.aX-1) / 2) -1;
        this.y = 0;
        this.form = this.nForm;
        
        if (this.nForm == -1) {
            this.form = this.interv();
        }
        
        this.pos = this.forms[this.form][0];
        this.retade = 1;
        
        this.nForm = this.interv();
        this.first_step = true;
    },
    interv: function() {
        return parseInt(Math.random() * this.forms.length);
    },
    forms: new Array(
        new Array(
            Array(Array(0,1,0,1),  Array(0,0,1,1))
            ),
        new Array(
            Array(Array(-1,0,1,2), Array(0,0,0,0)),
            Array(Array(0,0,0,0), Array(-1,0,1,2))
            ),
        new Array(
            Array(Array(-1,0,0,1), Array(0,0,1,1)),
            Array(Array(0,0,1,1), Array(1,0,0,-1))
            ),
        new Array(
            Array(Array(-1,0,1,0), Array(0,0,0,1)),
            Array(Array(0,0,0,1),  Array(1,0,-1,0)),
            Array(Array(-1,0,1,0), Array(0,0,0,-1)),
            Array(Array(0,0,0,-1), Array(1,0,-1,0))
            ),
        new Array(
            Array(Array(1,0,-1,0), Array(0,0,1,1)),
            Array(Array(-1,-1,0,0), Array(-1,0,0,1))
            ),
        new Array(
            Array(Array(0,0,0,1),  Array(-1,0,1,1)),
            Array(Array(-1,0,1,1), Array(0,0,0,-1)),
            Array(Array(0,0,0,-1), Array(1,0,-1,-1)),
            Array(Array(-1,0,1,-1), Array(-1,-1,-1,0))
            ),
        new Array(
            Array(Array(0,0,0,-1), Array(-1,0,1,1)),
            Array(Array(-1,0,1,1), Array(0,0,0,1)),
            Array(Array(0,0,0,1), Array(-1,0,1,-1)),
            Array(Array(-1,-1,0,1), Array(-1,0,0,0))
            )
        ),
    renderStage: function() {
        var n = 0;
        this.brickclass = this.options.brick_classes[this.form].name;
        
        for (; n <= 3; n++) {
            this.getStageBrick(this.x + this.pos[0][n], this.y + this.pos[1][n]).addClass(this.brickclass);
        }
        
        this.lY = this.y;
        this.lX = this.x;
                        
        if (!this.validForm(this.x, (this.y + (this._isdown ? 2 : 1)), this.pos)) {
            this.score += this.current_lines;
        }
        
        this.renderPreview();
    },
    renderPreview: function() {
        var n = 0;
        this.brickclass_preview = this.options.brick_classes[this.nForm].name;

        this.preview.getElements("td").each(function(td){
            td.set('class','');
        }.bind(this));
        
        for (n = 0; n <= 3; n++) {
            this.getPreviewBrick(1 + this.forms[this.nForm][0][0][n], 1 + this.forms[this.nForm][0][1][n]).addClass(this.brickclass_preview);
        }
    },
    getPreviewBrick: function(x,y) {
        return this.preview.getElement("tr:nth-child("+(y+1)+") td:nth-child("+(x+1)+")");
    },
    getStageBrick: function(x,y) {
        return this.container.getElement("tr:nth-child("+(y+1)+") td:nth-child("+(x+1)+")");
    },
    rePos: function() {
        if (this.forms[this.form][this.retade]) {
            if (this.validForm(this.x, this.y, this.forms[this.form][this.retade])) {
                this.del();
                this.pos = this.forms[this.form][this.retade];
                this.renderStage();
                this.retade++;
            }
        } else {
            if (this.validForm(this.x, this.y, this.forms[this.form][0])) {
                this.del();
                this.pos = this.forms[this.form][0];
                this.renderStage();
            }
            
            this.retade = 1;
        }
    },
    validForm: function(x, y, form) {
        for (var n = 0; n <= 3; n++) {
            if (!this.isValid(x + form[0][n], y + form[1][n])) {
                return false;
            }
        }
        
        return true;
    },
    del: function(down) {
        this.current_lines = down ? this.current_lines + 1 : 0;
        
        for (var n = 0; n <= 3; n++) {
            this.getStageBrick(this.lX + this.pos[0][n], this.lY + this.pos[1][n]).set('class','');
        }
    },
    isValid: function(x, y){
        if (y > (this.options.aY-1) || x > (this.options.aX-1) || x < 0 || y < 0 || this.isUsed(x, y)) {
            return false;
        }
        
        return true;
    },
    fix: function() {
        for (var n = 0; n <= 3; n++) {
            this.getStageBrick(this.x + this.pos[0][n], this.y + this.pos[1][n]).set("abbr","1");
        }
    },
    isUsed: function(x, y) {
        return this.getStageBrick(x,y).get("abbr") == "1";
    },
    isLine: function(y) {
        for (var x = 0; x <= (this.options.aX-1); x++) {
            if (!this.isUsed(x,y)) {
                return false;
            }
        }
        
        return true;
    },
    checkLines: function() {
        var lines = [];
        
        for (var i = 0; i < this.options.aY; i++) {
            if (this.isLine(i)) {
                lines.push({
                    i: i,
                    e: this.container.getElement("tr:nth-child("+(i+1)+")").addClass(this.options.lines_animation.base_class)
                });
            }
        }           
        
        if (lines.length > 0) {
            this.isAnimate = true;
            this.animateLines(lines);
        }
        
        this.fireEvent('fixed', {
            level: this.level, 
            score: this.score, 
            lines: this.lines
        });
    },
    animateLines: function(lines) {
        var sec = 3, levelup = false, i;
        
        for (i = 0; i < sec; i++) {
            (function(i){
                lines.each(function(el) {
                    if (i % 2 == 0) {
                        el.e.addClass(this.options.lines_animation.out_class);
                    } else {
                        el.e.removeClass(this.options.lines_animation.out_class);
                    }
                }.bind(this));
            }.bind(this, i)).delay(i * (1000 * this.options.lines_animation.duration));
        }
        
        (function(){
            lines.each(function(el) {
                el.e.removeClass(this.options.lines_animation.base_class);
                this.deleteLine(el.i);
                this.relocate(el.i);
                
                this.lines++;
                
                if (this.lines % this.options.number_lines == 0) {
                    this.level += 1;
                    levelup = true;
                }
            }.bind(this));
            
            var line = this.lines_values[lines.length-1];
            this.score += (this.level * line) + line;
            this.fireEvent("lines", [{
                length: lines.length,
                level: this.level, 
                score: this.score, 
                lines: this.lines
            }]);
            
            if (levelup) {
                this.fireEvent("levelup", [{
                    level: this.level, 
                    lines: this.lines
                }]);
            }
            
            if (this.score >= this.options.score_top) {
                clearTimeout(this._timeout_id);
                this._win = true;
                this.stop();
                this.fireEvent("win", [{
                    level: this.level, 
                    score: this.score, 
                    lines: this.lines
                }]);
            }
            
            this.isAnimate = false;
            this.timeline();
        }.bind(this)).delay(sec * 1000);    
    },
    deleteLine: function(y) {
        for (var x = 0; x <= (this.options.aX-1); x++) {
            this.getStageBrick(x,y).set('class','').set('abbr','0');
        }
    },
    relocate: function(y) {
        for (; y >= 0; y--) {
            for (var x = (this.options.aX-1); x >= 0; x--) {
                if (this.isUsed(x, y)) {
                    var cls = this.getStageBrick(x,y).get('class');
                    this.getStageBrick(x,y).set('class','').set('abbr','0');
                    this.getStageBrick(x,y+1).set('abbr','1').addClass(cls);
                }
            }
        }
    }
});
