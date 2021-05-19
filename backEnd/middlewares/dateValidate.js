//https://date-fns.org/v2.21.3/docs/Getting-Started
const { formatISO, isBefore, parseISO } = require('date-fns');

//CONTROLES DE FECHAS PARA RESERVAS Y MODIFICACIONES
function isBeforeDate(start_date) {
    const eventDate = new Date();
    const date = parseISO(start_date);
    const result = isBefore(eventDate, date);
    return result;
}

//TODO COMPARAR FECHA DE RESERVA  >= HOY

//TODO COMPARAR FECHA MODIFICACION DE RESERVA < FECHA DE RESERVA-1 DIA

//TODO COMPROBAR RANGO DE FECHAS SI LAS RESERVAS SON DE + DE UN DIA O COMPARAR RANGO DE HORAS

module.exports = {
    isBeforeDate,
};
