//https://date-fns.org/v2.21.3/docs/Getting-Started
const { format } = require('date-fns');

//TODO CONTROLES DE FECHAS PARA RESERVAS Y MODIFICACIONES
//TODO COMPARAR FECHA DE RESERVA  >= HOY
//TODO COMPARAR FECHA MODIFICACION DE RESERVA < FECHA DE RESERVA-1 DIA

//TODO COMPROBAR RANGO DE FECHAS SI LAS RESERVAS SON DE + DE UN DIA O COMPARAR RANGO DE HORAS
const { datesRepository } = require('../repositories');

async function updateDate(id_booking) {
    const eventDate = format(new Date(), 'yyyy/MM/dd');
    let bookingDate = await datesRepository.getbookingDate(id_booking);
}

async function validateUpdateDate(start_date) {}
module.exports = {
    updateDate,
    validateUpdateDate,
};
