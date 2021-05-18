const Joi = require('joi');

const { bookingsRepository, extrasRepository } = require('../repositories');
const { validateUpdateDate, updateDate } = require('../middlewares/dateValidate');

async function createBooking(req, res, next) {
    try {
        const { id } = req.auth;
        const { id_room, id_extra, start_date } = req.body;

        const schema = Joi.object({
            id_room: Joi.number().required(),
            id_extra: Joi.number(),
            start_date: Joi.date().required(),
        });

        await schema.validateAsync({
            id_room,
            id_extra,
            start_date,
        });

        const priceRoom = await bookingsRepository.getRoomPrice(start_date, id_room);
        if (!id_extra) {
            const booking = await bookingsRepository.createBooking(id, id_room, start_date, priceRoom.price);
            res.status(201);

            res.send(booking);
        } else {
            const priceExtra = await bookingsRepository.getExtraPrice(start_date, id_extra);

            const totalPrice = priceRoom.price + priceExtra.price;
            booking = await bookingsRepository.createBookingWithExtra(id, id_room, id_extra, start_date, totalPrice);
            res.status(201);

            res.send(booking);
        }
    } catch (err) {
        next(err);
    }
}
/*async function updateBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
        const data = req.body;

    //todo comprobar que estoy dentro del plazo para modificar
    //todo modificar reserva

        res.status(201);

        res.send(`Datos de: ${extra.extra_code} cambiados`);
    } catch (error) {
        next(error);
    }
}*/
/*async function deleteBooking(req, res, next) {
    try {
        const { id_booking } = req.params;
       
    //todo comprobar que estoy dentro del plazo para cancelar
    //todo cancelar reserva

        res.status(201);

        res.send(`Reserva ${id_booking} cancelada`);
    } catch (error) {
        next(error);
    }
}*/
module.exports = {
    createBooking,
    updateBooking,
};
