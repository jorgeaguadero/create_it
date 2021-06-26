import './Profile.css';
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
        return <div>Loading...</div>;
    }
    if (bookings.error) {
        return <div className="error">{bookings.error}</div>;
    }

    return (
        <div className="BookingsActive">
            {bookings &&
                bookings.map((b) => (
                    <div key={b.id_booking}>
                        <Link to={`/profile/bookings/${b.id_booking}`}>id Reserva: {b.id_booking}</Link>
                        <br />
                        {me.role === 'admin' && <span>Espacio: {b.id_space}</span>}
                        {me.role === 'admin' && <br />}
                        <span>Estado de pago: {b.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</span>
                        <br />
                        <span>Precio: {priceFormated.format(b.price)}</span>
                        <br />
                        <span>Fecha: {new Date(b.start_date).toLocaleDateString()}</span>

                        <br />
                    </div>
                ))}
            {!bookings && <i>Loading...</i>}
            {bookings && bookings.length === 0 && <i>No hay reservas activas en este momento</i>}
        </div>
    );
}

export default BookingsActive;
