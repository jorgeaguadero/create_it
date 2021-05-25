const Joi = require('joi');

const { bookingsRepository, incidentsRepository } = require('../repositories');
const { isBeforeDate, isEqualDate, formatDate } = require('../middlewares/dateValidate');
const { validateProperty } = require('../utils/users-auth');

//-->crear Incidencia (user)
async function createIncident(req, res, next) {
    try {
        const { id_booking } = req.params;
        const { type, description } = req.body;
        const { id } = req.auth;
        const booking = await bookingsRepository.getBookingById(id_booking);
        validateProperty(req, booking);

        const schema = Joi.object({
            type: Joi.string().min(1).max(500).required(),
            description: Joi.string().min(1).max(500).required(),
        });
        await schema.validateAsync({ type, description });

        //comprobar que el incidente es el dia de la reserva por variar
        //const incident_date = isEqualDate(booking.start_date);
        //Para pruebas compruebo asi y meto la fecha desde aqui
        isBeforeDate(booking.start_date);
        const incident_date = new Date();
        let createdIncident = await incidentsRepository.createIncident(
            id_booking,
            booking.id_space,
            incident_date,
            type,
            description,
            id
        );
        createdIncident.state === 0 ? (createdIncident.state = 'Open') : (createdIncident.state = 'Closed');
        //const dateUTC = formatDate(createdIncident.incident_date);
        //TODO envio Mail
        res.status(201);
        res.send({
            'Id Incidencia': createIncident.id_incident,
            State: createdIncident.state,
            Message: createdIncident.incident_date,
        });
    } catch (err) {
        next(err);
    }
}

async function closeIncident(req, res, next) {
    try {
        const { id_incident } = req.params;
        const { state } = req.body;

        const schema = Joi.object({
            state: Joi.number().required(),
        });

        await schema.validateAsync({ state });

        const closed_date = new Date();
        //TODO comprobar que está cerrada ya
        let closedIncident = await incidentsRepository.getIncidentById(id_incident);
        if (closedIncident.state === 1) {
            const err = new Error('La incidencia está cerrada');
            err.httpCode = 401;
            throw err;
        }

        closedIncident = await incidentsRepository.closeIncident(id_incident, closed_date, state);
        closedIncident.state = 'Closed';
        //TODO envio Mail
        res.status(201);
        res.send(closedIncident);
    } catch (err) {
        next(err);
    }
}

//Ver incidencias por usuario
async function getIncidentsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;

        validateProperty(req, req.params);
        const incidents = await incidentsRepository.getIncidentsByUserId(id_user);

        res.send(incidents);
    } catch (err) {
        next(err);
    }
}

async function getAllIncidents(req, res, next) {
    try {
        const incidents = await incidentsRepository.getAllIncidents();
        res.send(incidents);
    } catch (err) {
        next(err);
    }
}

async function getIncidentsOpenBySpace(req, res, next) {
    try {
        const { id_space } = req.params;

        const incidents = await incidentsRepository.getIncidentsOpenBySpace(id_space);

        res.send(incidents);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createIncident,
    getIncidentsByUserId,
    getAllIncidents,
    closeIncident,
    getIncidentsOpenBySpace,
};
