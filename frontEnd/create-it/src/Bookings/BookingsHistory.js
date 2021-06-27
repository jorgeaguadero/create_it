import './BookingsHistory.css';
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
        return <i>Loading...</i>;
    }
    if (bookings.error) {
        return <div className="error">{bookings.error}</div>;
    }
    return (
        <div className="BookingsHistory">
            <div>
                <input placeholder="EN VERSIÓN 2.0" value={search} onChange={(e) => setSearch(e.target.value)} />
                <label>Buscador</label>
            </div>

            {bookings.map((b) => (
                <div key={b.id_booking} className="booking-list">
                    <li>
                        <Link to={`/profile/bookings/${b.id_booking}`}>id Reserva {b.id_booking}</Link>
                    </li>
                    <li>Estado de pago: {b.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</li>
                    <li>Precio: {priceFormated.format(b.price)}</li>
                    <li>Fecha: {new Date(b.start_date).toLocaleDateString()}</li>
                </div>
            ))}
            {bookings && bookings.length === 0 && <i>No hay reservas activas en este momento</i>}
        </div>
    );
}

export default BookingsHistory;
