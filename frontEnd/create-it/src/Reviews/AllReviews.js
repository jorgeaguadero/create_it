import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function AllReviews() {
    const me = useSelector((s) => s.user);

    const { id_user } = me;

    const reviews = useFetch(`http://localhost:8080/api/reviews
    `);

    if (!reviews) {
        return <div>Loading...</div>;
    }
    if (reviews.error) {
        return <div className="error">{reviews.error}</div>;
    }
    return (
        <div className="userReviews">
            {reviews.map((r) => (
                <div key={r.id_booking}>
                    <span>id Reserva: {r.id_booking}</span>
                    <br />
                    <span>Espacio: {r.id_space}</span>
                    <br />
                    <span>Rating: {r.rating}</span>
                    <br />
                    <span>Descripción: {r.text}</span>
                    <br />
                </div>
            ))}
            {!reviews && <i>Loading...</i>}
            {reviews && reviews.length === 0 && <i>No hay reviews aún </i>}
        </div>
    );
}

export default AllReviews;
