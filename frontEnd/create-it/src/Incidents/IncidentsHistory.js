import './Profile.css';
import { useParams } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function IncidentsHistory() {
    const me = useSelector((s) => s.user);
    let id_user = '';
    const { id } = useParams();

    me ? (id_user = me.id_user) : (id_user = id);

    const incidents = useFetch(`http://localhost:8080/api/users/${id_user}/Incidents
    `);

    if (!incidents) {
        return <div>Loading...</div>;
    }
    if (incidents.error) {
        return <div className="error">{incidents.error}</div>;
    }
    return (
        <div className="user">
            {incidents.map((i) => (
                <div key={i.id_incident}>
                    <span>id Reserva --- {i.id_booking}</span>
                </div>
            ))}
            {!incidents && <i>Loading...</i>}
            {incidents && incidents.length === 0 && <i>No hay incidencias </i>}
        </div>
    );
}

export default IncidentsHistory;
