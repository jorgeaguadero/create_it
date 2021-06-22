
import './rooms.css';
import useFetch from '../useFetch';

import Extras from '../Extras/Extras'

function Rooms({id_space, name}) {
    

    const rooms = useFetch(`http://localhost:8080/api/spaces/${id_space}/rooms`);
    

    console.log(rooms);

    if (!rooms) {
        return <div>Loading...</div>;
    }
   
    return (
        <div className="rooms">
            <h2>Salas de {name} </h2>
            <div className="rooms-content">
                {rooms &&
                    rooms.map((r) => (
                        <div key={r.id_room}>
                            <h3>Sala: {r.room_code} </h3>
                            <br />
                            <span>Descripción {r.description} </span>
                            <br />
                            <span>Precio {r.price} € </span>
                            <br />
                            <Extras id_space={r.id_space} type={r.type} sala={r.room_code} />
                            <br />
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Rooms;
