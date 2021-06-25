import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function BookingsActive() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.id_user) : (id_user = id);

    const bookings = useFetch(`http://localhost:8080/api/users/${id_user}/bookings
    `);

    if (!bookings) {
        return <div>Loading...</div>;
    }
    return (
        <div className="user">
            {bookings.map((b) => (
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
                    <button>Incidencia</button>
                    <button>Pagar</button>
                    <br />
                </div>
            ))}
            {!bookings && <i>Loading...</i>}
            {bookings && !bookings.bookings && <i>No results found!</i>}
            <button>Moficiar usuario</button>
        </div>
    );
}

export default BookingsActive;
