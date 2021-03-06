const Joi = require('joi');
const { sendMails } = require('../utils/');

const { bookingsRepository, incidentsRepository, usersRepository } = require('../repositories');
const { validateAuth } = require('../middlewares');
const { ValidateDate } = require('../utils');
//const { sendMails } = require('../utils');

//7.1--> CREAR INCIDENCIA (user)
async function createIncident(req, res, next) {
    try {
        const { id_booking } = req.params;
        const { type, description } = req.body;
        const { id } = req.auth;
        const booking = await bookingsRepository.getBookingById(id_booking);
        const user = await usersRepository.getUserById(id);
        validateAuth.validateProperty(req, booking);

        const schema = Joi.object({
            type: Joi.string().min(1).max(500).required(),
            description: Joi.string().min(1).max(500).required(),
        });
        await schema.validateAsync({ type, description });

        const incident_date = ValidateDate.isEqualDate(booking.start_date);

        const createdIncident = await incidentsRepository.createIncident(
            id_booking,
            booking.id_space,
            incident_date,
            type,
            description,
            id
        );

        //const dateUTC = formatDate(createdIncident.incident_date);

        res.status(201);
        await sendMails.sendMail({
            to: user.email,
            subject: 'Incidencia creada || Create It',
            body: `Incidencia: ${createdIncident.id_incident} creada, para más info consulta en tu perfil, te avisaremos cuando esté cerrada ||  http://localhost:3000 `,
        });
        res.send(createdIncident);
    } catch (err) {
        next(err);
    }
}

//7.2-->ADMIN--> CERRAR INCIDENCIA
async function closeIncident(req, res, next) {
    try {
        const { id_incident } = req.params;
        const { state } = req.body;

        const schema = Joi.object({
            state: Joi.number().required(),
        });

        await schema.validateAsync({ state });

        const closed_date = new Date();

        let closedIncident = await incidentsRepository.getIncidentById(id_incident);
        const user = await usersRepository.getUserById(closedIncident.id_user);

        if (closedIncident.state === 1) {
            const err = new Error('La incidencia está cerrada');
            err.httpCode = 401;
            throw err;
        }

        closedIncident = await incidentsRepository.closeIncident(id_incident, closed_date, state);
        closedIncident.state = 'Closed';

        res.status(201);
        await sendMails.sendMail({
            to: user.email,
            subject: 'Incidencia creada || Create It',
            body: `Incidencia: ${id_incident} cerrada. ||  http://localhost:3000 `,
        });
        res.send(closedIncident);
    } catch (err) {
        next(err);
    }
}

async function getIncidentsByUserId(req, res, next) {
    try {
        const { id_user } = req.params;

        validateAuth.validateProperty(req, req.params);
        const incidents = await incidentsRepository.getIncidentsByUserId(id_user);

        res.send(incidents);
    } catch (err) {
        next(err);
    }
}
//7.3.1 VER INCIDENCIAS POR USUARIO
async function getIncidentById(req, res, next) {
    try {
        const { id_incident } = req.params;
        const incident = await incidentsRepository.getIncidentById(id_incident);

        validateAuth.validateProperty(req, incident);

        res.send(incident);
    } catch (err) {
        next(err);
    }
}
//7.3.2 VER INCIDENCIAS ABIERTAS POR ESPACIO
async function getIncidentsOpenBySpace(req, res, next) {
    try {
        const { id_space } = req.params;

        const incidents = await incidentsRepository.getIncidentsOpenBySpace(id_space);

        res.send(incidents);
    } catch (err) {
        next(err);
    }
}

//7.3.3 VER TODAS LAS INCIDENCIAS
async function getAllIncidents(req, res, next) {
    try {
        const incidents = await incidentsRepository.getAllIncidents();
        res.send(incidents);
    } catch (err) {
        next(err);
    }
}

async function getAllOpenIncidents(req, res, next) {
    try {
        const incidents = await incidentsRepository.getAllOpenIncidents();
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
    getIncidentById,
    getAllOpenIncidents,
};
