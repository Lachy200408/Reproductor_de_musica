export const Cancion = {
	//Variables que aporten informacion de la cancion para mostrar
	nombre: null,
	artista: null,
	album: null,
	poster: null,
	duration: null,

	//Variable que guardara la cancion
	element: null,
	
	//Variable para controlar el progreso del audio
	audioInterval: null,
	currentSongPosition: 24,
	miliSeconds: 0,

	nueva: function(archivo){
		//Limpiar primero
		if(this.element){
			this.element.pause();
			this.clean();
		}

		const audioUrl = URL.createObjectURL(archivo);
		this.element = new Audio(audioUrl);

		const _jsmediatags = window.jsmediatags;
		_jsmediatags.read(archivo, {
			onSuccess: function(tag){
				const {data , format} = tag.tags.picture;
				let base64String = '';
				for(let i=0; i<data.length; i++){
					base64String += String.fromCharCode(data[i]);
				}
				
				Cancion.nombre = tag.tags.title;
				Cancion.artista = tag.tags.artist;
				Cancion.album = tag.tags.album;
				Cancion.poster = `data:${data.format};base64,${window.btoa(base64String)}`;
			},
			onError: function(error){
				console.log('Error reading tags: ', error.type, error.info);
			}
		});

		setTimeout(()=>{
			this.duration = this.element.duration.toFixed(2);
			ControlPanel.insertDuration(this.duration);
		}, 500);
	},

	play: function(callBackRefresh){
		if(this.element){
			if(this.element.currentTime!=0 && parseFloat(ControlPanel.progreso.style.width)<ControlPanel.barraWidth){
				console.log(parseFloat(ControlPanel.progreso.style.width)<ControlPanel.barraWidth);
				this.element.currentTime = this.currentSongPosition*ControlPanel.porcionDeDuracionMili/1000;
			}
			else if(parseFloat(ControlPanel.progreso.style.width)==ControlPanel.barraWidth){
				this.element.currentTime = 0;
			}
			this.element.play();

			this.audioInterval = setInterval(()=>{
				ControlPanel.progreso.style.width = this.currentSongPosition + 'px';

				this.currentSongPosition += ControlPanel.porcionDeBarra/4;
				this.currentSongPosition = (this.currentSongPosition > ControlPanel.barraWidth)? ControlPanel.barraWidth : this.currentSongPosition;

				this.miliSeconds+=250;
				console.log(this.miliSeconds);
				if((this.miliSeconds >= this.duration*1000)){
					ControlPanel.pauseBtn();
					this.currentSongPosition = 24;
					this.miliSeconds = 0;
					clearInterval(Cancion.audioInterval);
				}
				callBackRefresh(1);
			},250);
		}
	},

	pause: function(){
		if(this.element){
			this.element.pause();
			clearInterval(Cancion.audioInterval);
		}
	},

	modifyVol: function(_value){
		if(this.element){
			this.element.volume = _value;
		}
	},

	modifyTimePos: function(posicion){
		if(this.element){
			this.miliSeconds = this.duration*1000*(posicion / ControlPanel.barraWidth)-250;
			this.element.currentTime = (posicion*ControlPanel.porcionDeDuracionMili/1000).toFixed(2);
		}
	},

	clean: function(){
		clearInterval(Cancion.audioInterval);
		
		ControlPanel.pauseBtn();
		ControlPanel.progreso.style=`width: 24px`;

		this.nombre= null;
		this.artista= null;
		this.album= null;
		this.poster= null;
		this.element= null;
		this.audioInterval= null;
		this.currentSongPosition= 24;
		this.miliSeconds= 0;
	}
};

export const ControlPanel = {
	playBtn: null,
	barraProgreso: null,
	progreso: null,

	barraWidth: 0,
	porcionDeBarra: 0,
	porcionDeDuracionMili: 0,

	iniciar: function(){
		this.playBtn = document.getElementById('playBtn');
		this.barraProgreso = document.getElementsByClassName('progressBar')[0];
		this.progreso = document.getElementById('progress');
		this.barraWidth = this.barraProgreso.getBoundingClientRect().right - this.barraProgreso.getBoundingClientRect().left;
	},
	
	pauseBtn: function(){
		this.playBtn.className = this.playBtn.className.replace('pause' , 'play');
	},

	insertDuration: function(duration){
		this.porcionDeBarra = parseFloat((this.barraWidth / duration).toFixed(2));
		this.porcionDeDuracionMili = parseFloat((duration*1000 / this.barraWidth).toFixed(2));
	}
};