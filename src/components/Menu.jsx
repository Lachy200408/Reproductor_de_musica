import { useEffect } from 'react';
import { Cancion } from './Audio.js';

function Menu({refresh}){
	function getSong(event){
		if(event.target.files[0]){
			const cancion = event.target.files[0];
			Cancion.nueva(cancion);
		}
		else{
			Cancion.clean();
		}
		refresh('newSong');
	}

	useEffect(()=>{
		const input = document.getElementById('cancion-input');

		input.addEventListener('change', getSong, false);
	},[]);

	return(
		<header className="menu">
			<h1 id="nombrePag">Repmus</h1>
			<input type="file" name="cancion-input" id="cancion-input" accept="audio/,.mp3,.wav,.ogg"/>
		</header>
	);
}

export default Menu;