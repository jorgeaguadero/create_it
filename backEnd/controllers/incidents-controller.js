const Joi = require('joi');

const { bookingsRepository, incidentsRepository } = require('../repositories');
const { isAfterDate, isEqualDate } = require('../middlewares/dateValidate');

//-->crear Incidencia (user)
async function createIncident(req, res, next) {
    try {
        const { id_user, id_booking } = req.params;
        const { id } = req.auth;
        const { type, description } = req.body;

        const schema = Joi.object({
            type: Joi.string().min(1).max(500).required(),
            description: Joi.string().min(1).max(500).required(),
        });

        await schema.validateAsync({ type, description });

        //TODO extraer como función ??
        if (Number(id_user) !== id) {
            const err = new Error('El usuario no tiene permisos');
            err.status = 403;
            throw err;
        }

        const booking = await bookingsRepository.getBookingById(id_booking);
        //comprobar que el incidente es el dia de la reserva por variar
        //const incident_date = isEqualDate(booking.start_date);
        const incident_date = isAfterDate(booking.start_date);
        const createdIncident = await incidentsRepository.createIncident(
            id_booking,
            incident_date,
            type,
            description,
            id_user
        );
        res.status(201);
        res.send(createdIncident);
    } catch (err) {
        next(err);
    }
}

//Ver incidencias por usuario
async function getIncidentsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;
        const { role, id } = req.auth;

        if (role === 'user' && Number(id_user) !== id) {
            const err = new Error('El usuario no tiene permisos');
            err.status = 403;
            throw err;
        }
        const reviews = await incidentsRepository.getIncidentsByUserId(id_user);
        res.send(reviews);
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

async function closeIncident(req, res, next) {
    try {
        const { id_incident } = req.params;
        const { state } = req.body;

        const schema = Joi.object({
            state: Joi.number().required(), //Cambiar a open/close?
        });

        await schema.validateAsync({ state });
        //TODO Validador de incidencias
        const closed_date = new Date();
        //TODO comprobar que está cerrada ya

        const closedIncident = await incidentsRepository.closeIncident(id_incident, closed_date, state);
        res.status(201);
        res.send(closedIncident);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createIncident,
    getIncidentsByUserId,
    getAllIncidents,
    closeIncident,
};
