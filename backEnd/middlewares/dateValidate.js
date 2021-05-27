//https://date-fns.org/v2.21.3/docs/Getting-Started
const { isEqual, isBefore, parseISO, isAfter } = require('date-fns');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const timeZone = 'Europe/Berlin';

//CONTROLES DE FECHAS PARA RESERVAS Y MODIFICACIONES
function isBeforeDate(start_date) {
    const eventDate = new Date();
    if (typeof start_date === 'string') {
        start_date = parseISO(start_date);
    }
    const result = isBefore(eventDate, start_date);
    return result;
}
//TODO corregir para que compare solo la fecha sin horas
function isAfterDate(start_date) {
    const evenDate = new Date();
    const result = isAfter(evenDate, start_date);
    if (!result) {
        const error = new Error('la fecha tiene que ser posterior a la reserva');
        throw error;
    }
    return evenDate;
}

function isEqualDate(start_date) {
    const evenDate = new Date();
    const result = isEqual(evenDate, start_date);
    if (!result) {
        const error = new Error('La incidencia tiene que ser el dia de tu reserva');
        throw error;
    }
    return evenDate;
}

function formatDate(date) {
    return (dateFormated = utcToZonedTime(date, timeZone));
}

//TODO EXTRAS
//TODO COMPARAR FECHA DE RESERVA  >= HOY

module.exports = {
    isBeforeDate,
    isAfterDate,
    isEqualDate,
    formatDate,
};
