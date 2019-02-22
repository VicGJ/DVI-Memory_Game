/**
 * MemoryGame es la clase que representa nuestro juego. Contiene un array con la cartas del juego,
 * el número de cartas encontradas (para saber cuándo hemos terminado el juego) y un texto con el mensaje
 * que indica en qué estado se encuentra el juego
 */
var MemoryGame = MemoryGame || {};

/**
 * Constructora de MemoryGame
 */
MemoryGame = function(gs){

	this.juego = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
	var cartas = ["8-ball", "potato", "dinosaur", "kronos", "rocket", "unicorn", "guy", "zeppelin"];
	var mensajes = ["Memory Game", "Match Found!", "Try Again", "You Win!"];
	this.puntos = 0;
	this.punto = false;
	this.fallo = false;
	this.encontrando = false;
	this.cartaBuscada = -1;
	var timeGeneral;
	this.espera = false;

	this.initGame = function initGame(){

		for(i = 0; i <= 15; i++)
		{
			this.juego[i] = 0;
			this.juego[i] = new MemoryGameCard(cartas[Math.trunc(i/2)]);
		}
		this.aleatorio(this.juego);
      	this.loop();
	};

	this.draw = function draw(){

		if(this.puntos === 8)
		{
			gs.drawMessage(mensajes[3]);
			clearInterval(this.timeGeneral);
			var that = this;
			var time = setTimeout(function(){
				if(confirm("¿Otra partida?")){that.reset();}}, 3000);
			clearTimeout(this.time);
		}
		else if(this.punto)
		{
			gs.drawMessage(mensajes[1]);
		}
		else if(this.fallo)
		{
			gs.drawMessage(mensajes[2]);
		}
		else
		{
			gs.drawMessage(mensajes[0]);
		}
		
		for (i = 0; i <= 15; i++){
			this.juego[i].draw(gs, i);
		}
     	
	};

	this.loop = function loop(){
		var that = this;
		this.timeGeneral = setInterval(function(){that.draw()}, 16);
		
	};

	this.onClick = function onClick(cardId){
		if(!this.espera){
			if(!this.juego[cardId].volteada){
				this.juego[cardId].flip();
				if(this.encontrando){
					if (this.juego[cardId].compareTo(this.juego[this.cartaBuscada])){
						this.fallo = false;
						this.punto = true;
						this.encontrando = false;
						this.puntos++;
					}
					else{
						this.fallo = true;
						this.espera = true;
						var that = this;
						setTimeout(function(){that.taparCartas();}, 1000);
					}
					this.encontrando = false;
				}
			
				else{
					this.encontrando = true;
					this.cartaBuscada = cardId;
				}
			}
			

			this.taparCartas = function taparCartas(){
				this.punto = false;
				this.juego[cardId].flip();
				this.juego[this.cartaBuscada].flip();
				this.espera = false;
			}
		}
	};

	//Auxiliar para rellenar el array con números aleatorios del 0 al 15
	this.aleatorio = function aleatorio (juego){
		var j, x, i;
	    for (i = juego.length - 1; i > 0; i--) {
	        j = Math.floor(Math.random() * (i + 1));
	        x = juego[i];
	        juego[i] = juego[j];
	        juego[j] = x;
	    }
	};

	this.reset = function reset(){
		
		var i;
		for(i = 0; i <=15; i++)
		{
			this.juego[i].flip();
			this.juego[i].encontrada = false;
		}
		this.puntos = 0;
		this.punto = false;
		this.fallo = false;
		//this.vuelta = -1;
		this.encontrando = false;
		this.cartaBuscada = -1;
		this.initGame();
	}
};



/**
 * Constructora de las cartas del juego. Recibe como parámetro el nombre del sprite que representa la carta.
 * Dos cartas serán iguales si tienen el mismo sprite.
 * La carta puede guardar la posición que ocupa dentro del tablero para luego poder dibujarse
 * @param {string} id Nombre del sprite que representa la carta
 */
MemoryGameCard = function(id) {
	this.sprite = id;
	this.volteada = false;
	this.encontrada = false;

	

	this.flip = function flip(){

		if (this.volteada === true)
			this.volteada = false;
		else
			this.volteada = true;

	}

	this.found = function found(){

		this.encontrada = true;

	}

	this.compareTo = function compareTo(otherCard){

		if (this.sprite === otherCard.sprite)
			return true;
		else return false;

	}

	this.draw = function draw(gs, pos){

		if(this.volteada)
			gs.draw(this.sprite, pos);
		else
			gs.draw("back", pos);

	}
};
