import './rooms.css';
import useFetch from '../useFetch';
import { Link, useParams } from 'react-router-dom';
import Extras from '../Extras/Extras';

function Rooms() {
    const { id_space } = useParams();
    const rooms = useFetch(`http://localhost:8080/api/spaces/${id_space}/rooms`);

    console.log(rooms);

    if (!rooms) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Rooms">
            <h2>Salas de para este espacio </h2>
            <div className="rooms-content">
                {rooms &&
                    rooms.map((r) => (
                        <div key={r.id_room}>
                            <h2>Sala: {r.room_code} </h2>
                            <li>Descripción {r.description} </li>
                            <li>Precio {r.price} € </li>
                            {/*<Extras id_space={r.id_space} type={r.type} sala={r.room_code} />*/}
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Rooms;
