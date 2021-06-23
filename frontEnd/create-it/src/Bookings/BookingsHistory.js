import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

import { priceFormated } from '../Helpers';

function BookingsHistory() {
    const me = useSelector((s) => s.user);
    let idUser='';
    const { id } = useParams();

    me ? (idUser = me.id_user) : (idUser = id);

    const bookings = useFetch(`http://localhost:8080/api/users/${idUser}/bookings/completed
    `);

    if (!bookings) {
        return <div>Loading...</div>;
    }
    return (
        <div className="bookingsHistory">
            {bookings.map((b) => (
                <div key={b.id_booking}>
                    <span>id Reserva --- {b.id_booking}</span>
                    <br />
                    <span>Espacio --- {b.id_space}</span>
                    <br />
                    <span>Sala --- {b.id_room}</span>
                    <br />
                    <span>Pagado? --- {b.pending_payment}</span>
                    <br />
                    <span>Precio --- {priceFormated.format(b.price)}</span>
                    <br />
                    <span>Fecha --- {new Date(b.start_date).toLocaleDateString()}</span>
                    <br />
                    <button>Review</button>

                    <br />
                </div>
            ))}
            {!bookings && <i>Loading...</i>}
            {bookings && bookings.length === 0 && <i>Aún no tienes reservas finalizadas</i>}
        </div>
    );
}

export default BookingsHistory;
