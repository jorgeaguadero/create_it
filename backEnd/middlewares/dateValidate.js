//https://date-fns.org/v2.21.3/docs/Getting-Started --> start OF day
const { isEqual, isBefore, parseISO, isAfter, format } = require('date-fns');

//CONTROLES DE FECHAS PARA RESERVAS Y MODIFICACIONES
function isBeforeDate(start_date) {
    const evenDate = format(new Date(), 'yyyy,mm,dd');
    if (typeof start_date === 'string') {
        start_date = format(start_date, 'yyyy,mm,dd');
    }
    const result = isBefore(evenDate, start_date);
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

//TODO EXTRAS
//TODO COMPARAR FECHA DE RESERVA  >= HOY

module.exports = {
    isBeforeDate,
    isAfterDate,
    isEqualDate,
};
