import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function IncidentsHistory() {
    const me = useSelector((s) => s.user);
    let id = '';
    const { id_user } = useParams();

    me ? (id = me.id_user) : (id = id_user);
    const incidents = useFetch(`http://localhost:8080/api/users/${id}/incidents`);

    if (!incidents) {
        return <div>Loading...</div>;
    }
    return (
        <div className="user">
            {incidents.map((i) => (
                <div key={i.id_incident}>
                    <span>id Reserva --- {i.id_incident}</span>
                </div>
            ))}
            {!incidents && <i>Loading...</i>}
            {incidents && !incidents.length === 0 && <i>No tienes incidentes</i>}
        </div>
    );
}

export default IncidentsHistory;
