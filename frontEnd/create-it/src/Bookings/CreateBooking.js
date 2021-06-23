import { useState } from 'react';
import { useSelector } from 'react-redux';

import './Booking.css';

function CreateBooking({ id_room, start_date }) {
    //const [id_extra, setId_Extra] = useState(id_extra || '');
    const [error, setError] = useState();

    const userToken = useSelector((s) => s.user);

    const handleSubmit = async (e) => {
        e.preventDefault();

       
           const res = await fetch(`http://localhost:8080/api/bookings`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + userToken.token,
            },
            body: JSON.stringify({ id_room, start_date }),
            method: 'POST',
        });
        if (res.ok) {
            console.log('ok');
        } else {
            console.log('Error');
            setError(true);
        } 
        

        
    };

    return (
        <div className="createBooking">
            <div className="bookingContainer">
                <form onSubmit={handleSubmit}>
                    <h2>¿Reserva tu espacio!</h2>
                    <div>
                        Vas a reservar la sala {id_room} para el dia {start_date}
                    </div>
                    <button className="button">Reservar</button>
                </form>
            </div>
        </div>
    );
}

export default CreateBooking;
