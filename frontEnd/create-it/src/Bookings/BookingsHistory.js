import './Profile.css';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

import { priceFormated } from '../Helpers';

function BookingsHistory() {
    const [search, setSearch] = useState('');
    const me = useSelector((s) => s.user);
    let idUser = '';
    const { id_user } = useParams();
    me ? (idUser = me.id_user) : (idUser = id_user);

    let url = '';
    me.role === 'admin'
        ? (url = `http://localhost:8080/api/bookings`)
        : (url = `http://localhost:8080/api/users/${idUser}/completed/bookings
    `);

    const bookings = useFetch(url);

    if (!bookings) {
        return <div>Loading...</div>;
    }
    if (bookings.error) {
        return <div className="error">{bookings.error}</div>;
    }
    return (
        <div className="bookingsHistory">
            <input placeholder="EN VERSIÓN 2.0" value={search} onChange={(e) => setSearch(e.target.value)} />
            {bookings.map((b) => (
                <div key={b.id_booking}>
                    <Link to={`/profile/bookings/${b.id_booking}`}>id Reserva {b.id_booking}</Link>
                    <br />
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

export default BookingsHistory;
