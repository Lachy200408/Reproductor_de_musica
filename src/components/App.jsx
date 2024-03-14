import Metadatos from "./Metadatos";
import CPanel from "./CPanel";
import Menu from "./Menu";
import '../styles/App.css';
import { useEffect, useState } from "react";

function App(){
	const [thereIsSong , setIsSong] = useState();

	useEffect(()=>{
		if(thereIsSong === 'newSong'){
			setIsSong(1);
		}
	}, [thereIsSong]);

	return(
		<section className="reproductor">
			<Menu refresh={setIsSong} />
			<Metadatos refresh={setIsSong} />
			<CPanel refresh={setIsSong}/>
		</section>
	);
}

export default App;