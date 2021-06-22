
import './extras.css';
import useFetch from '../useFetch';

function Extras({id_space, type, sala}) {
    

    const extras = useFetch(`http://localhost:8080/api/spaces/${id_space}/extras/${type}`);
    

    console.log(extras);

    if (!extras) {
        return <div>Loading...</div>;
    }
   
    return (
        <div className="extras">
            <div className="rooms-content">
                {extras &&
                    extras.map((e) => (
                        <div key={e.id_extra}>
                            <h4>Extras para la sala {sala} </h4>
                            <span>Descripción {e.description} </span>
                            <br />
                            <span>Precio {e.price} € </span>
                            <br />
                            <span></span>
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default Extras;
