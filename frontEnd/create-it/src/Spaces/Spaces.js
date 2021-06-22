import { Helmet } from 'react-helmet';
import './spaces.css';
import useFetch from '../useFetch';

import Rooms from '../Rooms/Rooms'

function Spaces() {
    

    const spaces = useFetch(`http://localhost:8080/api/spaces`);

    console.log(spaces);

    if (!spaces) {
        return <div>Loading...</div>;
    }
  

    return (
        <div className="spaces">
            <Helmet>
                <title>Localizaciones - CreateIt</title>
            </Helmet>
            <h1>Localizaciones</h1>
            <div className="spaces-content">
                {spaces &&
                    spaces.spaces.map((s) => (
                        <div key={s.id_space}>
                            <h2>Espacio: {s.space_name} </h2>
                            <br />
                            <span>Descripción {s.description} </span>
                            <br />
                            <span>dirección {s.address} </span>
                            <br />
                            <span>localidad{s.location}</span>
                            <br />
                            <span>Teléfono{s.phone}</span>
                            <br />
                            <span>Rating{s.rating}</span>
                            <br />
                            <Rooms id_space={s.id_space} name={s.space_name}/>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Spaces;
