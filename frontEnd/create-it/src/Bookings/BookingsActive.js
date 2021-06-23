import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function BookingsActive() {
    const me = useSelector((s) => s.user);
    let id = '';
    const { id_user } = useParams();

    me ? (id = me.id_user) : (id = id_user);

    const bookings = useFetch(`http://localhost:8080/api/users/${id}/bookings/active
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
                    <span>Pagado? --- {b.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</span>
                    <br />
                    <span>Precio --- {b.price}</span>
                    <br />
                    <span>Fecha --- {b.start_date}</span>
                    <br />
                    <button type="button">Incidencia</button>
                    <button type="button">Pagar</button>
                    <br />
                </div>
            ))}
            {!bookings && <i>Loading...</i>}
            {bookings && bookings.length === 0 && <i>No hay reservas activas en este momento</i>}
        </div>
    );
}

export default BookingsActive;
