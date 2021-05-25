const { database } = require('../infrastructure');

async function getIncidentsByUserId(userId) {
    const query = 'SELECT * FROM incidents WHERE id_user = ?';
    //TODO try/catch gestion de errores-->si no hay nada
    const [reviews] = await database.pool.query(query, userId);

    return reviews;
}

async function getAllIncidents() {
    const query = 'SELECT * FROM reviews';
    const [reviews] = await database.pool.query(query);

    return reviews;
}

async function getIncidentById(id) {
    const query = 'SELECT * FROM incidents WHERE id_incident = ?';
    const [incident] = await database.pool.query(query, id);

    //TODO ver datos de devolucion
    return incident[0];
}

async function createIncident(bookingId, spaceId, incidentDate, type, description, userId) {
    const query =
        'INSERT INTO incidents (id_user,id_space,id_booking ,incident_date, type, description) VALUES (?, ?, ?,?, ?,?)';

    const [result] = await database.pool.query(query, [userId, spaceId, bookingId, incidentDate, type, description]);

    return getIncidentById(result.insertId);
}

async function closeIncident(id_incident, closed_date, state) {
    const query = 'UPDATE incidents SET closed_date=?, state=? where id_incident=?';

    await database.pool.query(query, [closed_date, state, id_incident]);

    return getIncidentById(id_incident);
}

async function getIncidentsOpenBySpace(id) {
    const query = 'SELECT * FROM incidents WHERE id_space = ? AND state=0';
    const incidents = await database.pool.query(query, id);

    //TODO ver datos de devolucion
    return incidents[0];
}

module.exports = {
    getAllIncidents,
    getIncidentsByUserId,
    createIncident,
    getIncidentById,
    closeIncident,
    getIncidentsOpenBySpace,
};
