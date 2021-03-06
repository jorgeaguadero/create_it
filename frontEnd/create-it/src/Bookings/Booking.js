import './Booking.css';

import { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { priceFormated } from '../Helpers';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function Booking() {
    const [error, setError] = useState(null);
    const [openPay, setOpenPay] = useState(false);
    const [openIncident, setOpenIncident] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [openReview, setOpenReview] = useState(false);
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
    //const booking = useFetch(`http://localhost:8080/api/users/${id_user}/bookings/${id_booking}`);
    const booking = useFetch(`http://localhost:8080/api/bookings/${id_booking}`);

    const handleCancel = async (e) => {
        e.preventDefault();
        setError(null);
        setOpenCancel(!openCancel);
        const res = await fetch(`http://localhost:8080/api/bookings/${id_booking}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({
                title: 'Reserva',
                text: 'Tu reserva se ha cancelado correctamente',
                icon: 'success',
                timer: 1500,
            });
            history.push(`/profile/bookings/`);
        } else {
            setError(data.error);
        }
    };

    const handlePay = async (e) => {
        e.preventDefault();
        setError(null);
        setOpenPay(!openPay);
        const res = await fetch(`http://localhost:8080/api/bookings/${id_booking}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({
                title: 'Pago',
                text: 'Pago se ha realizado correctamente',
                icon: 'success',
                timer: 1500,
            });
            history.push(`/profile/bookings/`);
        } else {
            setError(data.error);
        }
    };

    const handleReview = async (e) => {
        e.preventDefault();
        setError(null);
        const res = await fetch(`http://localhost:8080/api/users/${id_user}/bookings/${id_booking}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, text }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire({
                title: 'Review',
                text: 'Tu review se ha cancelado correctamente',
                icon: 'success',
                timer: 1500,
            });
            history.push(`/profile/reviews`);
        } else {
            setError(data.error);
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
        const data = await res.json();
        if (res.ok) {
            Swal.fire({
                title: 'Incidencia',
                text: 'Tu incidencia se ha realizado correctamente',
                icon: 'success',
                timer: 1500,
            });
            history.push(`/profile/incidents/${data.id_incident}`);
        } else {
            setError(data.error);
        }
    };

    if (!booking) {
        return <div>Loading...</div>;
    }

    return (
        <div className="booking-indv">
            {booking && (
                <div className="booking-content">
                    <h1>Reserva:{booking.id_booking}</h1>
                    <li>Usuario: {booking.id_user}</li>
                    <li>Espacio: {booking.id_space}</li>
                    <li>Fecha: {new Date(booking.start_date).toLocaleDateString()}</li>
                    <li>Estado de pago: {booking.pending_payment === 0 ? 'Pagado' : 'Pendiente de pago'}</li>
                    <li>Precio: {priceFormated.format(booking.price)}</li>
                    <li>Fecha de realizaci??n: {new Date(booking.booking_date).toLocaleDateString()}</li>

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
                    {new Date(booking.start_date) > end && (
                        <button onClick={() => setOpenCancel(!openCancel)}>Cancelar</button>
                    )}
                    {openCancel && (
                        <div>
                            <p>Oh no! De verdad quieres cancelar tu reserva {booking.id_booking} ?</p>
                            <button onClick={handleCancel}>Confirmar cancelaci??n</button>
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
                                        <option value="Aclimataci??n">Aclimataci??n</option>
                                        <option value="Iluminaci??n">Iluminaci??n</option>
                                        <option value="Equipo">Equipo</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <li>Descripci??n</li>
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
                    {new Date(booking.start_date) < start && booking.review === 0 && (
                        <button onClick={() => setOpenReview(!openReview)}>review</button>
                    )}
                    {openReview && (
                        <form onSubmit={handleReview}>
                            <div>
                                <label>
                                    <select value={rating} onChange={(e) => setRating(e.target.value)} required>
                                        <option value="" hidden>
                                            ??Puntua tu experiencia!
                                        </option>
                                        <option value={5}>???????????????</option>
                                        <option value={4}>????????????</option>
                                        <option value={3}>?????????</option>
                                        <option value={2}>??????</option>
                                        <option value={1}>???</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    <li>Descripci??n</li>
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
                    {error && <div className="error">{error}</div>}
                </div>
            )}
        </div>
    );
}

export default Booking;
