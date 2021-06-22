import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function BookingsHistory() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.userId) : (id_user = id);

    const bookings = useFetch(`http://localhost:8080/api/users/2/bookings
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
                    <span>Precio --- {b.price}</span>
                    <br />
                    <span>Fecha --- {b.start_date}</span>
                    <br />
                    <button>Review</button>
    
                    <br />
                </div>
            ))}
            {!bookings && <i>Loading...</i>}
            {bookings && bookings.length===0 && <i>Aún no tienes reservas finalizadas</i>}
        </div>
    );
}

export default BookingsHistory;
