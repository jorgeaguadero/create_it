import './OpenIncidents.css';
import { useState } from 'react';
import { Link, useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';

function OpenIncidents() {
    const me = useSelector((s) => s.user);
    let id = '';
    const { id_user } = useParams();
    me ? (id = me.id_user) : (id = id_user);

    let url = '';
    me.role === 'admin'
        ? (url = `http://localhost:8080/api/incidents`)
        : (url = `http://localhost:8080/api/users/${id}/incidents`);

    const incidents = useFetch(url);

    if (!incidents) {
        return <i>Loading...</i>;
    }
    if (incidents.error) {
        return <i className="error">{incidents.error}</i>;
    }
    return (
        <div className="OpenIncidents">
            {incidents &&
                incidents.map((i) => (
                    <div key={i.id_incident} className="incident-list">
                        <li>
                            <Link to={`/profile/incidents/${i.id_incident}`}>Incidencia: {i.id_incident}</Link>
                        </li>

                        <li>Fecha de la incidencia: {new Date(i.incident_date).toLocaleDateString()}</li>

                        <li>Estado: {i.state === 0 ? 'Abierta' : 'Cerrada'}</li>

                        <li>Descripción: {i.description}</li>

                        {i.closed_date && <li>Fecha de cierre: {new Date(i.closed_date).toLocaleDateString()}</li>}
                    </div>
                ))}
            {incidents && incidents.length === 0 && <i>No hay incidencias abiertas</i>}
        </div>
    );
}

export default OpenIncidents;
