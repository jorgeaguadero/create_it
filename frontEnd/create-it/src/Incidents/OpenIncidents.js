import './Incidents.css';
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
        return <div>Loading...</div>;
    }
    if (incidents.error) {
        return <div className="error">{incidents.error}</div>;
    }
    return (
        <div className="OpenIncidents">
            {incidents &&
                incidents.map((i) => (
                    <div key={i.id_incident}>
                        <Link to={`/profile/incidents/${i.id_incident}`}>Incidencia: {i.id_incident}</Link>
                        <br />
                        <span>Fecha de la incidencia: {new Date(i.incident_date).toLocaleDateString()}</span>
                        <br />
                        <span>Estado: {i.state === 0 ? 'Abierta' : 'Cerrada'}</span>
                        <br />
                        <span>Descripción: {i.description}</span>
                        <br />
                        {i.closed_date && <span>Fecha de cierre: {new Date(i.closed_date).toLocaleDateString()}</span>}
                        <br />
                    </div>
                ))}
            {!incidents && <i>Loading...</i>}
            {incidents && incidents.length === 0 && <i>No hay incidencias abiertas</i>}
        </div>
    );
}

export default OpenIncidents;
