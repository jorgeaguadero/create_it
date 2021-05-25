//https://date-fns.org/v2.21.3/docs/Getting-Started
const { isEqual, isBefore, parseISO, isAfter } = require('date-fns');
const { zonedTimeToUtc, utcToZonedTime } = require('date-fns-tz');
const timeZone = 'Europe/Berlin';

//CONTROLES DE FECHAS PARA RESERVAS Y MODIFICACIONES
function isBeforeDate(start_date) {
    const eventDate = new Date();
    const date = parseISO(start_date);
    const result = isBefore(eventDate, date);
    return result;
}

function isAfterDate(start_date) {
    const eventDate = new Date();
    const result = isAfter(eventDate, start_date);
    if (!result) {
        const error = new Error('la fecha tiene que ser posterior a la reserva');
        throw error;
    }
    return (dateFormated = utcToZonedTime(evendate, timeZone));
}

function isEqualDate(start_date) {
    const eventDate = new Date();
    const result = isEqual(eventDate, start_date);
    if (!result) {
        const error = new Error('La incidencia tiene que ser el dia de tu reserva');
        throw error;
    }
    return eventDate;
}

function formatDate(date) {
    return (dateFormated = utcToZonedTime(date, timeZone));
}

//TODO EXTRAS
//TODO COMPARAR FECHA DE RESERVA  >= HOY
//TODO COMPARAR FECHA MODIFICACION DE RESERVA < FECHA DE RESERVA-1 DIA
//TODO COMPROBAR RANGO DE FECHAS SI LAS RESERVAS SON DE + DE UN DIA O COMPARAR RANGO DE HORAS

module.exports = {
    isBeforeDate,
    isAfterDate,
    isEqualDate,
    formatDate,
};
