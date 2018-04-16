
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

ctx.fillRect(0,0,canvas.width,canvas.height);


//Clases

function Board() {
	this.x = 0;
	this.y = 0;
	this.width = canvas.width;
	this.height = canvas.height;
	this.img = new Image();
	this.music = new Audio();
	this.music.src = 'http://66.90.93.122/ost/mega-man-x-snes-gamerip/ljbwbogb/04%20Opening%20Stage.mp3'
	this.img.src = 'http://ellisonleao.github.io/clumsy-bird/data/img/bg.png';
	this.score = 0;
	this.img.onload = function() {
		this.draw()
	}.bind(this);
	this.move = function() {
		this.x--;
		if(this.x < -canvas.width) { this.x = 0; }
	}
	this.draw = function() {
		this.move();
		ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
		ctx.drawImage(this.img,this.x + canvas.width,this.y,this.width,this.height);
	}
	this.drawScore = function() {
		this.score = Math.floor(frames / 60);
		ctx.fillStyle = 'white';
		ctx.font = '36px Avenir';
		ctx.fillText(this.score,this.width/2,this.y+50);
	}
}

function Flappy() {
	this.x = 150;
	this.y = 180;
	this.width = 50;
	this.height = 40;
	this.img = new Image();
	this.img.src = "assets/flappy.png";
	this.img.onload = function() {
		this.draw();
	}.bind(this);
	this.draw = function() {
		this.y += 2;
		ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
		if(this.y < 0 || this.y + 40 >canvas.height) {
			gameOver();
		}
	}
	this.move = function() {
		this.y -= 50;
	}
	this.isTouching = function(pipe) {
		return(this.x < pipe.x + pipe.width) &&
			  (this.x + this.width > pipe.x) &&
			  (this.y < pipe.y + pipe.height) &&
			  (this.y + this.height > pipe.y );
	}
	this.jump =new Audio();
	this.jump.src = 'assets/jump.mp3';
}

function Pipe(y,height) {
	this.x = canvas.width;
	this.y = y;
	this.width = 50;
	this.height = height;
	this.draw = function() {
		this.x -= 1;
		ctx.fillStyle = "green";
		ctx.fillRect(this.x,this.y,this.width,this.height);
	}
}




//Declaraciones

var board = new Board();
var flappy = new Flappy();
var pipes = [];

var interval;
var frames = 0;
//var start = document.getElementById('start');



//Funciones

function generatePipes() {
	if(!(frames % 200 === 0)) return;
	var ventana = 150;
	var randomHeight = Math.floor(Math.random()*200)+50;
	var pipe = new Pipe(0,randomHeight);
	var pipe2 = new Pipe(randomHeight+ventana,canvas.height-(randomHeight+ventana));
	pipes.push(pipe);
	pipes.push(pipe2);
}

function drawPipes() {
	pipes.forEach(function(pipe) {
		pipe.draw();
	});
}

function gameOver() {
	stop();
	ctx.fonts = "200px courier";
	ctx.fillText('Game over', 250,100);
	ctx.fonts = "100px courier"
	ctx.fillText('Para comenzar el juego press R', 250, 150)
}

//función de validación
function checkCollition() {
	pipes.forEach(function(pipe) {
		var res = flappy.isTouching(pipe);
		if(res) {
			gameOver();
		}
	});
}

function update() {
	generatePipes();
	frames++;
	console.log(frames);
	ctx.clearRect(0,0,canvas.width,canvas.height);
	board.draw();
	flappy.draw();
	drawPipes();
	board.drawScore();
	checkCollition();
}

function start() {
	board.music.play();
	if(interval > 0) return;
	interval = setInterval(function() {
		update();
	},1000/60);
}

function stop() {
	board.music.pause();
	clearInterval(interval);
	interval = 0;
}




//listeners

document.getElementById('start').addEventListener('click', start);
document.getElementById('pause').addEventListener('click', stop);
addEventListener('keydown',function(e) {
	if(e.keyCode === 32) {
		flappy.move();
		flappy.jump.play();
	}
});


