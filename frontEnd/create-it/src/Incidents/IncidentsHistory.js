import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function IncidentsHistory() {
    const { id } = useParams();

    const incidents = useFetch(`http://localhost:8080/api/spaces/2/incidents`);

    if (!incidents) {
        return <div>Loading...</div>;
    }
    return (
        <div className="user">
            {incidents.map((b) => (
                <div key={b.id_booking}>
                    <span>id Reserva --- {b.id_booking}</span>
                    <br />
                    <span>Espacio --- {b.id_space}</span>
                    <br />
                    <span>Sala --- {b.id_room}</span>
                    <br />
                    <span>Pagado? --- {b.pending_payment}</span>
                    <br />
                    <span>Precio --- {b.price}</span>
                    <br />
                    <span>Fecha --- {b.start_date}</span>
                    <br />
                    <button>Solucionar</button>
                    <button>Pagar</button>
                    <br />
                </div>
            ))}
            {!incidents && <i>Loading...</i>}
            {/*bookings && !bookings && <i>No results found!</i>*/}
        </div>
    );
}

export default IncidentsHistory;
