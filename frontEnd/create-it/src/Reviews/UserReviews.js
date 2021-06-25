import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function UserReviews() {
    const me = useSelector((s) => s.user);

    const { id_user } = me;

    const reviews = useFetch(`http://localhost:8080/api/users/${id_user}/reviews
    `);

    if (!reviews) {
        return <div>Loading...</div>;
    }
    return (
        <div className="userReviews">
            {reviews.map((r) => (
                <div key={r.id_booking}>
                    <span>id Reserva {r.id_booking}</span>
                    <br />
                    <span>Rating: {r.rating}</span>
                    <br />
                    <span>Descripción: {r.text}</span>
                    <br />
                </div>
            ))}
            {!reviews && <i>Loading...</i>}
            {reviews && reviews.length === 0 && <i>No has hecho ninguna review todavia</i>}
        </div>
    );
}

export default UserReviews;
