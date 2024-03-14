import { useRef, useState } from "react";
import { useEffect } from "react";
import { Cancion, ControlPanel } from "./Audio";

function CPanel({refresh}){
	const [songVol , setSongVol] = useState(100);
	const barraWidth = useRef(0);

	function handleKeywords(event){
		event.preventDefault();

		const volumen = document.getElementById('volumen');
		const playBtn = document.getElementById('playBtn');
		const newSong = document.getElementById('cancion-input');
		const activeBar = document.getElementById('progress');
		const barra = document.getElementsByClassName('progressBar')[0];
		const resto = barra.getBoundingClientRect().left;

		switch(event.keyCode){
			case 32:
				playPauseHandler({target: playBtn});
				break;

			case 38:
				volumen.stepUp(5);
				changeVol({target: volumen});
				break;

			case 40:
				volumen.stepDown(5);
				changeVol({target: volumen});
				break;

			case 37:
				if(!Cancion.element) return;
				barraClick({clientX: parseFloat(activeBar.style.width) - (ControlPanel.porcionDeBarra/4) + resto})
				break;

			case 39:
				if(!Cancion.element) return;
				barraClick({clientX: parseFloat(activeBar.style.width) + (ControlPanel.porcionDeBarra/4) + resto})
				break;

			case 13:
				newSong.click();
				break;
		}
	}

	function resizeBarra(){
		const activeBar = document.getElementById('progress');
		ControlPanel.iniciar();

		activeBar.style.width = (parseInt(activeBar.style.width)>24)?
								(ControlPanel.barraWidth * (parseFloat(activeBar.style.width) / barraWidth.current)) + 'px' :
								24 + 'px';
		barraWidth.current  = ControlPanel.barraWidth;

		if(Cancion.element){
			ControlPanel.insertDuration(Cancion.duration);
			console.log(parseFloat(activeBar.style.width));
			Cancion.miliSeconds = Cancion.duration*1000*(parseFloat(activeBar.style.width) / ControlPanel.barraWidth)-250;
		}

	}

	function playPauseHandler(event){
		const playBtn = event.target;
		if(!Cancion.nombre) return;
		
		if(playBtn.className.indexOf('play') != -1){
			Cancion.play(refresh);
			playBtn.className = playBtn.className.replace('play' , 'pause');
		}
		else{
			Cancion.pause();
			playBtn.className = playBtn.className.replace('pause' , 'play');
		}
	}

	function barraClick(event){
		const posX = event.clientX;
		const barra = document.getElementsByClassName('progressBar')[0];
		const activeBar = document.getElementById('progress');
		const resto = barra.getBoundingClientRect().left;

		let num = (posX-resto >= 24)? posX-resto : 24;
		activeBar.style.width = num + 'px';

		Cancion.currentSongPosition = num;
		Cancion.modifyTimePos((num.toFixed(2)));
	}

	function changeVol(event){
		const inputVol = parseInt(event.target.value);
		Cancion.modifyVol(inputVol/100);
		setSongVol(inputVol);
	}

	useEffect(()=>{
		const progressBar = document.getElementsByClassName('progressBar')[0];
		const volumen = document.getElementById('volumen');
		const playBtn = document.getElementById('playBtn');
		
		progressBar.addEventListener('click', barraClick, false);
		volumen.addEventListener('input', changeVol, false);
		playBtn.addEventListener('click', playPauseHandler, false);

		ControlPanel.iniciar();
		window.addEventListener('resize', resizeBarra, false);
		window.addEventListener('keyup', handleKeywords, false);

		barraWidth.current = progressBar.getBoundingClientRect().right - progressBar.getBoundingClientRect().left;
	} , []);

	return(
		<article className="panelControl">
			<button id="playBtn" className="play botonCPanel"></button>
			<div className="progressBar">
				<div id="progress">
					<div id="ball"></div>
				</div>
			</div>
			<div className="cajaVolumen botonCPanel">
				<span id="iconoVolumen" className={
					(songVol > 40)?	'maxVol' :
					(songVol > 0)?	'minVol' :
					'mute'
				}
				onClick={()=>{
					const mute = (songVol === 0);
					document.getElementById('volumen').value = mute? 100 : 0;
					Cancion.modifyVol(mute? 1 : 0);
					setSongVol(mute? 100 : 0);
				}}></span>
				<input type="range" id="volumen" min={0} max={100} step={1} defaultValue={100}/>
			</div>
		</article>
	);
}

export default CPanel;