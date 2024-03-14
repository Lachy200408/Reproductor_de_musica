import { useEffect, useRef, useState } from "react";
import { Cancion } from "./Audio.js";

function Metadatos({refresh}){
	const	[posterUrl, setPosterUrl] = useState(),
			[titulo, setTitulo] = useState(),
			[artista, setArtista] = useState(),
			[album, setAlbum] = useState();

	useEffect(()=>{
		let veces = 0;
		const intId = setInterval(()=>{
			if(Cancion.poster != null && veces===0){
				veces++;
				setPosterUrl(Cancion.poster);
				setTitulo(Cancion.nombre);
				setArtista(Cancion.artista);
				setAlbum(Cancion.album);
				clearInterval(intId);
			}
			else{
				setPosterUrl(null);
				setTitulo(null);
				setArtista(null);
				setAlbum(null);
			}
		},500);
	})

	return(
		<article className="metadatos">
			<figure	id="poster">
				<img src={
					posterUrl
				}/>
			</figure>
			<figcaption className="titulo-interprete">
				<h1 id="titulo">
					{
						titulo ?? "Título"
					}
				</h1>
				<h3 id="interprete">
					{
						artista ?? "Artista"
					}
				</h3>
				<h3 id="album">
					{
						album ?? "Album"
					}
				</h3>
			</figcaption>
		</article>
	);
}

export default Metadatos;