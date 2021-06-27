import { Helmet } from 'react-helmet';
import './spaces.css';
import useFetch from '../useFetch';
import { NavLink, useParams } from 'react-router-dom';

import Rooms from '../Rooms/Rooms';

function Spaces() {
    const spaces = useFetch(`http://localhost:8080/api/spaces`);

    console.log(spaces);

    if (!spaces) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Spaces">
            <Helmet>
                <title>Create It</title>
            </Helmet>
            <h1>Localizaciones</h1>
            <div className="spaces-content">
                {spaces &&
                    spaces.spaces.map((s) => (
                        <div key={s.id_space} className={`space-${s.id_space}`}>
                            <div className={`logo-${s.id_space}`}></div>
                            <h2>{s.space_name} </h2>
                            <li>{s.description} </li>
                            <li>Estamos en: {s.address} </li>
                            <li>localidad: {s.location}</li>
                            <li>Teléfono: {s.phone}</li>
                            <li>Rating: {s.rating ? '{s.rating}' : 'Aún no ha recibido valoraciones'}</li>
                            <li>
                                <NavLink to={`/rooms/${s.id_space}`} exact active ClassName="active">
                                    Salas
                                </NavLink>
                            </li>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Spaces;
