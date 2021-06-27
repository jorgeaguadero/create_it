import './BookingsActive.css';
import { Link, useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';
import { priceFormated } from '../Helpers';

function BookingsActive() {
    const me = useSelector((s) => s.user);
    let id = '';
    const { id_user } = useParams();
    me ? (id = me.id_user) : (id = id_user);

    let url = '';
    me.role === 'admin'
        ? (url = `http://localhost:8080/api/bookings/active/spaces/1`)
        : (url = `http://localhost:8080/api/users/${id}/active/bookings`);

    const bookings = useFetch(url);

    if (!bookings) {
        return <i>Loading...</i>;
    }
    if (bookings.error) {
        return <div className="error">{bookings.error}</div>;
    }

    return (
        <div className="BookingsActive">
            {bookings &&
                bookings.map((b) => (
                    <div key={b.id_booking} className="booking-list">
                        <li>
                            <Link to={`/profile/bookings/${b.id_booking}`}>Id Reserva: {b.id_booking}</Link>
                        </li>
                        {me.role === 'admin' && <li>Espacio: {b.id_space}</li>}
                        <li>Estado de pago: {b.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</li>
                        <li>Precio: {priceFormated.format(b.price)}</li>
                        <li>Fecha: {new Date(b.start_date).toLocaleDateString()}</li>
                    </div>
                ))}
            {bookings && bookings.length === 0 && <i>No hay reservas activas en este momento</i>}
        </div>
    );
}

export default BookingsActive;
