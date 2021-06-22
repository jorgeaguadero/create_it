import './Profile.css';
import { useParams, Link } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

import Pay from './Pay';

function BookingsActive() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.userId) : (id_user = id);

    const bookings = useFetch(`http://localhost:8080/api/users/2/bookings
    `);

    if (!bookings) {
        return <div>Loading...</div>;
    }
    return (
        <div className="BookingsActive">
            {bookings.map((b) => (
                <div key={b.id_booking}>
                    <span>id Reserva --- {b.id_booking}</span>
                    <br />
                    <span>Espacio --- {b.id_space}</span>
                    <br />
                    <span>Sala --- {b.id_room}</span>
                    <br />
                    <span>Pagado? --- { b.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</span>
                    <br />
                    <span>Precio --- {b.price}</span>
                    <br />
                    <span>Fecha --- {b.start_date}</span>
                    <br />
                    <Link to>
                        <Pay booking={b} />
                        Incidencia
                    </Link>
                    <button type="button">Pagar</button>
                    <br />
                </div>
            ))}
            {!bookings && <i>Loading...</i>}
            {bookings && !bookings.bookings && <i>No results found!</i>}
        </div>
    );
}

export default BookingsActive;
