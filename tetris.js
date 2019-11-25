const cvs = document.getElementById('tetris');
const ctx = cvs.getContext("2d");
const scoreElement =  document.getElementById('score')


const ROW = 20;
const COL = COLUMN = 10;
const SQ = squareSize = 20;
const VACANT = 'white';

// dibujando un cuadrado
function drawSquare(x, y, color){
ctx.fillStyle = color;
ctx.fillRect(x * SQ, y * SQ, SQ, SQ);

ctx.strokeStyle = 'black';
ctx.strokeRect(x * SQ, y * SQ, SQ, SQ);
}

// Dibujando el tablero
let board = [];
for(r = 0; r < ROW; r++){
	board[r] = [];
	for(c = 0; c < COL; c++){
		board[r][c] = VACANT;
	}
}

function drawBoard(){
for(r = 0; r < ROW; r++){
	for(c = 0; c < COL; c++){
		drawSquare(c, r, board[r][c])
	}
}
}
drawBoard();
//Iniciando un pieza


// Objetos
const PIECES = 	[
	[Z, 'red'],
	[S, 'green'],
	[T, 'yellow'],
	[O, 'blue'],
	[L, 'purple'],
	[I, 'cyan'],
	[J, 'orange']
];

// Generando piezas 
function randomPiece(){
	let r = randomN = Math.floor(Math.random() * PIECES.length)// 0 - 6
	return new Piece( PIECES[r][0],PIECES[r][1]);
}

let p = randomPiece();

// iniciando el objecto
function Piece(tetromino, color){
	this.tetromino = tetromino;
	this.color = color;

	this.tetrominoN = 0; // empieza en el primer patron 
	this.activeTetromino = this.tetromino[this.tetrominoN];

	this.x = 3;
	this.y = -2;
}
//Rellenando fill
Piece.prototype.fill = function(color) {
	for( r = 0; r < this.activeTetromino.length; r++){
	for( c = 0; c < this.activeTetromino.length; c++){
		// Dibujamos solo los cuadrados ocupados
		if ( this. activeTetromino[r][c]) {
			drawSquare(this.x + c, this.y + r, color)
		}
	}
}
}
// diujando en el  tablero





/// Caida de la pieza
Piece.prototype.draw = function() {
	this.fill(this.color);
}
Piece.prototype.unDraw = function() {
	this.fill(VACANT);
}
Piece.prototype.moveDown = function() {
	if(!this.collision(0, 1, this.activeTetromino)){
	this.unDraw(); 
	this.y++;
	this.draw();	
	}else{
		this.lock();
		p = randomPiece();
	}
	
}
// Moviemiento derecha
Piece.prototype.moveRight = function() {
	if(!this.collision(1, 0, this.activeTetromino)){
	this.unDraw(); 
	this.x++;
	this.draw();	
	}
}
// Moviendo a la izquienda
Piece.prototype.moveLeft = function() {
	if(!this.collision(-1, 0, this.activeTetromino)){
	this.unDraw(); 
	this.x--;
	this.draw();
	}
}
Piece.prototype.rotate = function(){
    let nextPattern = this.tetromino[(this.tetrominoN + 1)%this.tetromino.length];
    let kick = 0;
    
    if(this.collision(0,0,nextPattern)){
        if(this.x > COL/2){
            // it's the right wall
            kick = -1; // we need to move the piece to the left
        }else{
            // it's the left wall
            kick = 1; // we need to move the piece to the right
        }
    }
    
    if(!this.collision(kick,0,nextPattern)){
        this.unDraw();
        this.x += kick;
        this.tetrominoN = (this.tetrominoN + 1)%this.tetromino.length; // (0+1)%4 => 1
        this.activeTetromino = this.tetromino[this.tetrominoN];
        this.draw();
    }
}
let score = 0;

Piece.prototype.lock = function(){
	for ( r =0; r < this.activeTetromino.length; r++){
		for( c=0; c < this.activeTetromino.length; c++){
			if( !this.activeTetromino[r][c]){
				continue
			}
			//si la pieza toca cruza el limite 0 game over
			if(this.y + r < 0){
				alert('Game Over');
				gameOver = true;
				break;
			}
			
			// deteniendo la pieza
			board[this.y+r][this.x+c] = this.color
		}
	}
	// Borrando la fila
	for( r = 0; r < ROW; r++){
		let isRowFull = true;
		for( c = 0; c < COL; c++){
		isRowFull = isRowFull && (board[r][c] != VACANT);
	}	
	if(isRowFull){
		// si la fila esta llena 
		// bajamos una fila la siguiente fila
		for( y = r; y >1; y--){
			for( c = 0; c < COL; c++){
				board[y][c] = board[y-1][c]
			}
		}
		for( c = 0; c <COL; c++){
			board[0][c] = VACANT;
		}
		score += 10;
	}
	}
	// refresca el tablero
	drawBoard()
	scoreElement.innerHTML = score;
}



// Limites de la funcion

Piece.prototype.collision = function(x, y, piece){
	for( r = 0; r < piece.length; r++){
		for( c = 0; c < piece.length; c++){
			// si el cuadrado esta vacio lo saltamos
			if(!piece[r][c]) {
				continue;
			}
			//cordenadas de la pieza despues del movimiento
			let newX = this.x + c + x;
			let newY= this.y + r + y;

			//condiciones
			if(newX < 0 || newX >= COL || newY >= ROW){
				return true;
			}
			// saltar newY < 0; board[-1] o saltaria error
			if(newY < 0){
				continue;
			}
			// cheque si hay otra pieza en el tablero
			if( board[newY][newX] != VACANT){
				return true;
			}
		}
	}
	return false
}

//Controles

document.addEventListener('keydown', CONTROL);

function CONTROL(event) {
	if(event.keyCode == 37){
		p.moveLeft();
		dropStart = Date.now();
	}else if(event.keyCode == 38){
		p.rotate();	
		dropStart = Date.now();
	}else if(event.keyCode == 39){
		p.moveRight();
		dropStart = Date.now();		
	}else if(event.keyCode == 40){	
		p.moveDown();
	}
}


// Baja cada un seguendo
let dropStart = Date.now();
function drop(){
	let now = Date.now();
	let delta = now - dropStart;
	if (delta > 1000) {
		p.moveDown();
		dropStart = Date.now();
	}
	requestAnimationFrame(drop);

}
p.draw();
drop();