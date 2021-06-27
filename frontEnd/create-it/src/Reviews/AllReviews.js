import './Reviews.css';
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
        <div className="AllReviews">
            {reviews.map((r) => (
                <div key={r.id_booking}>
                    <li>id Reserva: {r.id_booking}</li>
                    <li>Espacio: {r.id_space}</li>
                    <li>Rating: {r.rating}</li>
                    <li>Descripción: {r.text}</li>
                </div>
            ))}
            {!reviews && <i>Loading...</i>}
            {reviews && reviews.length === 0 && <i>No hay reviews aún </i>}
        </div>
    );
}

export default AllReviews;
