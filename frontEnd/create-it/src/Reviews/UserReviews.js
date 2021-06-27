import './UserReviews.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function UserReviews() {
    const me = useSelector((s) => s.user);

    const { id_user } = me;

    const reviews = useFetch(`http://localhost:8080/api/users/${id_user}/reviews
    `);

    if (!reviews) {
        return <i>Loading...</i>;
    }
    if (reviews.error) {
        return <div className="error">{reviews.error}</div>;
    }
    return (
        <div className="UserReviews">
            {reviews.map((r) => (
                <div className="review-list" key={r.id_booking}>
                    <li>
                        <strong>Id Review: {r.id_review}</strong>
                    </li>
                    <li>id Reserva: {r.id_booking}</li>
                    <li>Espacio: {r.id_space}</li>
                    <li>Rating: {r.rating}</li>
                    <li>Descripción: {r.text}</li>
                </div>
            ))}
            {reviews && reviews.length === 0 && <i>No has hecho ninguna review todavia</i>}
        </div>
    );
}

export default UserReviews;
