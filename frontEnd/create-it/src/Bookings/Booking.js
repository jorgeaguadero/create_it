import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { priceFormated } from '../Helpers';
import { useSelector } from 'react-redux';

function Booking() {
    const [openPay, setOpenPay] = useState(false);
    const [openIncident, setOpenIncident] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openButtonreview, setButtonreview] = useState(false);
    const [type, setType] = useState('');
    const [description, setDescription] = useState('');
    const [rating, setRating] = useState('');
    const [text, setText] = useState('');

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const me = useSelector((s) => s.user);
    const id_user = me.id_user;
    const history = useHistory();

    const { id_booking } = useParams();
    const booking = useFetch(`http://localhost:8080/api/users/${id_user}/bookings/${id_booking}`);

    const handleCancel = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/bookings/${id_booking}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        if (res.ok) {
            history.push(`/profile/bookings/`);
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/bookings/${id_booking}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        if (res.ok) {
            history.push(`/profile/bookings/`);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/users/${id_user}/bookings/${id_booking}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, text }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        if (res.ok) {
            history.push(`/profile/bookings/`);
        }
    };

    const handleIncident = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/bookings/${id_booking}/incident`, {
            method: 'POST',
            body: JSON.stringify({ description, type }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        if (res.ok) {
            history.push(`/profile/bookings/`);
        }
    };

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
            {booking.pending_payment === 1 && <button onClick={() => setOpenPay(!openPay)}>Pagar</button>}
            {openPay && (
                <div>
                    <p>
                        Vas a pagar tu reserva {booking.id_booking} por un importe total de{' '}
                        {priceFormated.format(booking.price)}
                    </p>
                    <button onClick={handlePay}>Confirmar pago</button>
                </div>
            )}
            {<button onClick={() => setOpenCancel(!openCancel)}>Cancelar</button>}
            {openCancel && (
                <div>
                    <p>Oh no! De verdad quieres cancelar tu reserva {booking.id_booking} ?</p>
                    <button onClick={handleCancel}>Confirmar cancelación</button>
                </div>
            )}
            {new Date(booking.start_date) > start && new Date(booking.start_date) < end && (
                <button onClick={() => setOpenIncident(!openIncident)}>Crear Incidencia</button>
            )}

            {openIncident && (
                <form onSubmit={handleIncident}>
                    <div>
                        <label>
                            Tipo de incicencia
                            <select value={type} onChange={(e) => setType(e.target.value)} required>
                                <option value="" hidden>
                                    Tipo de incidencia
                                </option>
                                <option value="Limpieza">Limpieza</option>
                                <option value="Pago">Pago</option>
                                <option value="Wifi">Wifi</option>
                                <option value="Aclimatación">Aclimatación</option>
                                <option value="Iluminación">Iluminación</option>
                                <option value="Equipo">Equipo</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>Descripción</span>
                            <textarea
                                name="description"
                                required
                                value={description || ''}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </label>
                    </div>
                    <button>Enviar</button>
                </form>
            )}
            {new Date(booking.start_date) < start && (
                <button onClick={() => setButtonreview(!openButtonreview)}>review</button>
            )}
            {openButtonreview && (
                <form onSubmit={handleReview}>
                    <div>
                        <label>
                            <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                                <option value="" hidden>
                                    ¿Puntua tu experiencia!
                                </option>
                                <option value={5}>⭐⭐⭐⭐⭐</option>
                                <option value={4}>⭐⭐⭐⭐</option>
                                <option value={3}>⭐⭐⭐</option>
                                <option value={2}>⭐⭐</option>
                                <option value={1}>⭐</option>
                            </select>
                        </label>
                    </div>
                    <div>
                        <label>
                            <span>Descripción</span>
                            <textarea
                                name="text"
                                required
                                value={text || ''}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </label>
                    </div>

                    <button>Enviar</button>
                </form>
            )}
        </div>
    );
}

export default Booking;
