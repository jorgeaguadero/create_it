import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory } from 'react-router-dom';
import useFetch from '../useFetch';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import './Incident.css';

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
        <div className="incident-indv">
            <div className="incident-content">
                <h1>Id de Incidencia: {incident.id_incident}</h1>
                <li>Reserva: {incident.id_booking}</li>
                <li>Espacio: {incident.id_space}</li>
                <li>Fecha de creación: {new Date(incident.incident_date).toLocaleDateString()}</li>
                <li>Tipo: {incident.type}</li>
                <li>Descripción: {incident.description}</li>
                <li>Estado: {incident.state === 1 ? 'Cerrada' : 'Abierta'}</li>

                {incident.closed_date && (
                    <li>Fecha de cierre: {new Date(incident.closed_date).toLocaleDateString()}</li>
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
        </div>
    );
}

export default Incident;
