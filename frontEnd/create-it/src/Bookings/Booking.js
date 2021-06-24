import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { priceFormated } from '../Helpers';
import { useSelector } from 'react-redux';

function Booking() {
    const me = useSelector((s) => s.user);
    const id_user = me.id_user;

    const { id_booking } = useParams();
    const booking = useFetch(`http://localhost:8080/api/users/${id_user}/bookings/${id_booking}`);

    if (!booking) {
        return <div>Loading...</div>;
    }

    return (
        <div className="booking">
            <Helmet>Reserva {booking.booking_id}|CreateIt</Helmet>
            <h1>{booking.id_booking}</h1>
            <span>Espacio: {booking.id_space}</span>
            <br />
            <span>Fecha: {new Date(booking.start_date).toLocaleDateString()}</span>
            <br />
            <span>Estado de pago: {booking.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</span>
            <br />
            <span>Precio: {priceFormated.format(booking.price)}</span>
            <br />
            <span>Fecha de realización: {new Date(booking.booking_date).toLocaleDateString()}</span>
            <br />
            {booking.pending_payment === 1 && <button type="button">Pagar</button>}
            <br />
            <button>Incidencia</button>
        </div>
    );
}

export default Booking;
