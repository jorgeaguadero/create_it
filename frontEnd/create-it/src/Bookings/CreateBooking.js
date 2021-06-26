import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import './Booking.css';

function CreateBooking({ id_room, start_date }) {
    //const [id_extra, setId_Extra] = useState(id_extra || '');
    const [error, setError] = useState();
    const history = useHistory();

    const userToken = useSelector((s) => s.user);

    const handleBooking = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:8080/api/bookings`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userToken.token,
            },
            body: JSON.stringify({ id_room, start_date }),
            method: 'POST',
        });

        const data = await res.json();
        if (res.ok) {
            Swal.fire({
                title: 'Reserva',
                text: 'Tu reserva se ha realizado correctamente',
                icon: 'success',
            });
            history.push(`/profile/bookings/${data.id_booking}`);
        } else {
            console.log('Error');
            setError(true);
        }
    };

    return (
        <div className="createBooking">
            <div className="bookingContainer">
                <h2>¿Reserva tu espacio!</h2>
                {userToken && (
                    <form onSubmit={handleBooking}>
                        <div>
                            Vas a reservar la sala {id_room} para el dia {start_date}
                        </div>
                        <button className="button">Reservar</button>
                    </form>
                )}
                {!userToken && (
                    <div>
                        <span>Para reservar tienes que registrarte!</span>
                        <br />
                        <Link to="/signup">Regístrate</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateBooking;
