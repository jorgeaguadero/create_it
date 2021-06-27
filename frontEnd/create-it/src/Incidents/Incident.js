import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

function Incident() {
    const [openIncident, setOpenIncident] = useState(false);
    const me = useSelector((s) => s.user);
    const history = useHistory();

    const { id_incident } = useParams();
    const incident = useFetch(`http://localhost:8080/api/incidents/${id_incident}`);

    const handleCloseIncident = async (e) => {
        e.preventDefault();
        const res = await fetch(`http://localhost:8080/api/incidents/${id_incident}`, {
            method: 'PATCH',
            body: JSON.stringify({ state: 1 }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + me.token,
            },
        });
        if (res.ok) {
            Swal.fire({
                title: 'Incidencia',
                text: 'Tu incidencia se ha cerrado correctamente',
                icon: 'success',
                timer: 1500,
            });
            history.push(`/profile/bookings/`);
        }
    };

    if (!incident) {
        return <div>Loading...</div>;
    }

    return (
        <div className="Incident">
            <Helmet>Incidencia {incident.id_incident}|CreateIt</Helmet>
            <h1>{incident.id_incident}</h1>
            <span>Reserva: {incident.booking}</span>
            <br />
            <span>Espacio: {incident.id_space}</span>
            <br />
            <span>Fecha de creación: {new Date(incident.incident_date).toLocaleDateString()}</span>
            <br />
            <span>Tipo: {incident.type}</span>
            <br />
            <span>Descripción: {incident.description}</span>
            <br />
            <span>Estado: {incident.state === 1 ? 'Cerrada' : 'Abierta'}</span>
            <br />
            {incident.closed_date && (
                <span>Fecha de cierre: {new Date(incident.closed_date).toLocaleDateString()}</span>
            )}

            {incident.state === 0 && me.role === 'admin' && (
                <button onClick={() => setOpenIncident(!openIncident)}>Cerrar Incidencia</button>
            )}
            {openIncident && (
                <div>
                    <p>¿Se ha solucionado la incidencia {incident.id_incident}?</p>
                    <button onClick={handleCloseIncident}>Confirmar</button>
                </div>
            )}
        </div>
    );
}

export default Incident;
