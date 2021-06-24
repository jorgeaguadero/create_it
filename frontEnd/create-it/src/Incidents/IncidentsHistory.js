import './Profile.css';
import { Link, useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function IncidentsHistory() {
    const me = useSelector((s) => s.user);
    let id = '';
    const { id_user, id_space } = useParams();
    me ? (id = me.id_user) : (id = id_user);
    const history = useHistory();

    let url = '';
    me.role === 'admin'
        ? (url = `http://localhost:8080/api/spaces/1/incidents`)
        : (url = `http://localhost:8080/api/users/${id}/incidents`);

    const incidents = useFetch(url);

    if (!incidents) {
        return <div>Loading...</div>;
    }
    return (
        <div className="IncidentsHistory">
            {incidents.map((i) => (
                <div key={i.id_incident}>
                    <Link to={`/profile/incidents/${i.id_incident}`}>Incidencia: {i.id_incident}</Link>
                    <br />
                    <span>Fecha de la incidencia: {new Date(i.incident_date).toLocaleDateString()}</span>
                    <br />
                    <span>Estado: {i.state === 0 ? 'Abierta' : 'Cerrada'}</span>
                    <br />
                    {i.closed_date && <span>Fecha de cierre: {new Date(i.closed_date).toLocaleDateString()}</span>}
                    <br />
                    <span>Descripción: {i.description}</span>
                    <br />
                </div>
            ))}
            {!incidents && <i>Loading...</i>}
            {incidents && !incidents.length === 0 && <i>No hay incidencias abiertas</i>}
        </div>
    );
}

export default IncidentsHistory;
