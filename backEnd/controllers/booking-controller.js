const Joi = require('joi');
const { formatISO } = require('date-fns');

//TODO VALIDATE USER PASARLO A MIDDLEWARE Y ASI ADMIN PUEDE TENER PERMISOS EXTRA
const { validateUser } = require('../utils/users-auth');
const { bookingsRepository, extrasRepository } = require('../repositories');
const { isBeforeDate } = require('../middlewares/dateValidate');
//TODO CAMBIAR BASE DE DATOS PARA AJUSTAR A PAGOS !!!!
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

        if (!isBeforeDate(start_date)) {
            const error = new Error('la fecha tiene que ser posterior a hoy');
            throw error;
        }

        const priceRoom = await bookingsRepository.getRoomPrice(start_date, id_room);
        if (!id_extra) {
            const booking = await bookingsRepository.createBooking(id, id_room, start_date, priceRoom.price);
            res.status(201);

            res.send({
                booking: booking.id_booking,
                user: booking.id_user,
                room: booking.id_room,
                date: booking.start_date,
                price: booking.price,
            });
        } else {
            const priceExtra = await bookingsRepository.getExtraPrice(start_date, id_extra);
            //me devuelve la fecha con una hora menos-->un dia menos formateo a ISO
            const totalPrice = priceRoom.price + priceExtra.price;
            const booking = await bookingsRepository.createBookingWithExtra(
                id,
                id_room,
                id_extra,
                start_date,
                totalPrice
            );
            const fechaBien = formatISO(booking.start_date, { representation: 'date' });
            res.status(201);

            res.send(fechaBien);
        }
    } catch (err) {
        next(err);
    }
}
async function payBooking(req, res, next) {
    try {
        const { id_booking } = req.params;

        let booking = await bookingsRepository.getBookingByIdBookingById(id_booking);

        validateUser(req, booking);

        //TODO CAMBIAR BASE DE DATOS PARA AJUSTAR A PAGOS !!!!
        if (booking.payment_state === '1') {
            const error = new Error('ya está pagado');
            throw error;
        }

        booking = await bookingsRepository.payBooking(id_booking);

        res.status(201);

        res.send(`pago ${id_booking} realizado`);
    } catch (error) {
        next(error);
    }
}

//TODO EXTRA comprobar que estoy dentro del plazo para modificar
//TODO EXTRA modificar reserva

async function deleteBooking(req, res, next) {
    try {
        const { id_booking } = req.params;

        let booking = await bookingsRepository.getBookingByIdBookingById(id_booking);

        validateUser(req, booking);
        const start_date = booking.start_date;

        if (isBeforeDate(start_date)) {
            const error = new Error('Minimo tiene que haber un dia de antelacion');
            throw error;
        }

        booking = await bookingsRepository.deleteBooking(id_booking);

        res.status(201);

        res.send(`Reserva ${id_booking} cancelada`);
    } catch (error) {
        next(error);
    }
}

async function getBookingsByUser(req, res, next) {
    try {
        const { id_user } = req.params;
        validateUser(req, req.params);

        const bookings = await bookingsRepository.getBookingsByUser(id_user);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

async function getBookingsByRoom(req, res, next) {
    try {
        const { id_room } = req.params;
        const bookings = await bookingsRepository.getBookingsByRoom(id_room);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}
//Falta ajustar en repositorio
async function getBookingsBySpace(req, res, next) {
    try {
        const { id_space } = req.params;
        const bookings = await bookingsRepository.getBookingsBySpace(id_space);

        res.send(bookings);
    } catch (err) {
        next(err);
    }
}

module.exports = {
    createBooking,
    deleteBooking,
    getBookingsByUser,
    getBookingsByRoom,
    getBookingsBySpace,
    payBooking,
};
